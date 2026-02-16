

// Simple helper for robust response
const sendJson = (res: any, status: number, data: any) => {
    if (typeof res.status === 'function') {
        return res.status(status).json(data);
    } else {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(data));
    }
};

export default async function handler(req: any, res: any) {
    // Enable simple CORS for debugging if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        return res.end();
    }

    if (req.method !== 'POST') {
        return sendJson(res, 405, { message: 'Method Not Allowed' });
    }

    try {
        const { amount, name, email, reference, purpose } = req.body;

        if (!process.env.HITPAY_API_KEY) {
            console.error('HitPay API Key missing');
            return sendJson(res, 500, { message: 'Server Config Error: Missing API Key' });
        }

        const apiKey = process.env.HITPAY_API_KEY.trim();
        // Sandbox detection
        const isSandbox = apiKey.toLowerCase().startsWith('sb_') || apiKey.toLowerCase().startsWith('test_');

        const baseUrl = isSandbox
            ? 'https://api.sandbox.hit-pay.com/v1/payment-requests'
            : 'https://api.hit-pay.com/v1/payment-requests';

        console.log(`[HitPay] Sending request to ${baseUrl}`);

        const params = new URLSearchParams();
        params.append('amount', amount ? amount.toString() : '0');
        params.append('currency', 'MYR');
        params.append('reference_number', reference || `REF-${Date.now()}`);
        params.append('redirect_url', 'https://sab2026.vercel.app/#/donate');
        params.append('purpose', purpose || 'Donation');
        params.append('webhook', `https://${req.headers.host}/api/webhook`);

        // Optional fields
        if (email) params.append('email', email);
        if (name) params.append('name', name);

        // Fetch
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-BUSINESS-API-KEY': apiKey,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: params.toString()
        });

        // Safe Response Handling
        const rawText = await response.text();
        console.log('[HitPay] Raw Response:', rawText.substring(0, 500)); // Log first 500 chars

        let data;
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            console.error('HitPay returned non-JSON:', rawText);
            return sendJson(res, 502, {
                message: 'Payment Gateway Error: Invalid Response',
                raw: rawText.substring(0, 100)
            });
        }

        if (response.ok) {
            return sendJson(res, 200, { url: data.url });
        } else {
            console.error('HitPay API Error:', data);
            return sendJson(res, response.status || 500, {
                message: 'Payment Gateway Rejected Request',
                details: data
            });
        }

    } catch (error: any) {
        console.error('Critical Handler Error:', error);
        return sendJson(res, 500, {
            message: 'Internal Server Error',
            error: error.message || String(error)
        });
    }
}
