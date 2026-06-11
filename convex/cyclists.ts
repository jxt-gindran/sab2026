import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mock auth secret matching admin.ts
const ADMIN_SECRET = process.env.ADMIN_SECRET || "nadi-sab-2026-admin";

/**
 * Resolve a value that is either:
 *  1. A plain external URL (not Convex)   → returned as-is
 *  2. An EXPIRED Convex signed URL        → storageId extracted, re-resolved fresh
 *     Pattern: https://*.convex.cloud/api/storage/<storageId>
 *  3. A raw Convex storage ID             → resolved to a fresh signed URL
 *
 * This fixes both:
 *  - Existing records that stored the full signed URL (now expired)
 *  - New records that store just the storageId (our new approach)
 */
async function resolveUrl(ctx: any, urlOrId: string | undefined): Promise<string | undefined> {
    if (!urlOrId) return undefined;

    // Case 2: Expired Convex storage signed URL — extract storageId and re-resolve
    const convexMatch = urlOrId.match(/convex\.cloud\/api\/storage\/([^?#]+)/);
    if (convexMatch) {
        try {
            const resolved = await ctx.storage.getUrl(convexMatch[1]);
            return resolved ?? urlOrId; // fallback to original if resolve fails
        } catch {
            return urlOrId;
        }
    }

    // Case 1: Any other plain URL (external CDN, direct link, etc.) — pass through
    if (urlOrId.startsWith('https://') || urlOrId.startsWith('http://') || urlOrId.startsWith('/')) {
        return urlOrId;
    }

    // Case 3: Raw Convex storage ID — resolve fresh
    try {
        const resolved = await ctx.storage.getUrl(urlOrId);
        return resolved ?? undefined;
    } catch {
        return undefined;
    }
}

/** Resolve profileUrl and each galleryUrl on a cyclist record.
 *  Also returns _rawProfileUrl and _rawGalleryUrls with the original stored values
 *  so the admin edit form can persist the raw storageId back to the DB.
 */
async function resolveCyclistUrls(ctx: any, c: any) {
    const profileUrl = await resolveUrl(ctx, c.profileUrl);
    const galleryUrls = c.galleryUrls
        ? await Promise.all((c.galleryUrls as string[]).map(u => resolveUrl(ctx, u)))
        : c.galleryUrls;
    return {
        ...c,
        profileUrl,
        galleryUrls,
        _rawProfileUrl: c.profileUrl,
        _rawGalleryUrls: c.galleryUrls,
    };
}

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const cyclists = await ctx.db.query("cyclists").order("desc").collect();
        return Promise.all(cyclists.map(c => resolveCyclistUrls(ctx, c)));
    },
});

export const listFeatured = query({
    args: {},
    handler: async (ctx) => {
        const results = await ctx.db.query("cyclists")
            .withIndex("by_featured", q => q.eq("isFeatured", true))
            .collect();
        const active = results.filter(c => c.isArchived !== true);
        return Promise.all(active.map(c => resolveCyclistUrls(ctx, c)));
    },
});

export const getBySlug = query({
    args: { shareSlug: v.string() },
    handler: async (ctx, args) => {
        const c = await ctx.db.query("cyclists")
            .withIndex("by_slug", q => q.eq("shareSlug", args.shareSlug))
            .first();
        if (!c) return null;
        return resolveCyclistUrls(ctx, c);
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
        hideFundraising: v.optional(v.boolean()),
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
            hideFundraising: args.hideFundraising,
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
        hideFundraising: v.optional(v.boolean()),
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
            hideFundraising: args.hideFundraising,
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
