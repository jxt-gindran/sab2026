
import { getRidersWithStats } from '../lib/storage';

export default function handler(req: any, res: any) {
    try {
        const riders = getRidersWithStats();
        res.status(200).json(riders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
}
