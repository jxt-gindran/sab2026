import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/hitpay",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        let body;
        try {
            const text = await request.text();
            body = JSON.parse(text);
        } catch (e) {
            return new Response("Invalid Body", { status: 400 });
        }

        const {
            payment_id,
            status,
            amount,
            reference_number,
            payer_name,
            payer_email
        } = body;

        console.log(`[Convex Webhook] Payment ${payment_id}: ${status}`);

        if (status === 'completed') {
            await ctx.runMutation(internal.donations.recordPayment, {
                amount: parseFloat(amount) || 0,
                riderId: undefined,
                name: payer_name || payer_email || 'HitPay Donor',
                email: payer_email,
                paymentId: payment_id,
                status: 'completed',
                type: 'hitpay',
                message: 'Via HitPay Webhook'
            });
        }

        return new Response("Success", { status: 200 });
    }),
});

export default http;
