import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Tip } from "../utils/tipFilter";

// ── Style tokens (reuse from App) ────────────────────────────────
var S = {
  bg: "#eef1f6", white: "#fff", primary: "#243c47", accent: "#2a6fa6",
  g100: "#fafafb", g200: "#f3f3f5", g300: "#e3e3e6", g400: "#d4d4d7",
  g500: "#c4c4ca", g600: "#b4b4bb", g700: "#a3a3a8", g800: "#828288",
  g900: "#595962", green: "#24a47d", dkGreen: "#167a52", ltGreen: "#d3ede5",
  yellow: "#f9aa00", ltYellow: "#feeecc", orange: "#ef7520", red: "#e93a3a",
  ltRed: "#fdcece", ltBlue: "#d4e2ed", dkBlue: "#18466a"
};
var CC: Record<string, string> = {
  Energie: "#2a6fa6", Invest: "#f9aa00", Wasser: "#0891b2",
  Vertraege: "#7c3aed", Finanzen: "#db2777", Wohnen: "#18466a",
  Mobilitaet: "#24a47d", Foerderung: "#167a52", Alltag: "#ef7520",
  Essen: "#d97706", Freizeit: "#a855f7", Steuern: "#6366f1",
  Gesundheit: "#10b981", Strom: "#3b82f6",
  Heizung: "#e65100", Warmwasser: "#0891b2", Gebaeude: "#795548",
  Solar: "#ff9800", Garten: "#4caf50", Versicherungen: "#9c27b0",
};

var CATEGORY_ICONS: Record<string, string> = {
  Strom: "⚡", Heizung: "🔥", Warmwasser: "🚿", Gebaeude: "🏠",
  Solar: "☀️", Garten: "🌿", Energie: "💡", Vertraege: "📋",
  Versicherungen: "🛡️", Steuern: "📄", Mobilitaet: "🚗",
  Essen: "🍽️", Freizeit: "🎭", Wohnen: "🏡", Gesundheit: "💚",
  Finanzen: "💰", Invest: "📈", Foerderung: "🎯", Alltag: "🔧",
  Wasser: "💧",
};

var cardS: any = {
  background: S.white, borderRadius: 12, border: "1px solid #e3e3e6",
  boxShadow: "0px 2px 8px rgba(0,0,0,0.06)", overflow: "hidden",
};

function fmt(n: number) { return n.toLocaleString("de-DE"); }

function getPill(ti: string) {
  var b: any = { fontSize: 11, padding: "2px 10px", borderRadius: 200, fontWeight: 600, display: "inline-block" };
  if (ti === "Sofort") return Object.assign({}, b, { background: S.ltGreen, color: S.dkGreen });
  if (ti === "Mittel") return Object.assign({}, b, { background: S.ltYellow, color: "#854d0e" });
  return Object.assign({}, b, { background: S.ltRed, color: S.red });
}

// ── STORAGE KEY for done tips ───────────────────────────────────
var DONE_STORAGE_KEY = "wpHome_doneTips";

function loadDone(): Set<number> {
  try {
    var stored = localStorage.getItem(DONE_STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {}
  return new Set();
}

function saveDone(done: Set<number>) {
  try {
    localStorage.setItem(DONE_STORAGE_KEY, JSON.stringify(Array.from(done)));
  } catch {}
}

// ── Animated Counter ────────────────────────────────────────────
function AnimatedCounter(props: { value: number, duration?: number }) {
  var _v = useState(0), displayVal = _v[0], setDisplayVal = _v[1];
  var rafRef = useRef<number>(0);
  var startRef = useRef(0);
  var fromRef = useRef(0);

  useEffect(function() {
    fromRef.current = displayVal;
    startRef.current = performance.now();
    var dur = props.duration || 1200;
    function tick(now: number) {
      var elapsed = now - startRef.current;
      var progress = Math.min(elapsed / dur, 1);
      // easeOutExpo
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayVal(Math.round(fromRef.current + (props.value - fromRef.current) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return function() { cancelAnimationFrame(rafRef.current); };
  }, [props.value]);

  return <span>{fmt(displayVal)}</span>;
}

// ── Progress Ring ────────────────────────────────────────────────
function ProgressRing(props: { done: number, total: number, size?: number }) {
  var size = props.size || 120;
  var strokeW = 8;
  var radius = (size - strokeW) / 2;
  var circ = 2 * Math.PI * radius;
  var pct = props.total > 0 ? props.done / props.total : 0;
  var offset = circ - pct * circ;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent"
        stroke={S.g300} strokeWidth={strokeW} />
      <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="transparent"
        stroke={S.green} strokeWidth={strokeW} strokeLinecap="round"
        strokeDasharray={circ + " " + circ}
        animate={{ strokeDashoffset: offset }}
        initial={{ strokeDashoffset: circ }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

// ── Motivation text ──────────────────────────────────────────────
function getMotivation(pct: number): string {
  if (pct === 0) return "Los geht's! Starte mit deinem ersten Spartipp.";
  if (pct < 0.25) return "Guter Anfang! Weiter so – jeder Tipp zählt.";
  if (pct < 0.5) return "Du bist auf einem super Weg! Halbzeit in Sicht.";
  if (pct < 0.75) return "Stark! Mehr als die Hälfte geschafft.";
  if (pct < 1) return "Fast geschafft! Nur noch wenige Tipps übrig.";
  return "Fantastisch! Du hast alle Tipps umgesetzt! 🎉";
}

// ── TYPES ────────────────────────────────────────────────────────
type TipWithSav = Tip & { sav: number };

interface DashboardProps {
  tips: TipWithSav[];
  total: number;
  sofort: number;
  byCat: [string, number][];
  onResetWizard: () => void;
  onTipClick: (tip: TipWithSav) => void;
}

// ── MAIN DASHBOARD COMPONENT ─────────────────────────────────────
export default function SavingsDashboard(props: DashboardProps) {
  var tips = props.tips;
  var total = props.total;

  // Done state with localStorage persistence
  var _done = useState<Set<number>>(loadDone);
  var done = _done[0], setDone = _done[1];

  useEffect(function() { saveDone(done); }, [done]);

  function toggleDone(id: number) {
    setDone(function(prev) {
      var n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  function markDone(id: number) {
    setDone(function(prev) { var n = new Set(prev); n.add(id); return n; });
  }

  // Filter state
  var _catFilter = useState<string | null>(null);
  var catFilter = _catFilter[0], setCatFilter = _catFilter[1];
  var _timingFilter = useState<string | null>(null);
  var timingFilter = _timingFilter[0], setTimingFilter = _timingFilter[1];
  var _statusFilter = useState<string>("all");
  var statusFilter = _statusFilter[0], setStatusFilter = _statusFilter[1];

  // Computed
  var doneCount = useMemo(function() {
    return tips.filter(function(t) { return done.has(t.id); }).length;
  }, [tips, done]);
  var totalTips = tips.length;
  var pct = totalTips > 0 ? doneCount / totalTips : 0;

  var activeSavings = useMemo(function() {
    return tips.filter(function(t) { return !done.has(t.id); }).reduce(function(s, t) { return s + t.sav; }, 0);
  }, [tips, done]);

  // Category progress
  var catProgress = useMemo(function() {
    var m: any = {};
    tips.forEach(function(t) {
      if (!m[t.c]) m[t.c] = { total: 0, done: 0, sav: 0 };
      m[t.c].total++;
      m[t.c].sav += t.sav;
      if (done.has(t.id)) m[t.c].done++;
    });
    return Object.entries(m).sort(function(a: any, b: any) { return b[1].sav - a[1].sav; }).map(function(arr: any) {
      return { cat: arr[0], total: arr[1].total, done: arr[1].done, sav: arr[1].sav, pct: arr[1].total > 0 ? arr[1].done / arr[1].total : 0 };
    });
  }, [tips, done]);

  // Top 3 sofort tips with highest savings (undone)
  var top3 = useMemo(function() {
    return tips
      .filter(function(t) { return t.ti === "Sofort" && !done.has(t.id); })
      .sort(function(a, b) { return b.sav - a.sav; })
      .slice(0, 3);
  }, [tips, done]);

  // Filtered & sorted tip list
  var filteredTips = useMemo(function() {
    var result = tips.slice();
    if (catFilter) result = result.filter(function(t) { return t.c === catFilter; });
    if (timingFilter) result = result.filter(function(t) { return t.ti === timingFilter; });
    if (statusFilter === "done") result = result.filter(function(t) { return done.has(t.id); });
    if (statusFilter === "open") result = result.filter(function(t) { return !done.has(t.id); });
    // Default sort: savings high→low
    result.sort(function(a, b) { return b.sav - a.sav; });
    return result;
  }, [tips, catFilter, timingFilter, statusFilter, done]);

  // Refs for smooth scroll
  var catRef = useRef<HTMLDivElement>(null);
  var tipsRef = useRef<HTMLDivElement>(null);

  function scrollToTips(cat?: string) {
    if (cat) setCatFilter(cat);
    setTimeout(function() {
      if (tipsRef.current) tipsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  // Modal state for tip detail
  var _modal = useState<TipWithSav | null>(null);
  var modalTip = _modal[0], setModalTip = _modal[1];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: S.bg, boxSizing: "border-box" as const, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *{font-family:Poppins,sans-serif;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        html,body{overflow-x:hidden;max-width:100vw;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;}
        .dash-grid{display:grid;gap:12px;grid-template-columns:1fr;}
        @media(min-width:640px){.dash-grid{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:960px){.dash-grid{grid-template-columns:repeat(3,1fr);}}
        .top3-grid{display:grid;gap:12px;grid-template-columns:1fr;}
        @media(min-width:640px){.top3-grid{grid-template-columns:repeat(3,1fr);}}
        .filter-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
        .tip-check{width:22px;height:22px;min-width:22px;border-radius:6px;border:2px solid #d4d4d7;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;flex-shrink:0;background:#fff;touch-action:manipulation;}
        .tip-check.checked{background:#24a47d;border-color:#24a47d;}
        .tip-check:hover{border-color:#2a6fa6;}
        .tip-check:active{opacity:0.7;}
        .cat-scroll::-webkit-scrollbar{display:none;}
        .dash-section{padding:0 clamp(12px, 4vw, 16px);}
        @media(min-width:640px){.dash-section{padding:0 24px;}}
        @media(min-width:960px){.dash-section{padding:0 32px;}}
        .floating-btn{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:100;padding:12px 28px;border-radius:50px;border:none;background:#243c47;color:#fff;font-size:clamp(13px, 3.5vw, 14px);font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.2);min-height:48px;touch-action:manipulation;}
        .floating-btn:hover{opacity:0.9;}
        .floating-btn:active{opacity:0.8;transform:translateX(-50%) scale(0.97);}
        @media(min-width:960px){.floating-btn{bottom:24px;}}
        button,a,[role="button"]{touch-action:manipulation;cursor:pointer;}
        button:active,a:active,[role="button"]:active{opacity:0.7;}
        input,select,textarea{font-size:16px!important;-webkit-appearance:none;}
        img{max-width:100%;height:auto;}
      `}</style>

      {/* ═══ HERO SECTION ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, #243c47 0%, #18466a 50%, #2a6fa6 100%)",
          padding: "40px 20px 36px",
          textAlign: "center" as const,
          color: "#fff",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        {/* subtle pattern overlay */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.8, marginBottom: 8, letterSpacing: 1 }}>
            DEIN SPARPOTENZIAL
          </div>
          <div style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
            <AnimatedCounter value={total} duration={1500} /> €
          </div>
          <div style={{ fontSize: "clamp(14px, 3vw, 18px)", fontWeight: 500, opacity: 0.85, marginTop: 8 }}>
            pro Jahr sparen — mit {totalTips} personalisierten Tipps
          </div>
        </motion.div>

        {/* Progress Ring + Motivation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{ marginTop: 28, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 10 }}
        >
          <div style={{ position: "relative", width: 100, height: 100 }}>
            <ProgressRing done={doneCount} total={totalTips} size={100} />
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column" as const,
              alignItems: "center", justifyContent: "center", transform: "rotate(0deg)"
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{doneCount}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>von {totalTips}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.85, maxWidth: 340 }}>
            {getMotivation(pct)}
          </div>
          {activeSavings > 0 && activeSavings < total && (
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
              Noch {fmt(activeSavings)} € durch offene Tipps zu sparen
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* ═══ KATEGORIE-ÜBERSICHT ═══ */}
      <div ref={catRef} className="dash-section" style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <h2 style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: 700, color: S.primary, margin: 0 }}>Kategorien</h2>
          <span style={{ fontSize: 12, color: S.g700 }}>{catProgress.length} Bereiche</span>
        </div>
        <div className="dash-grid">
          {catProgress.map(function(cp, i) {
            var icon = CATEGORY_ICONS[cp.cat] || "📌";
            var color = CC[cp.cat] || S.accent;
            var isActive = catFilter === cp.cat;
            return (
              <motion.div
                key={cp.cat}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                onClick={function() { scrollToTips(isActive ? undefined : cp.cat); if (isActive) setCatFilter(null); }}
                style={Object.assign({}, cardS, {
                  padding: "16px 18px",
                  cursor: "pointer",
                  transition: "box-shadow 0.15s, border-color 0.15s",
                  borderColor: isActive ? color : "#e3e3e6",
                  boxShadow: isActive ? "0 0 0 2px " + color + "30" : "0px 2px 8px rgba(0,0,0,0.06)",
                  minHeight: 48,
                })}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, minWidth: 44, borderRadius: 12,
                    background: color + "15", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 22
                  }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: S.primary }}>{cp.cat}</div>
                    <div style={{ fontSize: 11, color: S.g700, marginTop: 1 }}>
                      {cp.total} Tipps · {fmt(cp.sav)} €
                    </div>
                  </div>
                  <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: color }}>{fmt(cp.sav)} €</div>
                    <div style={{ fontSize: 10, color: S.g700 }}>{cp.done}/{cp.total}</div>
                  </div>
                </div>
                {/* Mini progress bar */}
                <div style={{ marginTop: 10, height: 4, background: S.g300, borderRadius: 2, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: (cp.pct * 100) + "%" }}
                    transition={{ duration: 0.6, delay: i * 0.04 }}
                    style={{ height: "100%", background: color, borderRadius: 2 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ═══ TOP-3 SOFORT-TIPPS ═══ */}
      {top3.length > 0 && (
        <div className="dash-section" style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: 700, color: S.primary, margin: "0 0 14px" }}>
            Sofort umsetzen
          </h2>
          <div className="top3-grid">
            {top3.map(function(t, i) {
              var color = CC[t.c] || S.accent;
              var icon = CATEGORY_ICONS[t.c] || "💡";
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                  style={Object.assign({}, cardS, {
                    padding: "20px 18px",
                    cursor: "pointer",
                    background: "linear-gradient(135deg, " + color + "08 0%, #fff 100%)",
                    borderColor: color + "40",
                    display: "flex", flexDirection: "column" as const, gap: 10,
                  })}
                  onClick={function() { setModalTip(t); }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 48, height: 48, minWidth: 48, borderRadius: 14,
                      background: color + "18", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 26
                    }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: color, lineHeight: 1 }}>{fmt(t.sav)} €</div>
                      <div style={{ fontSize: 10, color: S.g700, marginTop: 2 }}>pro Jahr</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: S.primary, lineHeight: 1.3 }}>{t.t}</div>
                  <div style={{ fontSize: 12, color: S.g800, lineHeight: 1.5, flex: 1 }}>{t.desc}</div>
                  <button
                    onClick={function(e) { e.stopPropagation(); markDone(t.id); }}
                    style={{
                      width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
                      background: color, color: "#fff", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", minHeight: 44, touchAction: "manipulation"
                    }}
                  >
                    Jetzt umsetzen →
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TIPP-LISTE ═══ */}
      <div ref={tipsRef} className="dash-section" style={{ marginTop: 28, paddingBottom: 90 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <h2 style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: 700, color: S.primary, margin: 0 }}>
            Alle Spartipps
          </h2>
          <span style={{ fontSize: 12, color: S.g700 }}>
            {filteredTips.length} von {totalTips} · {fmt(filteredTips.reduce(function(s, t) { return s + t.sav; }, 0))} €
          </span>
        </div>

        {/* Filters */}
        <div className="filter-row" style={{ marginBottom: 14 }}>
          {/* Category filter */}
          <select
            value={catFilter || ""}
            onChange={function(e) { setCatFilter(e.target.value || null); }}
            style={{
              fontSize: 13, padding: "8px 12px", borderRadius: 10, border: "1px solid #d4d4d7",
              background: "#fff", fontWeight: 600, color: S.g900, minHeight: 44, touchAction: "manipulation"
            }}
          >
            <option value="">Alle Kategorien</option>
            {catProgress.map(function(cp) { return <option key={cp.cat} value={cp.cat}>{cp.cat} ({cp.total})</option>; })}
          </select>

          {/* Timing filter */}
          <select
            value={timingFilter || ""}
            onChange={function(e) { setTimingFilter(e.target.value || null); }}
            style={{
              fontSize: 13, padding: "8px 12px", borderRadius: 10, border: "1px solid #d4d4d7",
              background: "#fff", fontWeight: 600, color: S.g900, minHeight: 44, touchAction: "manipulation"
            }}
          >
            <option value="">Alle Zeitrahmen</option>
            <option value="Sofort">Sofort</option>
            <option value="Mittel">Mittelfristig</option>
            <option value="Langfristig">Langfristig</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={function(e) { setStatusFilter(e.target.value); }}
            style={{
              fontSize: 13, padding: "8px 12px", borderRadius: 10, border: "1px solid #d4d4d7",
              background: "#fff", fontWeight: 600, color: S.g900, minHeight: 44, touchAction: "manipulation"
            }}
          >
            <option value="all">Alle ({totalTips})</option>
            <option value="open">Offen ({totalTips - doneCount})</option>
            <option value="done">Umgesetzt ({doneCount})</option>
          </select>

          {(catFilter || timingFilter || statusFilter !== "all") && (
            <button
              onClick={function() { setCatFilter(null); setTimingFilter(null); setStatusFilter("all"); }}
              style={{
                fontSize: 12, padding: "8px 14px", borderRadius: 10, border: "1px solid " + S.ltRed,
                background: "#fff5f5", color: S.red, fontWeight: 600, cursor: "pointer",
                minHeight: 44, touchAction: "manipulation"
              }}
            >
              Filter zurücksetzen
            </button>
          )}
        </div>

        {/* Tip list */}
        <div style={Object.assign({}, cardS, { overflow: "hidden" })}>
          <AnimatePresence mode="popLayout">
            {filteredTips.map(function(t, i) {
              var isDone = done.has(t.id);
              var color = CC[t.c] || S.accent;
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderBottom: "1px solid #f3f3f5",
                    cursor: "pointer", opacity: isDone ? 0.55 : 1,
                    background: isDone ? "#fafafb" : "#fff",
                    transition: "background 0.15s, opacity 0.15s",
                    minHeight: 52,
                  }}
                  onClick={function() { setModalTip(t); }}
                >
                  {/* Checkbox */}
                  <div
                    className={"tip-check" + (isDone ? " checked" : "")}
                    onClick={function(e) { e.stopPropagation(); toggleDone(t.id); }}
                  >
                    {isDone && <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                  </div>

                  {/* Category dot */}
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: color, flexShrink: 0 }} />

                  {/* Title + category */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: S.primary,
                      textDecoration: isDone ? "line-through" : "none",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                      lineHeight: 1.3,
                    }}>
                      {t.t}
                    </div>
                    <div style={{ fontSize: 11, color: S.g700, marginTop: 1, display: "flex", gap: 6, alignItems: "center" }}>
                      <span>{t.c}</span>
                      <span style={getPill(t.ti)}>{t.ti}</span>
                    </div>
                  </div>

                  {/* Savings */}
                  <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isDone ? S.green : S.primary }}>{fmt(t.sav)} €</div>
                    <div style={{ fontSize: 10, color: S.g700 }}>/ Jahr</div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredTips.length === 0 && (
            <div style={{ padding: "32px 20px", textAlign: "center" as const, color: S.g700 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Keine Tipps gefunden</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Ändere die Filter, um mehr Tipps zu sehen.</div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ FLOATING WIZARD BUTTON ═══ */}
      <button className="floating-btn" onClick={props.onResetWizard}>
        Wizard wiederholen
      </button>

      {/* ═══ TIP DETAIL MODAL ═══ */}
      <AnimatePresence>
        {modalTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={function() { setModalTip(null); }}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
              zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center",
              padding: 0,
            }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={function(e) { e.stopPropagation(); }}
              style={{
                background: "#fff", borderRadius: "24px 24px 0 0", padding: "clamp(16px, 4vw, 24px)",
                maxWidth: 640, width: "100%", boxShadow: "0 -8px 32px rgba(0,0,0,0.15)",
                maxHeight: "85vh", overflowY: "auto" as const, WebkitOverflowScrolling: "touch",
              }}
            >
              {/* Handle bar */}
              <div style={{width:48,height:4,background:"#d4d4d7",borderRadius:2,margin:"0 auto 20px",flexShrink:0}}/>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: CC[modalTip.c] || S.accent }} />
                    <span style={{ fontSize: 11, color: S.g700, fontWeight: 600 }}>{modalTip.c}</span>
                    <span style={getPill(modalTip.ti)}>{modalTip.ti}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: S.primary, lineHeight: 1.3 }}>{modalTip.t}</div>
                </div>
                <button
                  onClick={function() { setModalTip(null); }}
                  style={{
                    background: "none", border: "none", fontSize: 22, cursor: "pointer",
                    color: S.g600, padding: 8, minWidth: 44, minHeight: 44,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    touchAction: "manipulation",
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ fontSize: 13, color: S.g800, lineHeight: 1.6, marginBottom: 18 }}>{modalTip.desc}</div>

              <div style={{
                display: "flex", gap: 16, padding: "16px 0", borderTop: "1px solid #e3e3e6",
                borderBottom: "1px solid #e3e3e6", marginBottom: 18,
              }}>
                <div style={{ flex: 1, textAlign: "center" as const }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: S.primary }}>{fmt(modalTip.sav)} €</div>
                  <div style={{ fontSize: 11, color: S.g700 }}>Ersparnis / Jahr</div>
                </div>
                <div style={{ width: 1, background: "#e3e3e6" }} />
                <div style={{ flex: 1, textAlign: "center" as const }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: modalTip.wp === "Core" ? S.green : S.accent }}>{modalTip.wp}</div>
                  <div style={{ fontSize: 11, color: S.g700 }}>Tarif</div>
                </div>
              </div>

              {done.has(modalTip.id) ? (
                <button
                  onClick={function() { toggleDone(modalTip.id); setModalTip(null); }}
                  style={{
                    width: "100%", padding: "14px 0", borderRadius: 12, border: "2px solid " + S.green,
                    background: S.ltGreen, color: S.dkGreen, fontSize: 14, fontWeight: 700,
                    cursor: "pointer", minHeight: 48, touchAction: "manipulation",
                  }}
                >
                  ✓ Umgesetzt — rückgängig machen
                </button>
              ) : (
                <button
                  onClick={function() { markDone(modalTip.id); setModalTip(null); }}
                  style={{
                    width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                    background: S.accent, color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", minHeight: 48, touchAction: "manipulation",
                  }}
                >
                  Tipp umsetzen →
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
