import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve a _storage ID to a short-lived signed URL, or return undefined. */
async function resolveStorage(ctx: any, storageId: string | undefined): Promise<string | undefined> {
    if (!storageId) return undefined;
    try {
        return (await ctx.storage.getUrl(storageId)) ?? undefined;
    } catch {
        return undefined;
    }
}

// ── Public queries ────────────────────────────────────────────────────────────

/** Return all published press releases with resolved image + PDF URLs.
 *  Sorted: newest year first, then newest publishedAt within each year.
 */
export const list = query({
    args: {},
    handler: async (ctx) => {
        const releases = await ctx.db
            .query("pressReleases")
            .withIndex("by_published", (q: any) => q.eq("isPublished", true))
            .order("desc")
            .collect();

        return Promise.all(
            releases.map(async (r: any) => ({
                ...r,
                imageUrl: await resolveStorage(ctx, r.imageStorageId),
                pdfUrl:   await resolveStorage(ctx, r.pdfStorageId),
            }))
        );
    },
});

// ── Admin queries ─────────────────────────────────────────────────────────────

/** Return ALL press releases (published + drafts) for the admin panel. */
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const releases = await ctx.db
            .query("pressReleases")
            .order("desc")
            .collect();

        return Promise.all(
            releases.map(async (r: any) => ({
                ...r,
                imageUrl:        await resolveStorage(ctx, r.imageStorageId),
                pdfUrl:          await resolveStorage(ctx, r.pdfStorageId),
                _rawImageStorageId: r.imageStorageId,
                _rawPdfStorageId:   r.pdfStorageId,
            }))
        );
    },
});

// ── Mutations ─────────────────────────────────────────────────────────────────

export const upsert = mutation({
    args: {
        id:             v.optional(v.id("pressReleases")),
        title:          v.string(),
        description:    v.string(),
        year:           v.number(),
        imageStorageId: v.optional(v.id("_storage")),
        pdfStorageId:   v.optional(v.id("_storage")),
        isPublished:    v.boolean(),
        publishedAt:    v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, publishedAt, ...fields } = args;
        const ts = publishedAt ?? Date.now();

        if (id) {
            await ctx.db.patch(id, { ...fields, publishedAt: ts });
            return id;
        } else {
            return ctx.db.insert("pressReleases", { ...fields, publishedAt: ts });
        }
    },
});

export const remove = mutation({
    args: { id: v.id("pressReleases") },
    handler: async (ctx, { id }) => {
        const release = await ctx.db.get(id);
        if (!release) return;
        // Optionally clean up stored files — safe to skip if sharing storage
        await ctx.db.delete(id);
    },
});

// ── File upload ───────────────────────────────────────────────────────────────

/** Generate a one-time upload URL for storing press release assets. */
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return ctx.storage.generateUploadUrl();
    },
});
