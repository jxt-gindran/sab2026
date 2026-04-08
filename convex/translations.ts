import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/** Public query — fetch all translations for a given language. */
export const getByLang = query({
  args: { lang: v.string() },
  handler: async (ctx, { lang }) => {
    return await ctx.db
      .query("translations")
      .withIndex("by_lang", (q) => q.eq("lang", lang))
      .collect();
  },
});

/** Public query — list all distinct language codes that have translations in the DB. */
export const listLanguages = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("translations").collect();
    return [...new Set(all.map((t) => t.lang))];
  },
});

/** Mutation — insert or update a single translation key for a language. */
export const upsertKey = mutation({
  args: { lang: v.string(), key: v.string(), value: v.string() },
  handler: async (ctx, { lang, key, value }) => {
    const existing = await ctx.db
      .query("translations")
      .withIndex("by_lang_key", (q) => q.eq("lang", lang).eq("key", key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value });
    } else {
      await ctx.db.insert("translations", { lang, key, value });
    }
  },
});

/** Mutation — delete a single translation key for a language. */
export const deleteKey = mutation({
  args: { lang: v.string(), key: v.string() },
  handler: async (ctx, { lang, key }) => {
    const existing = await ctx.db
      .query("translations")
      .withIndex("by_lang_key", (q) => q.eq("lang", lang).eq("key", key))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

/** Mutation — delete ALL translation keys for a language (remove entire language). */
export const deleteLanguage = mutation({
  args: { lang: v.string() },
  handler: async (ctx, { lang }) => {
    const all = await ctx.db
      .query("translations")
      .withIndex("by_lang", (q) => q.eq("lang", lang))
      .collect();
    await Promise.all(all.map((t) => ctx.db.delete(t._id)));
  },
});
