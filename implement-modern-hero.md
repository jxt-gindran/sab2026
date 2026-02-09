# Implementation Plan: Modern Hero Redesign for SAB2026

This plan outlines the steps to overhaul the website's design into a premium, medical-grade, and trust-building interface using a new color palette and the "Split Layout" hero idea.

## 🎨 Design System (Tokens)

- **Navy (Primary Text)**: `#002B49`
- **Cyan (Accent/Icons)**: `#00AEEF`
- **Coral (Call to Action)**: `#FF6F00`
- **White (Background)**: `#FFFFFF`
- **Glass**: `rgba(255, 255, 255, 0.7)` with `backdrop-filter: blur(8px)`

---

## 🏗️ Phase 1: Foundation & Tokens
- [ ] Update `index.html` Tajlwind configuration with new color palette names:
  - `brand-navy`: `#002B49`
  - `brand-cyan`: `#00AEEF`
  - `brand-coral`: `#FF6F00`

---

## 🧭 Phase 2: Navigation & Footer
- [ ] **Navbar**: 
  - Change background to `bg-white/80` with backdrop blur.
  - Set text to `text-brand-navy`.
  - Update CTA button to `bg-brand-coral`.
- [ ] **Footer**:
  - Update background to `bg-brand-navy`.
  - Use `text-brand-cyan` for headers.

---

## ⚡ Phase 3: Home Page (Hero Redesign)
- [ ] **Hero Section**:
  - Implement a **Split Layout** (60/40 or 50/50).
  - **Left**: Large heading in `text-brand-navy` with `text-brand-cyan` highlights. Primary CTA in `bg-brand-coral`.
  - **Right**: A composite visual. High-quality image (paediatric care/scenic Borneo) with a decorative `brand-cyan` glow.
- [ ] **Floating Impact Cards**:
  - Migrate the stat cards (RM 1.2M+, etc.) from the block below *into* the Hero.
  - Style them as **Glassmorphic floating badges** overlapping the right-side visual.

---

## 🧪 Phase 4: Verification
- [ ] Ensure responsiveness (mobile stacks the layout).
- [ ] Check contrast ratios for accessibility.
- [ ] Verify link navigation.
