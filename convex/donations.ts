import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Public mutation for manual entry (always pending verification)
export const add = mutation({
    args: {
        amount: v.number(),
        riderId: v.optional(v.number()),
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()), // Required for WhatsApp contact, optional for HitPay initially
        message: v.optional(v.string()),
        reference: v.optional(v.string()), // For manual ref match or hitpay reference
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

        // Notify Admin (Fire & Forget)
        if (type === 'manual') {
            await ctx.scheduler.runAfter(0, internal.email.sendAdminManualNotification, {
                name: args.name,
                amount: args.amount,
                phone: args.phone || '',
                ref: args.reference
            });
        }

        return id;
    },
});

// Internal mutation for webhook to record verified payment
export const recordPayment = internalMutation({
    args: {
        amount: v.number(),
        paymentId: v.string(), // Actual HitPay payment_id
        reference: v.optional(v.string()), // Our generated SAB reference
        name: v.string(),
        email: v.optional(v.string()),
        riderId: v.optional(v.number()),
        status: v.string(),
        type: v.string(),
        message: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // First try to find by reference (this is what we saved in addDonation as paymentId)
        if (args.reference) {
            const existing = await ctx.db
                .query("donations")
                .withIndex("by_paymentId", q => q.eq("paymentId", args.reference))
                .first();

            if (existing) {
                if (existing.status === 'completed') {
                    console.warn(`[recordPayment] Duplicate execution for reference ${args.reference} — skipping`);
                    return existing._id;
                }

                // Update existing record
                await ctx.db.patch(existing._id, {
                    status: args.status,
                    paymentId: args.paymentId, // Replace reference with actual payment_id
                    message: args.message ? (existing.message ? existing.message + " | " + args.message : args.message) : existing.message,
                });
                return existing._id;
            }
        }

        // Idempotency: skip if this paymentId was already recorded
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

        // Fallback: create a new record if reference not found (e.g. legacy or skipped addDonation)
        return await ctx.db.insert("donations", {
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
    },
});

export const getTotal = query({
    args: {},
    handler: async (ctx) => {
        const donations = await ctx.db.query("donations").withIndex("by_status", q => q.eq("status", "completed")).collect();
        return donations.reduce((sum, d) => sum + d.amount, 0);
    },
});
