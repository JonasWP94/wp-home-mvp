/**
 * Lightweight A/B Testing Library for Wechselpilot
 *
 * Cookie-based variant assignment with localStorage tracking.
 * No backend required — all data stays client-side for the MVP.
 */

// ─── Types ───────────────────────────────────────────────────────────

export interface Variant {
  id: string
  weight: number // 0–100, weights across variants should sum to 100
}

export interface Experiment {
  id: string
  variants: Variant[]
  /** ISO date string — experiment won't activate before this */
  startDate?: string
  /** ISO date string — experiment stops assigning after this */
  endDate?: string
}

export interface ABEvent {
  experimentId: string
  variantId: string
  event: string
  timestamp: number
  url: string
}

// ─── Cookie helpers ──────────────────────────────────────────────────

const COOKIE_PREFIX = 'wp_ab_'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90 // 90 days

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

// ─── Variant assignment ──────────────────────────────────────────────

function pickVariant(variants: Variant[]): string {
  const rand = Math.random() * 100
  let cumulative = 0
  for (const v of variants) {
    cumulative += v.weight
    if (rand < cumulative) return v.id
  }
  // Fallback to last variant (rounding edge-case)
  return variants[variants.length - 1].id
}

function isActive(exp: Experiment): boolean {
  const now = Date.now()
  if (exp.startDate && now < new Date(exp.startDate).getTime()) return false
  if (exp.endDate && now > new Date(exp.endDate).getTime()) return false
  return true
}

/**
 * Get the assigned variant for an experiment.
 * If the user hasn't been assigned yet, picks one based on weights and persists it in a cookie.
 */
export function getVariant(experiment: Experiment): string {
  if (!isActive(experiment)) {
    // Inactive experiment → always return first variant (control)
    return experiment.variants[0].id
  }

  const cookieKey = COOKIE_PREFIX + experiment.id
  const existing = getCookie(cookieKey)

  if (existing && experiment.variants.some((v) => v.id === existing)) {
    return existing
  }

  const chosen = pickVariant(experiment.variants)
  setCookie(cookieKey, chosen)
  return chosen
}

/**
 * Force a specific variant (useful for QA / preview).
 * Call with `?ab_force=experiment:variant` in the URL.
 */
export function applyUrlOverrides(experiments: Experiment[]): void {
  const params = new URLSearchParams(window.location.search)
  const force = params.get('ab_force')
  if (!force) return

  for (const pair of force.split(',')) {
    const [expId, varId] = pair.split(':')
    const exp = experiments.find((e) => e.id === expId)
    if (exp && exp.variants.some((v) => v.id === varId)) {
      setCookie(COOKIE_PREFIX + expId, varId)
    }
  }
}

// ─── Tracking ────────────────────────────────────────────────────────

const STORAGE_KEY = 'wp_ab_events'

function getStoredEvents(): ABEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function storeEvents(events: ABEvent[]) {
  // Keep max 500 events to avoid filling localStorage
  const trimmed = events.slice(-500)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

/**
 * Track an event (impression, click, conversion, etc.)
 */
export function trackEvent(experimentId: string, variantId: string, event: string) {
  const entry: ABEvent = {
    experimentId,
    variantId,
    event,
    timestamp: Date.now(),
    url: window.location.pathname,
  }
  const events = getStoredEvents()
  events.push(entry)
  storeEvents(events)
}

/**
 * Convenience: get variant + auto-track an "impression" event.
 */
export function activate(experiment: Experiment): string {
  const variant = getVariant(experiment)
  trackEvent(experiment.id, variant, 'impression')
  return variant
}

/**
 * Read all tracked events (for debug UI or export).
 */
export function getTrackedEvents(): ABEvent[] {
  return getStoredEvents()
}

/**
 * Clear all tracked events.
 */
export function clearTrackedEvents() {
  localStorage.removeItem(STORAGE_KEY)
}

// ─── React helper ────────────────────────────────────────────────────

import { useMemo } from 'react'

/**
 * React hook that returns the assigned variant for an experiment.
 * Stable across re-renders (cookie-based).
 */
export function useExperiment(experiment: Experiment): string {
  return useMemo(() => activate(experiment), [experiment.id])
}
