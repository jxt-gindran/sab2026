
import { addDonation } from '../lib/storage';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { amount, name, email, reference, purpose, riderId } = req.body;

    if (!process.env.HITPAY_API_KEY) {
        return res.status(500).json({ message: 'Server Error: Missing API Key' });
    }

    const apiKey = process.env.HITPAY_API_KEY.trim();

    // Validation: Ensure user didn't paste a URL
    if (apiKey.includes('http') || apiKey.includes('://')) {
        return res.status(500).json({
            message: 'Configuration Error: Invalid API Key format',
            details: 'It looks like you pasted a URL (http...) instead of the API Key. Please update Vercel Environment Variables.'
        });
    }

    try {
        // Record donation intent locally
        addDonation(amount, riderId || null, name || 'Anonymous');

        // Determine environment based on API Key prefix
        // Sandbox keys can start with 'sb_' or 'test_' depending on HitPay version
        const isSandbox = apiKey.toLowerCase().startsWith('sb_') || apiKey.toLowerCase().startsWith('test_');

        const baseUrl = isSandbox
            ? 'https://api.sandbox.hit-pay.com/v1/payment-requests'
            : 'https://api.hit-pay.com/v1/payment-requests';

        const params = new URLSearchParams({
            amount: amount.toString(),
            currency: 'MYR',
            reference_number: reference,
            redirect_url: 'https://sab2026.vercel.app/#/donate',
            purpose: purpose || `Donation ${reference}`
        });

        // Only append optional fields if they have values to avoid sending empty strings if API prevents it
        if (email) params.append('email', email);
        if (name) params.append('name', name);

        console.log(`[HitPay] Initializing payment. Sandbox: ${isSandbox}, URL: ${baseUrl}`);

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-BUSINESS-API-KEY': apiKey,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: params.toString()
        });

        const data = await response.json();

        if (response.ok) {
            console.log('[HitPay] Success:', data.url);
            return res.status(200).json({ url: data.url });
        } else {
            console.error('HitPay Error Response:', data);
            return res.status(response.status).json({
                message: 'Payment creation failed',
                details: data,
                debug: {
                    sentKeywords: isSandbox ? 'SANDBOX' : 'PRODUCTION',
                    targetUrl: baseUrl,
                    keyPrefix: apiKey.substring(0, 3) + '...'
                }
            });
        }
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
