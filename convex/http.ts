import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

/**
 * Compute HMAC-SHA256 using Web Crypto API (works in Convex V8 runtime).
 */
async function computeHmacSha256(key: string, message: string): Promise<string> {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(key),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

http.route({
    path: "/hitpay",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        let body: Record<string, any>;

        try {
            const rawText = await request.text();
            body = JSON.parse(rawText);
        } catch (e) {
            console.error("[Webhook] Failed to parse body");
            return new Response("Invalid Body", { status: 400 });
        }

        // ─── SIGNATURE VERIFICATION ───────────────────────────
        // HitPay sends an HMAC-SHA256 signature in the `hmac` field
        // calculated over sorted key=value pairs (excluding `hmac` itself).
        const salt = process.env.HITPAY_SALT;
        if (salt) {
            const receivedHmac = body.hmac;
            if (!receivedHmac) {
                console.error("[Webhook] Missing HMAC signature in payload");
                return new Response("Unauthorized: Missing Signature", { status: 401 });
            }

            // HitPay HMAC: sort keys alphabetically, concatenate key + value, HMAC-SHA256
            const sortedKeys = Object.keys(body)
                .filter(k => k !== 'hmac')
                .sort();
            const signaturePayload = sortedKeys.map(k => `${k}${body[k]}`).join('');
            const computedHmac = await computeHmacSha256(salt, signaturePayload);

            if (computedHmac !== receivedHmac) {
                console.error(`[Webhook] HMAC mismatch. Computed: ${computedHmac}, Received: ${receivedHmac}`);
                return new Response("Unauthorized: Invalid Signature", { status: 401 });
            }

            console.log("[Webhook] HMAC signature verified ✓");
        } else {
            console.warn("[Webhook] HITPAY_SALT not set — skipping signature verification (INSECURE)");
        }

        // ─── PROCESS PAYMENT ──────────────────────────────────
        const {
            payment_id,
            status,
            amount,
            reference_number,
            payer_name,
            payer_email
        } = body;

        console.log(`[Webhook] Payment ${payment_id}: ${status} (ref: ${reference_number})`);

        if (status === 'completed') {
            await ctx.runMutation(internal.donations.recordPayment, {
                amount: parseFloat(amount) || 0,
                riderId: undefined,
                name: payer_name || payer_email || 'HitPay Donor',
                email: payer_email,
                paymentId: payment_id,
                status: 'completed',
                type: 'hitpay',
                message: `Via HitPay (ref: ${reference_number || 'N/A'})`
            });
        }

        return new Response("OK", { status: 200 });
    }),
});

export default http;
