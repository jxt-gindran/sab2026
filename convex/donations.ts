import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
    args: {
        amount: v.number(),
        riderId: v.optional(v.number()),
        name: v.string(),
        email: v.optional(v.string()),
        message: v.optional(v.string()),
        paymentId: v.optional(v.string()),
        status: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("donations", {
            ...args,
            timestamp: Date.now(),
        });
    },
});

export const getTotal = query({
    args: {},
    handler: async (ctx) => {
        const donations = await ctx.db.query("donations").filter(q => q.eq(q.field("status"), "completed")).collect();
        return donations.reduce((sum, d) => sum + d.amount, 0);
    },
});
