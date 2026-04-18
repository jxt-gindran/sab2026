import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { MutationCtx } from "./_generated/server";

// ─── Shared helpers ────────────────────────────────────────────────────────────

/**
 * Sync a specific cyclist's raised total when a donation for them transitions
 * between completed <-> non-completed.
 */
async function syncCyclistRaised(
    ctx: MutationCtx,
    shareSlug: string,
    amount: number,
    prevStatus: string,
    nextStatus: string,
) {
    const cyclist = await ctx.db
        .query("cyclists")
        .withIndex("by_slug", q => q.eq("shareSlug", shareSlug))
        .first();
    if (!cyclist) return;

    const current = cyclist.raised ?? 0;
    if (prevStatus !== "completed" && nextStatus === "completed") {
        await ctx.db.patch(cyclist._id, { raised: current + amount });
    } else if (prevStatus === "completed" && nextStatus !== "completed") {
        await ctx.db.patch(cyclist._id, { raised: Math.max(0, current - amount) });
    }
}

/**
 * Distribute a general-fund donation equally across all active (non-archived)
 * cyclists. Called when riderId is absent and status transitions to completed.
 * On reversal (completed → failed/voided) the share is subtracted.
 */
async function distributeGeneralFund(
    ctx: MutationCtx,
    amount: number,
    prevStatus: string,
    nextStatus: string,
) {
    const allCyclists = await ctx.db.query("cyclists").collect();
    const active = allCyclists.filter(c => c.isArchived !== true);
    if (active.length === 0) return;

    const share = amount / active.length;

    for (const cyclist of active) {
        const current = cyclist.raised ?? 0;
        if (prevStatus !== "completed" && nextStatus === "completed") {
            await ctx.db.patch(cyclist._id, { raised: Math.round((current + share) * 100) / 100 });
        } else if (prevStatus === "completed" && nextStatus !== "completed") {
            await ctx.db.patch(cyclist._id, { raised: Math.max(0, Math.round((current - share) * 100) / 100) });
        }
    }
}

// ─── Public mutation: donor submission ────────────────────────────────────────

export const add = mutation({
    args: {
        amount: v.number(),
        riderId: v.optional(v.string()),
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        message: v.optional(v.string()),
        reference: v.optional(v.string()),
        icNumber: v.optional(v.string()),
        type: v.optional(v.string()), // 'hitpay' or 'manual'
    },
    handler: async (ctx, args) => {
        const type = args.type || 'manual';
        const id = await ctx.db.insert("donations", {
            amount: args.amount,
            riderId: args.riderId,
            name: args.name,
            email: args.email,
            message: args.message,
            paymentId: args.reference,
            timestamp: Date.now(),
            status: 'pending',
            type: type,
            phone: args.phone,
            icNumber: args.icNumber,
        });

        // Notify Admin + Confirm to donor (Fire & Forget)
        if (type === 'manual') {
            await ctx.scheduler.runAfter(0, internal.email.sendAdminManualNotification, {
                name: args.name,
                amount: args.amount,
                phone: args.phone || '',
                ref: args.reference
            });
            // Confirmation to donor that we received their submission
            if (args.email) {
                await ctx.scheduler.runAfter(0, internal.email.sendManualSubmissionConfirmation, {
                    email: args.email,
                    name: args.name,
                    amount: args.amount,
                    ref: args.reference || 'N/A',
                    beneficiary: args.riderId || undefined,
                });
            }
        }

        return id;
    },
});

// ─── Internal mutation: HitPay webhook ───────────────────────────────────────

export const recordPayment = internalMutation({
    args: {
        amount: v.number(),
        paymentId: v.string(),
        reference: v.optional(v.string()),
        name: v.string(),
        email: v.optional(v.string()),
        riderId: v.optional(v.string()),
        status: v.string(),
        type: v.string(),
        message: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // ── Path 1: Match existing pending record by reference ───────────────
        if (args.reference) {
            const existing = await ctx.db
                .query("donations")
                .withIndex("by_paymentId", q => q.eq("paymentId", args.reference))
                .first();

            if (existing) {
                if (existing.status === 'completed') {
                    console.warn(`[recordPayment] Duplicate for ref ${args.reference} — skipping`);
                    return existing._id;
                }

                await ctx.db.patch(existing._id, {
                    status: args.status,
                    paymentId: args.paymentId,
                    message: args.message
                        ? (existing.message ? existing.message + " | " + args.message : args.message)
                        : existing.message,
                });

                // Sync cyclist(s) raised
                if (existing.status !== "completed" && args.status === "completed") {
                    if (existing.riderId) {
                        await syncCyclistRaised(ctx, existing.riderId, existing.amount, existing.status, args.status);
                    } else {
                        // General Fund → distribute equally across all active cyclists
                        await distributeGeneralFund(ctx, existing.amount, existing.status, args.status);
                    }
                }

                return existing._id;
            }
        }

        // ── Path 2: Idempotency guard by paymentId ───────────────────────────
        if (args.paymentId) {
            const existing = await ctx.db
                .query("donations")
                .withIndex("by_paymentId", q => q.eq("paymentId", args.paymentId))
                .first();
            if (existing) {
                console.warn(`[recordPayment] Duplicate paymentId ${args.paymentId} — skipping`);
                return existing._id;
            }
        }

        // ── Path 3: Fallback — create new record ─────────────────────────────
        const newId = await ctx.db.insert("donations", {
            amount: args.amount,
            riderId: args.riderId,
            name: args.name,
            email: args.email,
            message: args.message,
            paymentId: args.paymentId,
            timestamp: Date.now(),
            status: args.status,
            type: args.type,
        });

        if (args.status === "completed") {
            if (args.riderId) {
                await syncCyclistRaised(ctx, args.riderId, args.amount, "pending", args.status);
            } else {
                await distributeGeneralFund(ctx, args.amount, "pending", args.status);
            }
        }

        return newId;
    },
});

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getTotal = query({
    args: {},
    handler: async (ctx) => {
        const donations = await ctx.db
            .query("donations")
            .withIndex("by_status", q => q.eq("status", "completed"))
            .collect();
        return donations.reduce((sum, d) => sum + d.amount, 0);
    },
});

/**
 * admin: breakdown of online vs manual completed donations.
 * Formula: onlineTotal + manualTotal = totalFundRaised
 */
export const getDonationBreakdown = query({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db
            .query("donations")
            .withIndex("by_status", q => q.eq("status", "completed"))
            .collect();
        const onlineTotal = all.filter(d => d.type === "hitpay").reduce((s, d) => s + d.amount, 0);
        const manualTotal = all.filter(d => d.type === "manual").reduce((s, d) => s + d.amount, 0);
        return {
            onlineTotal,
            manualTotal,
            totalFundRaised: onlineTotal + manualTotal,
            count: {
                online: all.filter(d => d.type === "hitpay").length,
                manual: all.filter(d => d.type === "manual").length,
            },
        };
    },
});

/**
 * admin: list all donations (any status), newest first.
 */
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("donations").collect();
        return all.sort((a, b) => b.timestamp - a.timestamp);
    },
});

// ─── Admin auth ────────────────────────────────────────────────────────────────
const ADMIN_SECRET = process.env.ADMIN_SECRET || "nadi-sab-2026-admin";

/**
 * admin: update donation status.
 * - Specific cyclist donation → increments/decrements cyclist.raised
 * - General fund donation → distributes/reclaims equally across all active cyclists
 */
export const updateStatus = mutation({
    args: { token: v.string(), id: v.id("donations"), status: v.string() },
    handler: async (ctx, { token, id, status }) => {
        if (token !== ADMIN_SECRET) throw new Error("Unauthorized");

        const donation = await ctx.db.get(id);
        if (!donation) return;

        const previousStatus = donation.status;
        await ctx.db.patch(id, { status });

        if (donation.riderId) {
            // Specific cyclist donation
            await syncCyclistRaised(ctx, donation.riderId, donation.amount, previousStatus, status);
        } else {
            // General Fund → distribute/reclaim equally
            await distributeGeneralFund(ctx, donation.amount, previousStatus, status);
        }

        // Send approval confirmation to donor when manual donation is marked completed
        if (donation.type === 'manual' && previousStatus !== 'completed' && status === 'completed' && donation.email) {
            await ctx.scheduler.runAfter(0, internal.email.sendManualApproved, {
                email: donation.email,
                name: donation.name,
                amount: donation.amount,
                ref: donation.paymentId || id,
                beneficiary: donation.riderId || undefined,
            });
        }
    },
});

/**
 * admin: comprehensive analytics summary for the dashboard home.
 */
export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("donations").collect();
        const completed = all.filter(d => d.status === "completed");
        const pending   = all.filter(d => d.status === "pending");

        const onlineTotal = completed.filter(d => d.type === "hitpay").reduce((s, d) => s + d.amount, 0);
        const manualTotal = completed.filter(d => d.type === "manual").reduce((s, d) => s + d.amount, 0);
        const totalFund   = onlineTotal + manualTotal;
        const avgDonation = completed.length ? totalFund / completed.length : 0;

        const recentDonations = [...all]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5);

        return {
            totalFund,
            onlineTotal,
            manualTotal,
            completedCount: completed.length,
            pendingCount: pending.length,
            pendingOnline: pending.filter(d => d.type === "hitpay").length,
            pendingManual: pending.filter(d => d.type === "manual").length,
            avgDonation,
            recentDonations,
        };
    },
});
