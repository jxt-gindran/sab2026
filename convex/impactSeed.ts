// Seed data — keeps parity with lib/donationMatcher.ts static fallbacks.
// Imported by convex/impactTiers.ts (server-side only).

export const MAPS_SEED = [
  { tier: 100,  title: 'Supporting Recovery',         description: 'Helping a child heal after surgery with essential care items (stoma bags, dressings, catheters, transport support).' },
  { tier: 150,  title: 'Fuel for Healing',            description: 'Providing specialised formula milk for children with complex gut conditions.' },
  { tier: 200,  title: 'Opening the Door to Surgery', description: 'Helping families meet surgical deposits so treatment is not delayed.' },
  { tier: 1000, title: 'Equipping Life-Saving Care',  description: 'Supporting critical equipment and consumables needed during surgery and recovery.' },
  { tier: 5000, title: 'Transforming Long-Term Care', description: 'Supporting a perfusor machine for bowel management programmes (for children with short bowel syndrome, intestinal failure, global developmental delay, and complex nutritional needs).' },
] as const;

export const MYPOPI_SEED = [
  { tier: 50,    category: 'Start Strong: Screening',              description: 'Screens 1 newborn.' },
  { tier: 100,   category: 'Start Strong: Screening',              description: 'Supports early detection outreach & awareness.' },
  { tier: 200,   category: 'Start Strong: Screening',              description: 'Expands access to screening in underserved areas.' },
  { tier: 300,   category: 'Find Answers: Diagnosis',              description: 'Subsidises initial immunology tests.' },
  { tier: 500,   category: 'Bridge the Gap: Access to Care',       description: 'Covers travel & accommodation for hospital visits.' },
  { tier: 800,   category: 'Find Answers: Diagnosis',              description: 'Supports advanced immunological investigations.' },
  { tier: 1000,  category: 'Bridge the Gap: Access to Care',       description: 'Supports infection-related hospitalisation needs.' },
  { tier: 1500,  category: 'Find Answers: Diagnosis',              description: 'Funds genetic testing for definitive diagnosis.' },
  { tier: 3000,  category: 'Bridge the Gap: Access to Care',       description: 'Funds emergency care, medications, and supportive therapies (orphan life saving drugs).' },
  { tier: 5000,  category: 'Bridge the Gap: Access to Care',       description: 'Provides holistic family support (nutrition, care giving, recovery needs).' },
  { tier: 10000, category: 'Save a Life: Bone Marrow Transplant',  description: 'Pre-transplant preparation & donor matching.' },
  { tier: 30000, category: 'Save a Life: Bone Marrow Transplant',  description: 'Partial transplant costs.' },
  { tier: 60000, category: 'Save a Life: Bone Marrow Transplant',  description: "Completes a child's transplant journey." },
] as const;
