import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mock auth secret matching admin.ts
const ADMIN_SECRET = process.env.ADMIN_SECRET || "nadi-sab-2026-admin";

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("cyclists").order("desc").collect();
    },
});

export const listFeatured = query({
    args: {},
    handler: async (ctx) => {
        const results = await ctx.db.query("cyclists")
            .withIndex("by_featured", q => q.eq("isFeatured", true))
            .collect();
        return results.filter(c => c.isArchived !== true);
    },
});

export const getBySlug = query({
    args: { shareSlug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query("cyclists")
            .withIndex("by_slug", q => q.eq("shareSlug", args.shareSlug))
            .first();
    },
});

export const add = mutation({
    args: { 
        token: v.string(),
        name: v.string(),
        role: v.string(),
        story: v.optional(v.string()),
        goal: v.number(),
        profileUrl: v.optional(v.string()),
        galleryUrls: v.optional(v.array(v.string())),
        isFeatured: v.boolean(),
        isArchived: v.optional(v.boolean()),
        shareSlug: v.string(),
        raised: v.optional(v.number()),
        translations: v.optional(v.record(v.string(), v.object({
            name:  v.optional(v.string()),
            role:  v.optional(v.string()),
            story: v.optional(v.string()),
        }))),
    },
    handler: async (ctx, args) => {
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");
        
        await ctx.db.insert("cyclists", {
            name: args.name,
            role: args.role,
            story: args.story,
            goal: args.goal,
            raised: 0,
            profileUrl: args.profileUrl,
            galleryUrls: args.galleryUrls,
            isFeatured: args.isFeatured,
            isArchived: args.isArchived,
            shareSlug: args.shareSlug,
            translations: args.translations,
        });
    },
});

export const update = mutation({
    args: { 
        token: v.string(),
        id: v.id("cyclists"),
        name: v.string(),
        role: v.string(),
        story: v.optional(v.string()),
        goal: v.number(),
        profileUrl: v.optional(v.string()),
        galleryUrls: v.optional(v.array(v.string())),
        isFeatured: v.boolean(),
        isArchived: v.optional(v.boolean()),
        shareSlug: v.string(),
        raised: v.optional(v.number()),
        translations: v.optional(v.record(v.string(), v.object({
            name:  v.optional(v.string()),
            role:  v.optional(v.string()),
            story: v.optional(v.string()),
        }))),
    },
    handler: async (ctx, args) => {
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");
        
        await ctx.db.patch(args.id, {
            name: args.name,
            role: args.role,
            story: args.story,
            goal: args.goal,
            profileUrl: args.profileUrl,
            galleryUrls: args.galleryUrls,
            isFeatured: args.isFeatured,
            isArchived: args.isArchived,
            shareSlug: args.shareSlug,
            raised: args.raised,
            translations: args.translations,
        });
    },
});

export const toggleFeatured = mutation({
    args: { token: v.string(), id: v.id("cyclists"), isFeatured: v.boolean() },
    handler: async (ctx, args) => {
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");
        await ctx.db.patch(args.id, { isFeatured: args.isFeatured });
    },
});

export const toggleArchived = mutation({
    args: { token: v.string(), id: v.id("cyclists"), isArchived: v.boolean() },
    handler: async (ctx, args) => {
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");
        await ctx.db.patch(args.id, { isArchived: args.isArchived });
    },
});

export const remove = mutation({
    args: { token: v.string(), id: v.id("cyclists") },
    handler: async (ctx, args) => {
        if (args.token !== ADMIN_SECRET) throw new Error("Unauthorized");
        const cyclist = await ctx.db.get(args.id);
        if (!cyclist) throw new Error("Not found");
        if (cyclist.raised > 0) {
            throw new Error("Cannot delete a cyclist who has already raised funds. Please archive them instead.");
        }
        await ctx.db.delete(args.id);
    },
});
