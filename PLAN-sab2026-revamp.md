# Project Plan: SAB 2026 Site Revamp & Content Integration

## 📋 Overview
Revamp the SAB 2026 website to a modern, humanity-centric design that maximizes donation conversion. The project focuses on emotional storytelling, rider promotion (The Champions), and clear organizational authority (MMA/MMAF).

**Project Type**: WEB (React + Tailwind)
**Primary Agent**: `frontend-specialist`

---

## 🎯 Success Criteria
- [ ] Hero section features high-impact emotional visuals (Surgeons/Children).
- [ ] Navigation includes: The Mission, Our Legacy, The Ride, and Donation.
- [ ] Riders are visually represented as "Champions" with individual goals.
- [ ] Legal pages (T&C, Refund Policy) are integrated and accessible.
- [ ] Logos for MMA, MMAF, MAPS, and MyPOPI are prominently displayed.

---

## 🛠️ Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS (Custom Design System: Navy, Cyan, Coral)
- **Icons**: Lucide React
- **Typography**: Inter (Weights 300-900)

---

## 🗂️ Proposed File Structure
```
sab2026/
├── components/
│   ├── Navbar.tsx      # Multi-step progress aware
│   ├── Footer.tsx      # Integrated contact & legal links
│   └── RiderCard.tsx   # Bento style champion card
├── pages/
│   ├── Home.tsx        # Storytelling hub
│   ├── Mission.tsx     # MAPS & MyPOPI focus
│   ├── Legacy.tsx      # MMA/MMAF authority
│   ├── Ride.tsx        # Rider gallery & stats
│   ├── Donate.tsx      # Multi-step payment wizard
│   ├── Terms.tsx       # T&C Content
│   └── Refund.tsx      # Refund Policy Content
└── design-system/
    └── MASTER.md       # Design tokens & rules
```

---

## 📝 Task Breakdown

### Phase 1: Core Content & Legal
| ID | Task | Agent | Skill |
|---|---|---|---|
| 1.1 | Create `Terms.tsx` with provided T&C text | `frontend-specialist` | `clean-code` |
| 1.2 | Create `Refund.tsx` (Placeholder for Policy) | `frontend-specialist` | `clean-code` |
| 1.3 | Update `Footer.tsx` with Contact details & Legal links | `frontend-specialist` | `frontend-design` |

### Phase 2: Navigation & Branding
| ID | Task | Agent | Skill |
|---|---|---|---|
| 2.1 | Update `Navbar.tsx` menu items (The Mission, Our Legacy, The Ride, Donation) | `frontend-specialist` | `frontend-design` |
| 2.2 | Integrate MMA & MMAF logos into Header/Footer | `frontend-specialist` | `frontend-design` |

### Phase 3: Visual Revamp (Humanity First)
| ID | Task | Agent | Skill |
|---|---|---|---|
| 3.1 | Revamp `Home.tsx` Hero with "Humanity" visual strategy | `frontend-specialist` | `frontend-design` |
| 3.2 | Enhance `Ride.tsx` with the "Champions" Gallery (Visuals of Riders) | `frontend-specialist` | `frontend-design` |
| 3.3 | Update `Mission.tsx` with dedicated MAPS & MyPOPI sections | `frontend-specialist` | `frontend-design` |

---

## 🛑 Phase X: Verification Checklist
- [ ] **Accessibility**: All logos have alt text and contrast meets WCAG AA.
- [ ] **Responsiveness**: Test on mobile (375px) for horizontal scroll.
- [ ] **Functional**: Secure copy button on bank account works.
- [ ] **Security**: No hardcoded API keys in client components.
- [ ] **Build Check**: `npm run build` succeeds without errors.

---

## 💡 Socratic Gate 2:
1. **Refund Policy**: Since you haven't provided the "Refund Policy" text yet, shall I use a "Donations are non-refundable once processed" standard clause, or do you have a specific version?
2. **Contact Page**: Should "Contact Details" be a standalone page, or is the detailed information in the Footer sufficient for your needs?
