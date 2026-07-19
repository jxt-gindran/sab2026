import { mutation, query, internalMutation, internalQuery, action } from "./_generated/server";
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
        address: v.optional(v.string()),       // Personal postal address (for tax receipt)
        type: v.optional(v.string()),          // 'hitpay' or 'manual'
        // ── Tax receipt fields (collected upfront in Step 4) ──────────────────
        receiptType:       v.optional(v.string()),   // 'none' | 'personal' | 'corporate'
        receiptRequested:  v.optional(v.boolean()),
        receiptName:       v.optional(v.string()),
        receiptIC:         v.optional(v.string()),
        receiptPhone:      v.optional(v.string()),
        receiptAddress:    v.optional(v.string()),
        receiptCompany:    v.optional(v.string()),
        receiptRegNo:      v.optional(v.string()),
        receiptBizAddress: v.optional(v.string()),
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
            address: args.address,
            // Receipt fields
            receiptType:       args.receiptType,
            receiptRequested:  args.receiptRequested,
            receiptName:       args.receiptName,
            receiptIC:         args.receiptIC,
            receiptPhone:      args.receiptPhone,
            receiptAddress:    args.receiptAddress,
            receiptCompany:    args.receiptCompany,
            receiptRegNo:      args.receiptRegNo,
            receiptBizAddress: args.receiptBizAddress,
        });
        const donationId = id.toString();

        // Notify Admin + Confirm to donor (Fire & Forget)
        if (type === 'manual') {
            await ctx.scheduler.runAfter(0, internal.email.sendAdminManualNotification, {
                donationId,
                name: args.name,
                amount: args.amount,
                phone: args.phone || '',
                ref: args.reference
            });
            // Confirmation to donor that we received their submission
            if (args.email) {
                await ctx.scheduler.runAfter(0, internal.email.sendManualSubmissionConfirmation, {
                    donationId,
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
                donationId: id.toString(),
                email: donation.email,
                name: donation.name,
                amount: donation.amount,
                ref: donation.paymentId || id.toString(),
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

// ─── Receipt tracking ─────────────────────────────────────────────────────────

/**
 * Fetch a single donation by its paymentId/reference (used by the /thank-you page).
 */
export const getByRef = query({
    args: { ref: v.string() },
    handler: async (ctx, args) => {
        const donation = await ctx.db
            .query("donations")
            .withIndex("by_paymentId", q => q.eq("paymentId", args.ref))
            .first();
        return donation ?? null;
    },
});

/**
 * Called from the /thank-you page when the donor submits the receipt form.
 * Stores receipt details and schedules Template 6 email to both admin Gmail addresses.
 */
export const requestReceipt = mutation({
    args: {
        ref:               v.string(),        // paymentId / reference to find the donation
        receiptType:       v.string(),        // 'personal' | 'corporate'
        // Personal
        receiptName:       v.optional(v.string()),
        receiptIC:         v.optional(v.string()),
        receiptPhone:      v.optional(v.string()),
        receiptAddress:    v.optional(v.string()),
        // Corporate
        receiptCompany:    v.optional(v.string()),
        receiptRegNo:      v.optional(v.string()),
        receiptBizAddress: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const donation = await ctx.db
            .query("donations")
            .withIndex("by_paymentId", q => q.eq("paymentId", args.ref))
            .first();

        if (!donation) throw new Error("Donation not found");
        if (donation.receiptRequested) return; // idempotent

        await ctx.db.patch(donation._id, {
            receiptType:       args.receiptType,
            receiptRequested:  true,
            receiptStatus:     "pending",
            receiptName:       args.receiptName,
            receiptIC:         args.receiptIC,
            receiptPhone:      args.receiptPhone,
            receiptAddress:    args.receiptAddress,
            receiptCompany:    args.receiptCompany,
            receiptRegNo:      args.receiptRegNo,
            receiptBizAddress: args.receiptBizAddress,
        });

        // Send Template 6 — receipt request email to both admin Gmail addresses
        await ctx.scheduler.runAfter(0, internal.email.sendReceiptRequest, {
            donorName:      donation.name,
            donorEmail:     donation.email || "—",
            donorPhone:     donation.phone || "—",
            amount:         donation.amount,
            ref:            args.ref,
            receiptType:    args.receiptType,
            // Personal
            receiptName:    args.receiptName,
            receiptIC:      args.receiptIC,
            receiptPhone:   args.receiptPhone,
            receiptAddress: args.receiptAddress,
            // Corporate
            receiptCompany:    args.receiptCompany,
            receiptRegNo:      args.receiptRegNo,
            receiptBizAddress: args.receiptBizAddress,
        });
    },
});

/**
 * Admin: mark a receipt as sent (stops the weekly reminder).
 */
export const markReceiptSent = mutation({
    args: { token: v.string(), id: v.id("donations") },
    handler: async (ctx, args) => {
        if (args.token !== (process.env.ADMIN_SECRET || "nadi-sab-2026-admin")) {
            throw new Error("Unauthorized");
        }
        await ctx.db.patch(args.id, {
            receiptStatus: "sent",
            receiptSentAt: Date.now(),
        });
    },
});

/**
 * Internal: fetch all donations with a pending receipt request (used by weekly cron).
 */
export const getPendingReceipts = internalQuery({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("donations")
            .withIndex("by_receipt_status", q => q.eq("receiptStatus", "pending"))
            .collect();
    },
});

/**
 * Internal action: send the weekly receipt reminder email.
 * Called by the cron job.
 */
export const sendWeeklyReceiptReminder = action({
    args: {},
    handler: async (ctx) => {
        const pending = await ctx.runQuery(internal.donations.getPendingReceipts);
        if (pending.length === 0) {
            console.log("[Cron] No pending receipts — skipping reminder.");
            return;
        }
        await ctx.runAction(internal.email.sendReceiptReminder, {
            pendingReceipts: pending.map((d: any) => ({
                name:        d.name,
                amount:      d.amount,
                ref:         d.paymentId || d._id,
                receiptType: d.receiptType || "personal",
                requestedAt: d.timestamp,
            })),
        });
        console.log(`[Cron] Reminder sent for ${pending.length} outstanding receipts.`);
    },
});
