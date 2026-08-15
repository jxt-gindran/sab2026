"use node";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const createLink = action({
    args: {
        amount: v.number(),
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        riderId: v.optional(v.string()),
        purpose: v.string(),
        reference: v.string(),
        siteUrl: v.string(),
        message: v.optional(v.string()),
        icNumber: v.optional(v.string()),
        address: v.optional(v.string()),
        // Tax receipt intent fields
        receiptType: v.optional(v.string()),
        receiptRequested: v.optional(v.boolean()),
        receiptName: v.optional(v.string()),
        receiptIC: v.optional(v.string()),
        receiptPhone: v.optional(v.string()),
        receiptAddress: v.optional(v.string()),
        receiptCompany: v.optional(v.string()),
        receiptRegNo: v.optional(v.string()),
        receiptBizAddress: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.HITPAY_API_KEY;
        if (!apiKey) {
            throw new Error("Server Config Error: Missing HITPAY_API_KEY");
        }

        // 1. Store Pre-checkout intent (does NOT create a record in donations table)
        await ctx.runMutation(internal.donations.savePaymentIntent, {
            reference: args.reference,
            amount: args.amount,
            name: args.name,
            email: args.email,
            phone: args.phone,
            riderId: args.riderId,
            message: args.message,
            icNumber: args.icNumber,
            address: args.address,
            receiptType: args.receiptType,
            receiptRequested: args.receiptRequested,
            receiptName: args.receiptName,
            receiptIC: args.receiptIC,
            receiptPhone: args.receiptPhone,
            receiptAddress: args.receiptAddress,
            receiptCompany: args.receiptCompany,
            receiptRegNo: args.receiptRegNo,
            receiptBizAddress: args.receiptBizAddress,
        });

        const isSandbox = apiKey.startsWith("sb_") || apiKey.startsWith("test_");
        const baseUrl = isSandbox
            ? "https://api.sandbox.hit-pay.com/v1/payment-requests"
            : "https://api.hit-pay.com/v1/payment-requests";

        const params = new URLSearchParams();
        params.append("amount", args.amount.toString());
        params.append("currency", "MYR");
        params.append("reference_number", args.reference);
        // Include ?ref= in the redirect_url so the return page can identify the session immediately
        params.append("redirect_url", `${args.siteUrl}/thank-you?ref=${args.reference}`);
        params.append("purpose", args.purpose);
        params.append("name", args.name);
        if (args.email) params.append("email", args.email);
        if (args.phone) params.append("phone", args.phone);

        // Webhook configuration
        const webhookUrl = process.env.CONVEX_SITE_URL
            ? `${process.env.CONVEX_SITE_URL}/hitpay`
            : "https://limitless-dragon-854.convex.site/hitpay";
        params.append("webhook", webhookUrl);

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

        // 2. Attach HitPay Payment Request ID to intent
        if (data.id) {
            await ctx.runMutation(internal.donations.updatePaymentIntentHitPayId, {
                reference: args.reference,
                hitpayRequestId: data.id,
            });
        }

        return { url: data.url, id: data.id };
    }
});

type VerifyPaymentResult = 
    | { verified: true; status: 'completed'; donationId: any }
    | { verified: false; status?: string; error?: string };

/**
 * Verify payment status with HitPay API (called from /thank-you if webhook hasn't arrived yet).
 */
export const verifyPayment = action({
    args: {
        ref: v.string(), // could be SAB-17xxxx or HitPay Request UUID
    },
    handler: async (ctx, args): Promise<VerifyPaymentResult> => {
        const apiKey = process.env.HITPAY_API_KEY;
        if (!apiKey) throw new Error("Missing HITPAY_API_KEY");

        const isSandbox = apiKey.startsWith("sb_") || apiKey.startsWith("test_");
        const baseUrl = isSandbox
            ? "https://api.sandbox.hit-pay.com/v1/payment-requests"
            : "https://api.hit-pay.com/v1/payment-requests";

        let paymentRequestId = args.ref;
        let referenceNumber = args.ref;

        // If it's our SAB- reference, find the HitPay ID from paymentIntents
        if (args.ref.startsWith("SAB-")) {
            const intent: any = await ctx.runQuery(internal.donations.getPaymentIntent, { reference: args.ref });
            if (intent?.hitpayRequestId) {
                paymentRequestId = intent.hitpayRequestId;
            }
        }

        try {
            const response = await fetch(`${baseUrl}/${paymentRequestId}`, {
                method: "GET",
                headers: {
                    "X-BUSINESS-API-KEY": apiKey,
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (!response.ok) {
                console.warn(`[verifyPayment] HitPay lookup failed for ${paymentRequestId}: ${response.status}`);
                return { verified: false };
            }

            const data = await response.json();
            if (data.status === "completed") {
                const donationId: any = await ctx.runMutation(internal.donations.recordPayment, {
                    amount: parseFloat(data.amount) || 0,
                    paymentId: data.id || paymentRequestId,
                    reference: data.reference_number || referenceNumber,
                    name: data.name || data.email || 'HitPay Donor',
                    email: data.email,
                    status: 'completed',
                    type: 'hitpay',
                    message: `Via HitPay (ref: ${data.reference_number || referenceNumber})`
                });
                return { verified: true, status: 'completed', donationId };
            }

            return { verified: false, status: data.status };
        } catch (err) {
            console.error("[verifyPayment] Error checking HitPay status:", err);
            return { verified: false, error: String(err) };
        }
    }
});

