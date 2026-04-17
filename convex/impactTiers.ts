import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { MAPS_SEED, MYPOPI_SEED } from "./impactSeed";

/** List all impact tiers for a given charity, sorted by tier asc. */
export const listByCharity = query({
  args: { charity: v.string() },
  handler: async (ctx, { charity }) => {
    const rows = await ctx.db
      .query("impactTiers")
      .withIndex("by_charity", (q) => q.eq("charity", charity))
      .collect();
    return rows.sort((a, b) => a.tier - b.tier);
  },
});

/** List all impact tiers (both charities). */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("impactTiers").collect();
  },
});

/** Upsert (create or update) a single impact tier. */
export const upsert = mutation({
  args: {
    id:          v.optional(v.id("impactTiers")),
    charity:     v.string(),
    tier:        v.number(),
    title:       v.optional(v.string()),
    category:    v.optional(v.string()),
    description: v.string(),
    isActive:    v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    if (id) {
      await ctx.db.patch(id, fields);
      return id;
    }
    return await ctx.db.insert("impactTiers", { ...fields, isActive: fields.isActive ?? true });
  },
});

/** Delete a single impact tier. */
export const remove = mutation({
  args: { id: v.id("impactTiers") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

/**
 * Seed the DB with the hardcoded defaults if no records exist.
 * Call once from admin or on first load.
 */
export const seedDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("impactTiers").collect();
    if (existing.length > 0) return { seeded: false, count: existing.length };

    const all = [
      ...MAPS_SEED.map((d) => ({ ...d, charity: "maps",   isActive: true })),
      ...MYPOPI_SEED.map((d) => ({ ...d, charity: "mypopi", isActive: true })),
    ];
    for (const row of all) {
      await ctx.db.insert("impactTiers", row);
    }
    return { seeded: true, count: all.length };
  },
});
