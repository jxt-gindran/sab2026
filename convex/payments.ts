"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const createLink = action({
    args: {
        amount: v.number(),
        name: v.string(),
        email: v.string(),
        purpose: v.string(),
        reference: v.string(),
        siteUrl: v.string()
    },
    handler: async (_, args) => {
        const apiKey = process.env.HITPAY_API_KEY;
        if (!apiKey) {
            throw new Error("Server Config Error: Missing HITPAY_API_KEY");
        }

        const isSandbox = apiKey.startsWith("sb_") || apiKey.startsWith("test_");
        const baseUrl = isSandbox
            ? "https://api.sandbox.hit-pay.com/v1/payment-requests"
            : "https://api.hit-pay.com/v1/payment-requests";

        const params = new URLSearchParams();
        params.append("amount", args.amount.toString());
        params.append("currency", "MYR");
        params.append("reference_number", args.reference);
        params.append("redirect_url", `${args.siteUrl}/#/thank-you`);
        params.append("purpose", args.purpose);
        params.append("name", args.name);
        params.append("email", args.email);
        // Webhook needs to be the Convex HTTP endpoint
        // We'll rely on global configuration or arguments if needed, but for now we won't set a webhook dynamically from here 
        // because we need the deployment URL.
        // Alternatively, we can pass it from client if they know it, or just rely on HitPay dashboard settings?
        // Better: use ctx.auth (not available)
        // We will omit webhook for now or try to infer. 
        // Actually, createLink is enough.

        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-BUSINESS-API-KEY": apiKey,
                "X-Requested-With": "XMLHttpRequest"
            },
            body: params.toString()
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error("HitPay API Error: " + text);
        }

        const data = await response.json();
        return { url: data.url };
    }
});
