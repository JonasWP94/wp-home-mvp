import { useMemo } from "react";
import { motion } from "framer-motion";
import { useWpHome } from "../store/wpHomeStore";

var S = {
  primary: "#243c47", accent: "#2a6fa6", green: "#24a47d", dkGreen: "#167a52",
  ltGreen: "#d3ede5", g700: "#a3a3a8", g800: "#828288",
};

function fmt(n: number) { return n.toLocaleString("de-DE"); }

/** Deterministic pseudo-random from PLZ prefix (first 2 digits) */
function plzSeed(plz: string): number {
  var prefix = parseInt(plz.slice(0, 2), 10) || 10;
  // Simple hash: multiply, mod, normalize
  return ((prefix * 2654435761) >>> 0) / 4294967296;
}

function getRegionData(plz: string, persons: number, totalSavings: number) {
  var seed = plzSeed(plz);
  var regionName = "PLZ " + plz.slice(0, 2) + "xxx";

  // Regional average: 55-75% of user's total potential (seeded)
  var avgPct = 0.55 + seed * 0.2;
  var regionAvg = Math.round(totalSavings * avgPct);

  // Top 10%: 85-100% of user's total potential
  var topPct = 0.85 + seed * 0.15;
  var regionTop = Math.round(totalSavings * topPct);

  // Simulated household count: 120-380 (seeded)
  var households = Math.round(120 + seed * 260);

  // User percentile based on how their savings compare
  var userPct = Math.min(Math.round(65 + seed * 25 + persons * 2), 99);

  return { regionName, regionAvg, regionTop, households, userPct };
}

export default function NeighborhoodCompare({ totalSavings }: { totalSavings: number }) {
  var { data } = useWpHome();
  var plz = data.household.plz;
  var persons = data.household.persons;

  var region = useMemo(
    () => getRegionData(plz, persons, totalSavings),
    [plz, persons, totalSavings]
  );

  if (!plz || totalSavings <= 0) return null;

  var maxVal = Math.max(totalSavings, region.regionTop) * 1.1;
  var userBarPct = Math.min((totalSavings / maxVal) * 100, 100);
  var avgBarPct = Math.min((region.regionAvg / maxVal) * 100, 100);
  var topBarPct = Math.min((region.regionTop / maxVal) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{
        background: "#fff", borderRadius: 18, padding: "clamp(18px, 4vw, 22px)",
        border: "1px solid #e3e3e6", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        marginBottom: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: S.ltGreen,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
        }}>
          🏘️
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: S.primary, lineHeight: 1.3 }}>
            Nachbarschafts-Vergleich
          </div>
          <div style={{ fontSize: 11, color: S.g700 }}>
            {region.households} Haushalte in {region.regionName}
          </div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: S.dkGreen, background: S.ltGreen,
          borderRadius: 200, padding: "4px 10px",
        }}>
          Top {100 - region.userPct}%
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 16 }}>
        {/* User bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: S.primary }}>Dein Potenzial</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: S.green }}>{fmt(totalSavings)} €</span>
          </div>
          <div style={{ height: 10, borderRadius: 5, background: "#eef1f6", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: userBarPct + "%" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              style={{ height: "100%", borderRadius: 5, background: "linear-gradient(90deg, #24a47d, #167a52)" }}
            />
          </div>
        </div>

        {/* Average bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: S.g800 }}>Ø Nachbarschaft</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: S.g800 }}>{fmt(region.regionAvg)} €</span>
          </div>
          <div style={{ height: 10, borderRadius: 5, background: "#eef1f6", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: avgBarPct + "%" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
              style={{ height: "100%", borderRadius: 5, background: "#d4d4d7" }}
            />
          </div>
        </div>

        {/* Top 10% bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: S.accent }}>Top 10%</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: S.accent }}>{fmt(region.regionTop)} €</span>
          </div>
          <div style={{ height: 10, borderRadius: 5, background: "#eef1f6", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: topBarPct + "%" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
              style={{ height: "100%", borderRadius: 5, background: "linear-gradient(90deg, #2a6fa6, #18466a)" }}
            />
          </div>
        </div>
      </div>

      {/* Bottom insight */}
      <div style={{
        background: "#f0f9f5", borderRadius: 12, padding: "10px 14px",
        fontSize: 12, color: S.dkGreen, lineHeight: 1.5, fontWeight: 500,
      }}>
        {totalSavings > region.regionAvg
          ? <>Dein Sparpotenzial liegt <strong>{fmt(totalSavings - region.regionAvg)} €</strong> über dem Durchschnitt deiner Region.</>
          : <>Du sparst noch <strong>{fmt(region.regionAvg - totalSavings)} €</strong> weniger als der Durchschnitt — da geht noch was!</>
        }
      </div>
    </motion.div>
  );
}
