
import { addDonation } from '../lib/storage';

/**
 * HitPay Webhook Endpoint
 * 
 * HitPay sends a POST request to this endpoint when a payment status changes.
 * We record completed payments as donations in our storage.
 * 
 * Docs: https://hit-pay.com/docs.html#webhook
 */
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const {
            payment_id,
            status,
            amount,
            reference_number,
            payer_name,
            payer_email
        } = req.body;

        console.log(`[Webhook] Received: payment_id=${payment_id}, status=${status}, amount=${amount}`);

        if (status === 'completed') {
            // Parse rider ID from the reference if available
            // Reference format from payment.ts: SAB-{timestamp}
            const riderId: number | null = null;

            addDonation(
                parseFloat(amount) || 0,
                riderId,
                payer_name || payer_email || 'HitPay Donor'
            );

            console.log(`[Webhook] Recorded donation: RM ${amount} from ${payer_name || 'Anonymous'}`);
        }

        // Always respond 200 to acknowledge receipt and prevent HitPay retries
        res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('[Webhook] Error processing callback:', error);
        // Still return 200 to prevent infinite retries from HitPay
        res.status(200).json({ success: true });
    }
}
