import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Public mutation for manual entry (always pending verification)
export const add = mutation({
    args: {
        amount: v.number(),
        riderId: v.optional(v.number()),
        name: v.string(),
        email: v.optional(v.string()),
        message: v.optional(v.string()),
        reference: v.optional(v.string()), // For manual ref match
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("donations", {
            amount: args.amount,
            riderId: args.riderId,
            name: args.name,
            email: args.email,
            message: args.message,
            paymentId: args.reference,
            timestamp: Date.now(),
            status: 'pending',
            type: 'manual',
        });
    },
});

// Internal mutation for webhook to record verified payment
export const recordPayment = internalMutation({
    args: {
        amount: v.number(),
        paymentId: v.string(),
        name: v.string(),
        email: v.optional(v.string()),
        riderId: v.optional(v.number()),
        status: v.string(),
        type: v.string(),
        message: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
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
