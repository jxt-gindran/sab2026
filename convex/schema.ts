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
        icNumber: v.optional(v.string()),
        address: v.optional(v.string()),  // Postal address (for tax receipt upfront)
        reference: v.optional(v.string()), // SAB-17xxxxxx reference number
        // ── Tax receipt tracking ──────────────────────────────────────────────
        receiptType:       v.optional(v.string()),  // 'none' | 'personal' | 'corporate'
        receiptRequested:  v.optional(v.boolean()),
        receiptStatus:     v.optional(v.string()),  // 'pending' | 'sent'
        receiptSentAt:     v.optional(v.number()),
        // Personal receipt fields (pre-filled from donor info)
        receiptName:       v.optional(v.string()),
        receiptIC:         v.optional(v.string()),
        receiptPhone:      v.optional(v.string()),
        receiptAddress:    v.optional(v.string()),
        // Corporate receipt fields
        receiptCompany:    v.optional(v.string()),
        receiptRegNo:      v.optional(v.string()),
        receiptBizAddress: v.optional(v.string()),
    })
        .index("by_status", ["status"])
        .index("by_paymentId", ["paymentId"])
        .index("by_reference", ["reference"])
        .index("by_receipt_status", ["receiptStatus"]),

    /**
     * Temporary storage for checkout session data before payment is confirmed.
     * Prevents uncompleted/abandoned checkouts from polluting the main donations table.
     */
    paymentIntents: defineTable({
        reference: v.string(), // SAB-17xxxxxx
        hitpayRequestId: v.optional(v.string()), // HitPay Payment Request UUID
        amount: v.number(),
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        riderId: v.optional(v.string()),
        message: v.optional(v.string()),
        icNumber: v.optional(v.string()),
        address: v.optional(v.string()),
        // Tax receipt intent
        receiptType: v.optional(v.string()),
        receiptRequested: v.optional(v.boolean()),
        receiptName: v.optional(v.string()),
        receiptIC: v.optional(v.string()),
        receiptPhone: v.optional(v.string()),
        receiptAddress: v.optional(v.string()),
        receiptCompany: v.optional(v.string()),
        receiptRegNo: v.optional(v.string()),
        receiptBizAddress: v.optional(v.string()),
        status: v.string(), // 'initiated' | 'fulfilled'
        createdAt: v.number(),
    })
        .index("by_reference", ["reference"])
        .index("by_hitpayRequestId", ["hitpayRequestId"]),

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
        hideFundraising: v.optional(v.boolean()), // Hide from public donor cyclist-selector
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
        title:       v.optional(v.string()), // MAPS: title (English)
        category:    v.optional(v.string()), // MyPOPI: category (English)
        description: v.string(),             // English description
        isActive:    v.optional(v.boolean()),
        /**
         * Per-language content overrides.
         * Keys are ISO language codes (e.g. "ms").
         * Falls back to the English fields above.
         */
        translations: v.optional(v.record(v.string(), v.object({
            title:       v.optional(v.string()),
            category:    v.optional(v.string()),
            description: v.optional(v.string()),
        }))),
    })
        .index("by_charity", ["charity"])
        .index("by_charity_tier", ["charity", "tier"]),

    /**
     * Press releases for the Media Enquiries page.
     * year        = calendar year used for section separators (e.g. 2026)
     * publishedAt = timestamp for ordering within a year (newest first)
     * imageStorageId / pdfStorageId = Convex _storage IDs
     */
    pressReleases: defineTable({
        title:          v.string(),
        description:    v.string(),
        year:           v.number(),
        imageStorageId: v.optional(v.id("_storage")),
        pdfStorageId:   v.optional(v.id("_storage")),
        isPublished:    v.boolean(),
        publishedAt:    v.number(),
    })
        .index("by_published", ["isPublished"])
        .index("by_year",      ["year"])
        .index("by_year_date", ["year", "publishedAt"]),

    /**
     * Email log — one entry per transactional email attempt.
     * templateId  = 'thank_you' | 'manual_submitted' | 'manual_approved' | 'admin_hitpay' | 'admin_manual' | 'receipt_request' | 'receipt_reminder'
     * status      = 'sent' | 'failed'
     * donationId  = string ID of the related donation (optional for cron/test emails)
     */
    emailLogs: defineTable({
        donationId:    v.optional(v.string()),   // donation._id as string
        templateId:    v.string(),               // which template fired
        toEmail:       v.string(),               // recipient
        subject:       v.string(),               // email subject line
        status:        v.string(),               // 'sent' | 'failed'
        errorMessage:  v.optional(v.string()),   // error detail on failure
        transactionId: v.optional(v.string()),   // EngineMailer TxID
        sentAt:        v.number(),               // timestamp
    })
        .index("by_donation", ["donationId"])
        .index("by_status",   ["status"])
        .index("by_sentAt",   ["sentAt"]),
});
