import type { HeatingType, BuildingAge, InsulationQuality, IncomeLevel } from "../store/wpHomeStore";

// ── Types ──────────────────────────────────────────────────────────
export interface ProfileData {
  heatingType: HeatingType;
  buildingAge: BuildingAge;
  insulationQuality: InsulationQuality;
  income: IncomeLevel;
  hasGarden: boolean;
  hasSolarPotential: boolean;
}

export type Tip = {
  id: number;
  t: string;       // title
  c: string;       // category
  ti: string;      // timing label
  wp: string;      // wp_plan
  s: Record<number, number>; // hg → savings
  desc: string;
};

// ── Constants ──────────────────────────────────────────────────────
const INCOME_ORDER: IncomeLevel[] = ['low', 'medium', 'high', 'very_high'];

// Categories affected by insulation/building-age multiplier
const HEATING_CATEGORIES = new Set(['Heizung', 'Gebaeude', 'Energie', 'Warmwasser']);

// Categories that get a relevance boost when matched to profile
const RELEVANCE_BOOST_CATEGORIES: Record<string, (p: ProfileData) => boolean> = {
  Solar: (p) => p.hasSolarPotential,
  Garten: (p) => p.hasGarden,
  Heizung: () => true,   // always relevant if it passed filter
  Gebaeude: () => true,
  Warmwasser: () => true,
};

// ── Map timing slug → German label ─────────────────────────────────
function timingLabel(t: string): string {
  if (t === "sofort") return "Sofort";
  if (t === "mittel") return "Mittel";
  return "Langfristig";
}

// ── Filter tips by user profile ────────────────────────────────────
export function filterTipsByProfile(allTips: any[], profile: ProfileData): any[] {
  return allTips.filter((t: any) => {
    // Filter by heating type if tip specifies heating_types
    if (t.heating_types && Array.isArray(t.heating_types)) {
      if (!t.heating_types.includes(profile.heatingType)) return false;
    }
    // Filter by building age if tip specifies building_age_relevant
    if (t.building_age_relevant && Array.isArray(t.building_age_relevant)) {
      if (!t.building_age_relevant.includes(profile.buildingAge)) return false;
    }
    // Filter by income level minimum
    if (t.income_level_min) {
      var tipMinIdx = INCOME_ORDER.indexOf(t.income_level_min);
      var userIdx = INCOME_ORDER.indexOf(profile.income);
      if (userIdx < tipMinIdx) return false;
    }
    // Filter garden tips
    if (t.requires_garden && !profile.hasGarden) return false;
    // Filter solar tips
    if (t.requires_solar && !profile.hasSolarPotential) return false;
    return true;
  });
}

// ── Savings multiplier based on building + insulation ──────────────
export function getSavingsMultiplier(buildingAge: BuildingAge, insulation: InsulationQuality): number {
  var ageFactor = buildingAge === 'pre1990' ? 1.3 : buildingAge === '1990to2010' ? 1.0 : 0.8;
  var insulFactor = insulation === 'poor' ? 1.25 : insulation === 'medium' ? 1.0 : 0.85;
  return ageFactor * insulFactor;
}

// ── Map raw JSON tips → internal Tip format ────────────────────────
export function mapTips(allTips: any[], hg: number): Tip[] {
  return allTips
    .filter((t: any) => {
      if (!t.hg_levels || !Array.isArray(t.hg_levels)) return false;
      const minHg = Math.min(...t.hg_levels);
      const maxHg = Math.max(...t.hg_levels);
      return hg >= minHg && hg <= maxHg;
    })
    .map((t: any) => {
      const savings: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      const byHg = t.savings_by_hg || {};
      if (byHg.hg1 != null) savings[1] = byHg.hg1 || 0;
      if (byHg.hg2 != null) savings[2] = byHg.hg2 || 0;
      if (byHg.hg3 != null) savings[3] = byHg.hg3 || 0;
      if (byHg.hg4 != null) savings[4] = byHg.hg4 || 0;
      return {
        id: t.id,
        t: t.title,
        c: t.category,
        ti: timingLabel(t.timing),
        wp: t.wp_plan || "nein",
        s: savings,
        desc: t.description || "",
      };
    })
    .filter((t: Tip) => t.s[hg] > 0)
    .sort((a, b) => b.s[hg] - a.s[hg]);
}

// ── Compute relevance score for a tip ──────────────────────────────
function relevanceScore(tip: { c: string; ti: string }, profile: ProfileData): number {
  var score = 0;
  // Timing boost: sofort > mittel > langfristig
  if (tip.ti === "Sofort") score += 3;
  else if (tip.ti === "Mittel") score += 1;

  // Category relevance boost
  var boostFn = RELEVANCE_BOOST_CATEGORIES[tip.c];
  if (boostFn && boostFn(profile)) score += 2;

  // Poor insulation → heating tips extra relevant
  if (profile.insulationQuality === 'poor' && HEATING_CATEGORIES.has(tip.c)) {
    score += 2;
  }

  return score;
}

// ── Full pipeline: filter, map, multiply, sort ─────────────────────
export function computePersonalizedTips(
  allTipsJson: any[],
  profile: ProfileData,
  hg: number,
  legacyTips: any[],
  legacyHh: number,
): (Tip & { sav: number })[] {
  var filtered = filterTipsByProfile(allTipsJson, profile);
  var computed = mapTips(filtered, hg);

  if (computed.length === 0) {
    // Fallback to legacy tips
    return legacyTips
      .map(function(t) { return Object.assign({}, t, { sav: t.s[legacyHh as keyof typeof t.s] || 0 }); })
      .filter(function(t) { return t.sav > 0; })
      .sort(function(a, b) { return b.sav - a.sav; });
  }

  var multiplier = getSavingsMultiplier(profile.buildingAge, profile.insulationQuality);

  return computed.map(function(t) {
    var baseSav = t.s[hg] || 0;
    // Apply multiplier to heating/building category tips
    var multiplied = HEATING_CATEGORIES.has(t.c) ? Math.round(baseSav * multiplier) : baseSav;
    var relScore = relevanceScore(t, profile);
    return Object.assign({}, t, { sav: multiplied, _rel: relScore });
  }).filter(function(t) { return t.sav > 0; })
  // Sort: personalized relevance first, then by savings
  .sort(function(a: any, b: any) {
    if (a._rel !== b._rel) return b._rel - a._rel;
    return b.sav - a.sav;
  });
}
