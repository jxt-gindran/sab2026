
import { addDonation } from '../lib/storage';

export default function handler(req: any, res: any) {
    if (req.method === 'POST') {
        try {
            const { amount, name, email, purpose, reference, riderId } = req.body;

            // Save donation with riderId (if present)
            const donation = addDonation(amount, riderId || null, name || 'Anonymous');

            res.status(200).json({ success: true, donation });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
