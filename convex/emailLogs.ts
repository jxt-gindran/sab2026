import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Write one row to emailLogs.
 */
export const logEmail = internalMutation({
    args: {
        donationId:    v.optional(v.string()),
        templateId:    v.string(),
        toEmail:       v.string(),
        subject:       v.string(),
        status:        v.string(),
        errorMessage:  v.optional(v.string()),
        transactionId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("emailLogs", {
            donationId:    args.donationId,
            templateId:    args.templateId,
            toEmail:       args.toEmail,
            subject:       args.subject,
            status:        args.status,
            errorMessage:  args.errorMessage,
            transactionId: args.transactionId,
            sentAt:        Date.now(),
        });
    },
});

/**
 * Query email logs for a specific donation.
 */
export const getEmailLogs = internalQuery({
    args: { donationId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("emailLogs")
            .withIndex("by_donation", q => q.eq("donationId", args.donationId))
            .order("desc")
            .collect();
    },
});

/**
 * Fetch a single log entry by ID.
 */
export const getLogById = internalQuery({
    args: { logId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.logId as any);
    },
});
