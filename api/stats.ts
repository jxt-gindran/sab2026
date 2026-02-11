
import { getStats } from '../lib/storage';

export default function handler(req: any, res: any) {
    try {
        const stats = getStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
}
