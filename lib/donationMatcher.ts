// ── Donation data schemas ─────────────────────────────────────────────────────

export interface MapsItem {
  tier: number;
  title: string;
  description: string;
}

export interface MypopiItem {
  tier: number;
  category: string;
  description: string;
}

export const MAPS_DATA: MapsItem[] = [
  { tier: 100,  title: 'Supporting Recovery',       description: 'Helping a child heal after surgery with essential care items (stoma bags, dressings, catheters, transport support).' },
  { tier: 150,  title: 'Fuel for Healing',          description: 'Providing specialised formula milk for children with complex gut conditions.' },
  { tier: 200,  title: 'Opening the Door to Surgery', description: 'Helping families meet surgical deposits so treatment is not delayed.' },
  { tier: 1000, title: 'Equipping Life-Saving Care', description: 'Supporting critical equipment and consumables needed during surgery and recovery.' },
  { tier: 5000, title: 'Transforming Long-Term Care', description: 'Supporting a perfusor machine for bowel management programmes (for children with short bowel syndrome, intestinal failure, global developmental delay, and complex nutritional needs).' },
];

export const MYPOPI_DATA: MypopiItem[] = [
  { tier: 50,    category: 'Start Strong: Screening',          description: 'Screens 1 newborn.' },
  { tier: 100,   category: 'Start Strong: Screening',          description: 'Supports early detection outreach & awareness.' },
  { tier: 200,   category: 'Start Strong: Screening',          description: 'Expands access to screening in underserved areas.' },
  { tier: 300,   category: 'Find Answers: Diagnosis',          description: 'Subsidises initial immunology tests.' },
  { tier: 500,   category: 'Bridge the Gap: Access to Care',   description: 'Covers travel & accommodation for hospital visits.' },
  { tier: 800,   category: 'Find Answers: Diagnosis',          description: 'Supports advanced immunological investigations.' },
  { tier: 1000,  category: 'Bridge the Gap: Access to Care',   description: 'Supports infection-related hospitalisation needs.' },
  { tier: 1500,  category: 'Find Answers: Diagnosis',          description: 'Funds genetic testing for definitive diagnosis.' },
  { tier: 3000,  category: 'Bridge the Gap: Access to Care',   description: 'Funds emergency care, medications, and supportive therapies (orphan life saving drugs).' },
  { tier: 5000,  category: 'Bridge the Gap: Access to Care',   description: 'Provides holistic family support (nutrition, care giving, recovery needs).' },
  { tier: 10000, category: 'Save a Life: Bone Marrow Transplant', description: 'Pre-transplant preparation & donor matching.' },
  { tier: 30000, category: 'Save a Life: Bone Marrow Transplant', description: 'Partial transplant costs.' },
  { tier: 60000, category: 'Save a Life: Bone Marrow Transplant', description: 'Completes a child\'s transplant journey.' },
];

// ── Floor-match: find the highest tier ≤ amount ──────────────────────────────

export function matchMaps(amount: number): MapsItem | null {
  const eligible = MAPS_DATA.filter((d) => d.tier <= amount);
  if (eligible.length === 0) return null;
  return eligible.reduce((a, b) => (b.tier > a.tier ? b : a));
}

export function matchMypopi(amount: number): MypopiItem | null {
  const eligible = MYPOPI_DATA.filter((d) => d.tier <= amount);
  if (eligible.length === 0) return null;
  return eligible.reduce((a, b) => (b.tier > a.tier ? b : a));
}

// ── Non-linear slider ─────────────────────────────────────────────────────────
// 0–80% of slider → RM 50–5,000  (linear)
// 80–100% of slider → RM 5,001–60,000 (linear)

const MIN = 50;
const MID_VAL = 5000;
const MAX_VAL = 60000;
const MID_PCT = 0.80;

export function sliderToAmount(pct: number): number {
  if (pct <= MID_PCT) {
    const ratio = pct / MID_PCT;
    return Math.round(MIN + ratio * (MID_VAL - MIN));
  } else {
    const ratio = (pct - MID_PCT) / (1 - MID_PCT);
    return Math.round(MID_VAL + ratio * (MAX_VAL - MID_VAL));
  }
}

export function amountToSlider(amount: number): number {
  const clamped = Math.min(Math.max(amount, MIN), MAX_VAL);
  if (clamped <= MID_VAL) {
    return ((clamped - MIN) / (MID_VAL - MIN)) * MID_PCT;
  } else {
    return MID_PCT + ((clamped - MID_VAL) / (MAX_VAL - MID_VAL)) * (1 - MID_PCT);
  }
}
