import fs from 'fs';
import path from 'path';
import ridersData from '../data/riders.json';

// In Vercel environment, only /tmp is writable.
// In local environment, we can write to data/db.json but let's stick to /tmp for consistency or mock
const DB_PATH = process.env.VERCEL ? '/tmp/db.json' : path.join(process.cwd(), 'data', 'db_local.json');

// Interface
interface Rider {
    id: number;
    name: string;
    role: string;
    image: string;
    goal: number;
    raised: number; // Base amount from JSON
}

interface Donation {
    amount: number;
    riderId?: number | null;
    timestamp: number;
    name?: string;
}

interface DB {
    donations: Donation[];
    // We don't store riders here, we calculate them from base + donations
}

// Ensure local directory exists
if (!process.env.VERCEL && !fs.existsSync(path.dirname(DB_PATH))) {
    try { fs.mkdirSync(path.dirname(DB_PATH), { recursive: true }); } catch (e) { }
}

function readDB(): DB {
    if (fs.existsSync(DB_PATH)) {
        try {
            const data = fs.readFileSync(DB_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            console.error("Error reading DB", e);
            return { donations: [] };
        }
    }
    return { donations: [] };
}

function writeDB(data: DB) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error writing DB", e);
    }
}

export const getRidersWithStats = () => {
    const db = readDB();

    // Clone base data
    const riders = ridersData.map(r => ({ ...r }));

    // Add current donations
    riders.forEach(r => {
        const riderDonations = db.donations.filter(d => d.riderId === r.id);
        const total = riderDonations.reduce((sum, d) => sum + d.amount, 0);
        r.raised += total;
    });

    return riders;
};

export const getStats = () => {
    const db = readDB();
    const totalDonations = db.donations.reduce((sum, d) => sum + d.amount, 0);
    const baseRaised = ridersData.reduce((sum, r) => sum + r.raised, 0); // Original raised amount in JSON

    // NOTE: riders.json 'raised' is a snapshot. 
    // If we want total = base + new, we sum base + new.

    return {
        totalRaised: baseRaised + totalDonations,
        totalDonationsCount: db.donations.length, // + base estimate?
        breakdown: {
            base: baseRaised,
            new: totalDonations
        }
    };
};

export const addDonation = (amount: number, riderId: number | null, name: string) => {
    const db = readDB();
    const newDonation: Donation = {
        amount,
        riderId,
        name,
        timestamp: Date.now()
    };
    db.donations.push(newDonation);
    writeDB(db);
    return newDonation;
};
