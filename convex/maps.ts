import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- ROUTES / MAP FILES ---

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const saveRouteFile = mutation({
    args: {
        storageId: v.id("_storage"),
        fileName: v.string(),
    },
    handler: async (ctx, args) => {
        // Deactivate previously active routes
        const activeRoutes = await ctx.db
            .query("routeMap")
            .withIndex("by_active", q => q.eq("isActive", true))
            .collect();
            
        for (const route of activeRoutes) {
            await ctx.db.patch(route._id, { isActive: false });
        }

        const fileUrl = await ctx.storage.getUrl(args.storageId);
        
        if (!fileUrl) {
            throw new Error("Failed to get URL for uploaded file.");
        }

        const id = await ctx.db.insert("routeMap", {
            fileName: args.fileName,
            storageId: args.storageId,
            fileUrl,
            isActive: true,
            uploadedAt: Date.now()
        });

        return id;
    }
});

export const getActiveRoute = query({
    handler: async (ctx) => {
        const route = await ctx.db
            .query("routeMap")
            .withIndex("by_active", q => q.eq("isActive", true))
            .first();
            
        if (!route) return null;
        
        // Always generate a fresh URL in case it expired, though storage URLs are usually stable in production
        const url = await ctx.storage.getUrl(route.storageId);
        return { ...route, fileUrl: url || route.fileUrl };
    }
});

// --- MARKERS / PIT STOPS ---

export const getMarkers = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("mapMarkers")
            .withIndex("by_order")
            .collect();
    }
});

export const addMarker = mutation({
    args: {
        name: v.string(),
        lat: v.number(),
        lng: v.number(),
        type: v.string(), // "start", "stop", "finish"
        description: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        // Find highest order index
        const allMarkers = await ctx.db.query("mapMarkers").collect();
        const maxOrder = allMarkers.length > 0 
            ? Math.max(...allMarkers.map(m => m.orderIndex)) 
            : -1;

        return await ctx.db.insert("mapMarkers", {
            ...args,
            orderIndex: maxOrder + 1
        });
    }
});

export const updateMarkerOrder = mutation({
    args: {
        markerId: v.id("mapMarkers"),
        newOrderIndex: v.number()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.markerId, { orderIndex: args.newOrderIndex });
    }
});

export const removeMarker = mutation({
    args: {
        markerId: v.id("mapMarkers")
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.markerId);
    }
});
