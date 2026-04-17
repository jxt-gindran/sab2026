import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    donations: defineTable({
        amount: v.number(),
        riderId: v.optional(v.string()), // 0 or null for general
        name: v.string(),
        email: v.optional(v.string()),
        message: v.optional(v.string()),
        timestamp: v.number(),
        paymentId: v.optional(v.string()), // HitPay ID or Manual REF
        status: v.string(), // 'completed', 'pending'
        type: v.string(), // 'hitpay', 'manual'
        phone: v.optional(v.string()),
        icNumber: v.optional(v.string())
    })
        .index("by_status", ["status"])
        .index("by_paymentId", ["paymentId"]),
    
    cyclists: defineTable({
        name: v.string(),
        role: v.string(), // "Cyclist", "Medic", "Support"
        story: v.optional(v.string()),
        goal: v.number(),
        raised: v.number(),
        profileUrl: v.optional(v.string()), // Main profile picture
        galleryUrls: v.optional(v.array(v.string())), // Up to 3 additional images
        isFeatured: v.boolean(),
        isArchived: v.optional(v.boolean()), // For past events/retired cyclists
        shareSlug: v.string(), // Unique slug for share link e.g. "john-doe"
        /**
         * Per-language content overrides.
         * Keys are ISO language codes (e.g. "ms", "zh").
         * Each entry may override name, role, and/or story.
         * Falls back to the base English fields if not present.
         */
        translations: v.optional(v.record(v.string(), v.object({
            name:  v.optional(v.string()),
            role:  v.optional(v.string()),
            story: v.optional(v.string()),
        }))),
    }).index("by_slug", ["shareSlug"])
      .index("by_featured", ["isFeatured"]),

    settings: defineTable({
        key: v.string(),
        value: v.string(),
        isSecret: v.boolean(),
    }).index("by_key", ["key"]),

    content: defineTable({
        page: v.string(),
        section: v.string(),
        type: v.string(), // "text", "image", "html"
        value: v.string(),
    }).index("by_page_section", ["page", "section"]),

    routeMap: defineTable({
        fileName: v.string(),
        storageId: v.id("_storage"),
        fileUrl: v.string(),
        isActive: v.boolean(),
        uploadedAt: v.number()
    }).index("by_active", ["isActive"]),

    mapMarkers: defineTable({
        name: v.string(),
        lat: v.number(),
        lng: v.number(),
        type: v.string(), // "start", "stop", "finish"
        description: v.optional(v.string()),
        orderIndex: v.number(), // to keep them correctly sorted along the route
    }).index("by_order", ["orderIndex"]),

    /**
     * i18n translations.
     * lang  = ISO language code, e.g. "ms", "zh"
     * key   = dot-notation UI key, e.g. "navbar.home"
     * value = translated string
     * English ("en") is never stored here — it lives in lib/i18n/en.ts
     */
    translations: defineTable({
        lang:  v.string(),
        key:   v.string(),
        value: v.string(),
    })
        .index("by_lang", ["lang"])
        .index("by_lang_key", ["lang", "key"]),

    /**
     * Impact tier cards for the donate page slider.
     * charity = "maps" | "mypopi"
     * tier    = minimum donation amount (RM)
     */
    impactTiers: defineTable({
        charity:     v.string(),   // "maps" | "mypopi"
        tier:        v.number(),   // minimum RM amount
        title:       v.optional(v.string()), // MAPS: title
        category:    v.optional(v.string()), // MyPOPI: category
        description: v.string(),
        isActive:    v.optional(v.boolean()),
    })
        .index("by_charity", ["charity"])
        .index("by_charity_tier", ["charity", "tier"]),
});

