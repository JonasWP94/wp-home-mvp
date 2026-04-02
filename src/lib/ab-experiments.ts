/**
 * A/B Experiment Definitions for Wechselpilot
 *
 * Add new experiments here. Each experiment needs:
 *   - A unique `id` (snake_case, descriptive)
 *   - Two or more `variants` with weights summing to 100
 *   - Optional start/end dates
 */

import type { Experiment } from './ab-test'

// ─── Hero Headline ───────────────────────────────────────────────────

export const HERO_HEADLINE: Experiment = {
  id: 'hero_headline',
  variants: [
    { id: 'control', weight: 50 },
    { id: 'savings_focus', weight: 50 },
  ],
}

export const HERO_HEADLINE_COPY: Record<string, { title: string; subtitle: string }> = {
  control: {
    title: 'Dein Spar-Dashboard',
    subtitle: 'Entdecke personalisierte Tipps für deinen Haushalt.',
  },
  savings_focus: {
    title: 'Bis zu 2.400 € sparen',
    subtitle: 'Wir zeigen dir genau, wie — Schritt für Schritt.',
  },
}

// ─── CTA Button ──────────────────────────────────────────────────────

export const CTA_STYLE: Experiment = {
  id: 'cta_style',
  variants: [
    { id: 'default', weight: 50 },
    { id: 'urgent', weight: 50 },
  ],
}

export const CTA_LABELS: Record<string, string> = {
  default: 'Jetzt Tipps ansehen',
  urgent: 'Jetzt sofort sparen →',
}

// ─── Trust Elements ──────────────────────────────────────────────────

export const TRUST_BADGE: Experiment = {
  id: 'trust_badge',
  variants: [
    { id: 'none', weight: 34 },
    { id: 'reviews', weight: 33 },
    { id: 'tuev', weight: 33 },
  ],
}

export const TRUST_BADGE_CONTENT: Record<string, { text: string; icon: string } | null> = {
  none: null,
  reviews: { text: '★ 4.8 / 5 — über 12.000 zufriedene Kunden', icon: '⭐' },
  tuev: { text: 'TÜV-geprüfter Wechselservice', icon: '🛡️' },
}

// ─── Registry: all active experiments ────────────────────────────────

export const ALL_EXPERIMENTS: Experiment[] = [HERO_HEADLINE, CTA_STYLE, TRUST_BADGE]
