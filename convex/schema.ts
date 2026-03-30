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
        shareSlug: v.string() // Unique slug for share link e.g. "john-doe"
    }).index("by_slug", ["shareSlug"]),

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
});
