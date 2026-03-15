import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Simple hardcoded admin token for demonstration, in a real app use Clerk or strong hashed token.
// The frontend will pass this token with all admin requests.
const ADMIN_SECRET = process.env.ADMIN_SECRET || "nadi-sab-2026-admin";

// Check if token is valid
export const verifyAdmin = query({
    args: { token: v.string() },
    handler: async (_, args) => {
        return args.token === ADMIN_SECRET;
    },
});

// Settings Management
export const getSettings = query({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");
        return await ctx.db.query("settings").collect();
    },
});

export const updateSetting = mutation({
    args: { token: v.string(), key: v.string(), value: v.string(), isSecret: v.boolean() },
    handler: async (ctx, args) => {
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");
        
        const existing = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value, isSecret: args.isSecret });
        } else {
            await ctx.db.insert("settings", { key: args.key, value: args.value, isSecret: args.isSecret });
        }
    },
});

// Content Management
export const getContent = query({
    args: {}, // Content is public, no token needed for reading
    handler: async (ctx) => {
        return await ctx.db.query("content").collect();
    },
});

export const updateContent = mutation({
    args: { token: v.string(), page: v.string(), section: v.string(), type: v.string(), value: v.string() },
    handler: async (ctx, args) => {
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");

        const existing = await ctx.db
            .query("content")
            .withIndex("by_page_section", (q) => q.eq("page", args.page).eq("section", args.section))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value, type: args.type });
        } else {
            await ctx.db.insert("content", { page: args.page, section: args.section, type: args.type, value: args.value });
        }
    },
});

// Image Uploads
export const generateUploadUrl = mutation({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");
        return await ctx.storage.generateUploadUrl();
    },
});

export const getImageUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});
