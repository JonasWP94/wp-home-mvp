/**
 * A/B Test Tracking Dashboard (Debug / Analytics)
 *
 * Provides helper functions to aggregate and inspect tracked events.
 * Can be called from the browser console: window.__abDebug
 */

import { getTrackedEvents, clearTrackedEvents, type ABEvent } from './ab-test'
import { ALL_EXPERIMENTS } from './ab-experiments'
import { getVariant } from './ab-test'

interface ExperimentSummary {
  experimentId: string
  assignedVariant: string
  impressions: number
  conversions: number
  clicks: number
  otherEvents: Record<string, number>
}

/**
 * Aggregate events into per-experiment summaries.
 */
export function summarize(): ExperimentSummary[] {
  const events = getTrackedEvents()
  const map = new Map<string, ABEvent[]>()

  for (const e of events) {
    const list = map.get(e.experimentId) || []
    list.push(e)
    map.set(e.experimentId, list)
  }

  return ALL_EXPERIMENTS.map((exp) => {
    const expEvents = map.get(exp.id) || []
    const impressions = expEvents.filter((e) => e.event === 'impression').length
    const conversions = expEvents.filter((e) => e.event === 'conversion').length
    const clicks = expEvents.filter((e) => e.event === 'click').length

    const otherEvents: Record<string, number> = {}
    for (const e of expEvents) {
      if (!['impression', 'conversion', 'click'].includes(e.event)) {
        otherEvents[e.event] = (otherEvents[e.event] || 0) + 1
      }
    }

    return {
      experimentId: exp.id,
      assignedVariant: getVariant(exp),
      impressions,
      conversions,
      clicks,
      otherEvents,
    }
  })
}

/**
 * Print a nice console table of experiment status.
 */
export function printReport() {
  const summaries = summarize()
  console.group('🧪 Wechselpilot A/B Test Report')
  console.table(
    summaries.map(({ experimentId, assignedVariant, impressions, conversions, clicks }) => ({
      Experiment: experimentId,
      Variant: assignedVariant,
      Impressions: impressions,
      Clicks: clicks,
      Conversions: conversions,
    }))
  )
  console.log('Raw events:', getTrackedEvents())
  console.groupEnd()
}

/**
 * Attach debug helpers to window for console access.
 * Usage in browser console:
 *   __abDebug.report()
 *   __abDebug.events()
 *   __abDebug.clear()
 */
export function installDebugHelpers() {
  ;(window as any).__abDebug = {
    report: printReport,
    events: getTrackedEvents,
    summary: summarize,
    clear: clearTrackedEvents,
  }
}
