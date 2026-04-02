import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWpHome, Household, ElectricityContract, GasContract, WpHomeData, HeatingType, BuildingAge, InsulationQuality, IncomeLevel } from "../../store/wpHomeStore";

// ── Helpers ──────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString("de-DE"); }

function isValidPLZ(v: string) { return /^\d{5}$/.test(v); }

// ── Confetti CSS Keyframes (injected once) ──────────────────────
const CONFETTI_STYLE_ID = "wp-confetti-style";
function ensureConfettiStyles() {
  if (document.getElementById(CONFETTI_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = CONFETTI_STYLE_ID;
  style.textContent = `
@keyframes wpConfettiFall {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
@keyframes wpConfettiSway {
  0%, 100% { margin-left: 0; }
  25% { margin-left: 15px; }
  75% { margin-left: -15px; }
}
.wp-confetti-piece {
  position: fixed;
  top: -10px;
  z-index: 9999;
  animation: wpConfettiFall var(--fall-duration) ease-in forwards,
             wpConfettiSway var(--sway-duration) ease-in-out infinite;
}
`;
  document.head.appendChild(style);
}

function ConfettiExplosion() {
  const [pieces, setPieces] = useState<any[]>([]);
  useEffect(() => {
    ensureConfettiStyles();
    const colors = ["#24a47d", "#2a6fa6", "#f9aa00", "#ef7520", "#db2777", "#7c3aed", "#10b981"];
    const shapes = ["square", "circle", "strip"];
    const newPieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      fallDuration: 2 + Math.random() * 2,
      swayDuration: 1 + Math.random() * 2,
      delay: Math.random() * 0.8,
      size: 6 + Math.random() * 8,
    }));
    setPieces(newPieces);
    const timer = setTimeout(() => setPieces([]), 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="wp-confetti-piece"
          style={{
            left: p.left + "%",
            width: p.shape === "strip" ? p.size * 0.4 : p.size,
            height: p.shape === "strip" ? p.size * 1.6 : p.size,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "strip" ? 2 : 1,
            background: p.color,
            "--fall-duration": p.fallDuration + "s",
            "--sway-duration": p.swayDuration + "s",
            animationDelay: p.delay + "s",
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

// ── Colors (matching RoomsEditor) ────────────────────────────────
const C = {
  primary: "#243c47",
  accent: "#24a47d",
  bg: "#f8f8fa",
  white: "#fff",
  g300: "#d4d4d7",
  g700: "#6b6b7b",
  border: "#e3e3e6",
};

// ── Styles ─────────────────────────────────────────────────────
const S = {
  stepTitle: {
    fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 4,
  } as React.CSSProperties,
  stepSub: {
    fontSize: 13, color: C.g700, marginBottom: 20, lineHeight: 1.5,
  } as React.CSSProperties,
  field: {
    marginBottom: 16,
  } as React.CSSProperties,
  label: {
    display: "block", fontSize: 12, fontWeight: 700, color: C.primary,
    marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em",
  } as React.CSSProperties,
  input: {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: "1px solid " + C.border, fontSize: 16, color: C.primary,
    background: C.white, outline: "none", boxSizing: "border-box" as const,
    transition: "border-color 0.15s", minHeight: 52, touchAction: "manipulation",
    WebkitAppearance: "none", accentColor: C.accent,
    fontFamily: "Poppins, sans-serif",
  } as React.CSSProperties,
  select: {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: "1px solid " + C.border, fontSize: 16, color: C.primary,
    background: C.white, outline: "none", boxSizing: "border-box" as const,
    appearance: "none" as const, minHeight: 52, touchAction: "manipulation",
    WebkitAppearance: "none", fontFamily: "Poppins, sans-serif",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b6b7b'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    backgroundSize: 20,
    paddingRight: 40,
  } as React.CSSProperties,
  pillGroup: {
    display: "flex", gap: 8, flexWrap: "wrap" as const,
  } as React.CSSProperties,
  pill: {
    padding: "12px 18px", borderRadius: 14, fontSize: 14, fontWeight: 600,
    border: "1px solid " + C.border, background: C.white, color: C.primary,
    cursor: "pointer", transition: "all 0.15s", minHeight: 48,
    display: "flex", alignItems: "center", justifyContent: "center",
    touchAction: "manipulation", fontFamily: "Poppins, sans-serif",
  } as React.CSSProperties,
  pillActive: {
    border: "1.5px solid " + C.accent, background: "#e6f7f1", color: C.accent,
  } as React.CSSProperties,
  btnPrimary: {
    flex: 1, padding: "16px 0", borderRadius: 14, border: "none",
    background: "linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)", color: "#fff",
    fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 52,
    transition: "transform 0.1s, box-shadow 0.15s",
    boxShadow: "0 4px 14px rgba(36,164,125,0.3)",
    touchAction: "manipulation", fontFamily: "Poppins, sans-serif",
  } as React.CSSProperties,
  btnGhost: {
    padding: "16px 24px", borderRadius: 14, border: "1px solid " + C.border,
    background: C.white, color: C.g700, fontSize: 15, fontWeight: 600,
    cursor: "pointer", minHeight: 52,
    transition: "all 0.15s", touchAction: "manipulation",
    fontFamily: "Poppins, sans-serif",
  } as React.CSSProperties,
  error: {
    fontSize: 11, color: "#dc2626", marginTop: 4, fontWeight: 500,
  } as React.CSSProperties,
  sectionLabel: {
    fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const,
    letterSpacing: "0.08em", marginBottom: 12,
  } as React.CSSProperties,
  skipLink: {
    display: "block", textAlign: "center" as const, marginTop: 12,
    fontSize: 12, color: C.g700, cursor: "pointer", textDecoration: "underline",
    padding: "8px 0", minHeight: 48, lineHeight: "32px",
  } as React.CSSProperties,
  summaryRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: "1px solid #f1f5f9",
    fontSize: 13,
  } as React.CSSProperties,
};

const cardStyle = {
  display: "flex", flexDirection: "column" as const, alignItems: "center",
  padding: "14px 12px", borderRadius: 14, border: "1px solid " + C.border,
  background: C.white, cursor: "pointer", transition: "all 0.15s",
  gap: 8, flex: "1 1 0", minWidth: 0, minHeight: 80,
  touchAction: "manipulation", fontFamily: "Poppins, sans-serif",
} as React.CSSProperties;

const cardActiveStyle = {
  border: "1.5px solid " + C.accent, background: "#e6f7f1",
} as React.CSSProperties;

const cardIcon = {
  fontSize: 28, lineHeight: 1,
} as React.CSSProperties;

const cardLabel = {
  fontSize: 12, fontWeight: 600, color: C.primary, textAlign: "center" as const,
  lineHeight: 1.4,
} as React.CSSProperties;

const cardLabelActive = {
  color: C.accent,
} as React.CSSProperties;

const toggleGroup = {
  display: "flex", gap: 8,
} as React.CSSProperties;

const toggleBtn = {
  flex: 1, padding: "14px 18px", borderRadius: 14, fontSize: 14, fontWeight: 600,
  border: "1px solid " + C.border, background: C.white, color: C.primary,
  cursor: "pointer", transition: "all 0.15s", textAlign: "center" as const,
  minHeight: 48, touchAction: "manipulation", fontFamily: "Poppins, sans-serif",
} as React.CSSProperties;

const toggleActive = {
  border: "1.5px solid " + C.accent, background: "#e6f7f1", color: C.accent,
} as React.CSSProperties;

// ── Slide animation variants ────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

// ── Step components ───────────────────────────────────────────────

function StepHousehold({ data, update }: { data: Household; update: (p: Partial<Household>) => void }) {
  const [plzErr, setPlzErr] = useState("");

  function handlePLZ(v: string) {
    update({ plz: v });
    if (v.length === 5) {
      setPlzErr(isValidPLZ(v) ? "" : "Bitte 5-stellige PLZ eingeben");
    } else {
      setPlzErr("");
    }
  }

  return (
    <>
      <div style={S.stepTitle}>Wer wohnt hier?</div>
      <div style={S.stepSub}>Basisdaten helfen uns, Sparpotenziale realistisch einzuschätzen.</div>

      <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border, marginBottom: 12 }}>
        <div style={S.field}>
          <label style={S.label}>Postleitzahl</label>
          <input
            style={{ ...S.input, ...(plzErr ? { borderColor: "#dc2626" } : {}) }}
            placeholder="z.B. 10115"
            value={data.plz}
            maxLength={5}
            onChange={e => handlePLZ(e.target.value)}
          />
          {plzErr && <div style={S.error}>{plzErr}</div>}
        </div>

        <div style={S.field}>
          <label style={S.label}>Wohnfläche (m²) — optional</label>
          <input
            style={S.input}
            type="number"
            placeholder="z.B. 80"
            value={data.area || ""}
            min={10} max={1000}
            onChange={e => update({ area: Number(e.target.value) })}
          />
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border, marginBottom: 12 }}>
        <div style={S.field}>
          <label style={S.label}>Personen im Haushalt</label>
          <div style={S.pillGroup}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => update({ persons: n })}
                style={{ ...S.pill, ...(data.persons === n ? S.pillActive : {}) }}
              >
                {n} {n === 1 ? "Person" : n === 5 ? "+ Personen" : "Personen"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...S.field, marginBottom: 0 }}>
          <label style={S.label}>Wohnform</label>
          <div style={S.pillGroup}>
            {(["apartment", "house"] as const).map(t => (
              <button
                key={t}
                onClick={() => update({ propertyType: t })}
                style={{ ...S.pill, ...(data.propertyType === t ? S.pillActive : {}) }}
              >
                {t === "apartment" ? "🏢 Wohnung" : "🏠 Haus"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function StepElectricity({ data, update }: {
  data: ElectricityContract | null;
  update: (e: ElectricityContract | null) => void;
}) {
  const [hasElec, setHasElec] = useState(!!data);

  const def: ElectricityContract = data || {
    provider: "", kwh: 2500, monthlyCost: 80,
    tariffType: "grundversorgung", contractEnd: "",
  };

  function set(p: Partial<ElectricityContract>) {
    update({ ...def, ...p });
  }

  if (!hasElec) {
    return (
      <>
        <div style={S.stepTitle}>Stromvertrag</div>
        <div style={S.stepSub}>Keinen Stromvertrag? Kein Problem — skippe diesen Schritt.</div>
        <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => setHasElec(true)}
              style={{ ...S.btnPrimary, flex: "none", padding: "14px 24px", width: "fit-content" }}
            >
              Stromvertrag hinzufügen
            </button>
            <div style={S.skipLink} onClick={() => update(null)}>Überspringen →</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={S.stepTitle}>Strom</div>
      <div style={S.stepSub}>Trage deinen aktuellen Stromvertrag ein — oder überspringe.</div>

      <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border }}>
        <div style={S.field}>
          <label style={S.label}>Anbieter</label>
          <input
            style={S.input}
            placeholder="z.B. Vattenfall, E.ON, local..."
            value={def.provider}
            onChange={e => set({ provider: e.target.value })}
          />
        </div>

        <div style={S.field}>
          <label style={S.label}>Jahresverbrauch (kWh)</label>
          <input
            style={S.input}
            type="number"
            placeholder="z.B. 2500"
            value={def.kwh || ""}
            min={100} max={100000}
            onChange={e => set({ kwh: Number(e.target.value) })}
          />
          <div style={{ fontSize: 11, color: C.g700, marginTop: 4 }}>
            Ø-Verbrauch: 1 Person ≈ 1.500 kWh · 2 Personen ≈ 2.500 kWh · 4 Personen ≈ 4.000 kWh
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Monatliche Kosten (€)</label>
          <input
            style={S.input}
            type="number"
            placeholder="z.B. 80"
            value={def.monthlyCost || ""}
            min={0}
            onChange={e => set({ monthlyCost: Number(e.target.value) })}
          />
        </div>

        <div style={S.field}>
          <label style={S.label}>Tarifart</label>
          <select
            style={S.select}
            value={def.tariffType}
            onChange={e => set({ tariffType: e.target.value as ElectricityContract["tariffType"] })}
          >
            <option value="grundversorgung">Grundversorgung</option>
            <option value="sondertarif">Sondertarif</option>
            <option value="oeko">Öko-Tarif</option>
          </select>
        </div>

        <div style={{ ...S.field, marginBottom: 0 }}>
          <label style={S.label}>Vertragsende (Monat/Jahr) — optional</label>
          <input
            style={S.input}
            type="month"
            value={def.contractEnd}
            onChange={e => set({ contractEnd: e.target.value })}
          />
        </div>
      </div>

      <div style={S.skipLink} onClick={() => { setHasElec(false); update(null); }}>
        ← Zurück / Kein Stromvertrag
      </div>
    </>
  );
}

function StepGas({ data, update }: {
  data: GasContract | null;
  update: (g: GasContract | null) => void;
}) {
  const [hasGas, setHasGas] = useState(!!data);

  const def: GasContract = data || {
    provider: "", kwh: 12000, monthlyCost: 100, contractEnd: "",
  };

  function set(p: Partial<GasContract>) {
    update({ ...def, ...p });
  }

  if (!hasGas) {
    return (
      <>
        <div style={S.stepTitle}>Gasvertrag</div>
        <div style={S.stepSub}>Kein Gas? Überspringe einfach.</div>
        <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => setHasGas(true)}
              style={{ ...S.btnPrimary, flex: "none", padding: "14px 24px", width: "fit-content" }}
            >
              Gasvertrag hinzufügen
            </button>
            <div style={S.skipLink} onClick={() => update(null)}>Überspringen →</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={S.stepTitle}>Gas</div>
      <div style={S.stepSub}>Trage deinen Gasvertrag ein — oder überspringe.</div>

      <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border }}>
        <div style={S.field}>
          <label style={S.label}>Anbieter</label>
          <input
            style={S.input}
            placeholder="z.B. E.ON, local..."
            value={def.provider}
            onChange={e => set({ provider: e.target.value })}
          />
        </div>

        <div style={S.field}>
          <label style={S.label}>Jahresverbrauch (kWh)</label>
          <input
            style={S.input}
            type="number"
            placeholder="z.B. 12000"
            value={def.kwh || ""}
            min={100} max={200000}
            onChange={e => set({ kwh: Number(e.target.value) })}
          />
          <div style={{ fontSize: 11, color: C.g700, marginTop: 4 }}>
            Ø-Verbrauch: Wohnung ≈ 6.000 kWh · Einfamilienhaus ≈ 20.000 kWh
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Monatliche Kosten (€)</label>
          <input
            style={S.input}
            type="number"
            placeholder="z.B. 100"
            value={def.monthlyCost || ""}
            min={0}
            onChange={e => set({ monthlyCost: Number(e.target.value) })}
          />
        </div>

        <div style={{ ...S.field, marginBottom: 0 }}>
          <label style={S.label}>Vertragsende (Monat/Jahr) — optional</label>
          <input
            style={S.input}
            type="month"
            value={def.contractEnd}
            onChange={e => set({ contractEnd: e.target.value })}
          />
        </div>
      </div>

      <div style={S.skipLink} onClick={() => { setHasGas(false); update(null); }}>
        ← Zurück / Kein Gasvertrag
      </div>
    </>
  );
}

const HEATING_LABELS: Record<HeatingType, string> = {
  gas: "🔥 Gas", oil: "🛢️ Öl", heat_pump: "♨️ Wärmepumpe",
  district: "🏭 Fernwärme", electric: "⚡ Elektro", other: "❓ Andere",
};
const BUILDING_LABELS: Record<BuildingAge, string> = {
  pre1990: "🏚️ Vor 1990", "1990to2010": "🏠 1990–2010", post2010: "🏗️ Nach 2010",
};
const INSULATION_LABELS: Record<InsulationQuality, string> = {
  poor: "🥶 Schlecht", medium: "😐 Mittel", good: "🏅 Gut",
};
const INCOME_LABELS: Record<IncomeLevel, string> = {
  low: "🦊 Sparfuchs", medium: "⚖️ Ausgewogen", high: "🛋️ Komfortabel", very_high: "💎 Premium",
};

function StepReview({ household, electricity, gas }: {
  household: Household;
  electricity: ElectricityContract | null;
  gas: GasContract | null;
}) {
  const { data } = useWpHome();
  const persons = ["1 Person", "2 Personen", "3 Personen", "4 Personen", "5+ Personen"][household.persons - 1] || `${household.persons} Personen`;

  return (
    <>
      <div style={S.stepTitle}>Sieht gut aus!</div>
      <div style={S.stepSub}>Das ist alles was wir brauchen. Ab jetzt berechnet das Dashboard dein personalisiertes Sparpotenzial.</div>

      <div style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)",
        borderRadius: 14, padding: "16px 14px", marginBottom: 12,
        border: "1px solid #bbf7d0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #24a47d, #167a52)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>🏠</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>Dein Profil</div>
            <div style={{ fontSize: 11, color: C.g700 }}>Zusammenfassung deiner Angaben</div>
          </div>
        </div>

        <div style={S.sectionLabel}>Haushalt</div>
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: "8px 14px", marginBottom: 12 }}>
          <div style={S.summaryRow}>
            <span style={{ color: C.g700 }}>PLZ</span>
            <span style={{ fontWeight: 700, color: C.primary }}>{household.plz || "—"}</span>
          </div>
          <div style={S.summaryRow}>
            <span style={{ color: C.g700 }}>Personen</span>
            <span style={{ fontWeight: 700, color: C.primary }}>{persons}</span>
          </div>
          <div style={S.summaryRow}>
            <span style={{ color: C.g700 }}>Wohnform</span>
            <span style={{ fontWeight: 700, color: C.primary }}>{household.propertyType === "apartment" ? "🏢 Wohnung" : "🏠 Haus"}</span>
          </div>
          {household.area > 0 && (
            <div style={{ ...S.summaryRow, borderBottom: "none" }}>
              <span style={{ color: C.g700 }}>Fläche</span>
              <span style={{ fontWeight: 700, color: C.primary }}>{household.area} m²</span>
            </div>
          )}
        </div>

        {electricity && (
          <>
            <div style={S.sectionLabel}>⚡ Strom</div>
            <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: "8px 14px", marginBottom: 12 }}>
              <div style={S.summaryRow}>
                <span style={{ color: C.g700 }}>Anbieter</span>
                <span style={{ fontWeight: 700, color: C.primary }}>{electricity.provider || "—"}</span>
              </div>
              <div style={S.summaryRow}>
                <span style={{ color: C.g700 }}>Verbrauch</span>
                <span style={{ fontWeight: 700, color: C.primary }}>{fmt(electricity.kwh)} kWh/J</span>
              </div>
              <div style={{ ...S.summaryRow, borderBottom: "none" }}>
                <span style={{ color: C.g700 }}>Kosten</span>
                <span style={{ fontWeight: 700, color: C.primary }}>{fmt(electricity.monthlyCost)} €/Mo</span>
              </div>
            </div>
          </>
        )}

        {gas && (
          <>
            <div style={S.sectionLabel}>🔥 Gas</div>
            <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: "8px 14px", marginBottom: 12 }}>
              <div style={S.summaryRow}>
                <span style={{ color: C.g700 }}>Anbieter</span>
                <span style={{ fontWeight: 700, color: C.primary }}>{gas.provider || "—"}</span>
              </div>
              <div style={S.summaryRow}>
                <span style={{ color: C.g700 }}>Verbrauch</span>
                <span style={{ fontWeight: 700, color: C.primary }}>{fmt(gas.kwh)} kWh/J</span>
              </div>
              <div style={{ ...S.summaryRow, borderBottom: "none" }}>
                <span style={{ color: C.g700 }}>Kosten</span>
                <span style={{ fontWeight: 700, color: C.primary }}>{fmt(gas.monthlyCost)} €/Mo</span>
              </div>
            </div>
          </>
        )}

        <div style={S.sectionLabel}>🏠 Gebäude & Lifestyle</div>
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: "8px 14px" }}>
          <div style={S.summaryRow}>
            <span style={{ color: C.g700 }}>Heizung</span>
            <span style={{ fontWeight: 700, color: C.primary }}>{HEATING_LABELS[data.heatingType]}</span>
          </div>
          <div style={S.summaryRow}>
            <span style={{ color: C.g700 }}>Gebäudealter</span>
            <span style={{ fontWeight: 700, color: C.primary }}>{BUILDING_LABELS[data.buildingAge]}</span>
          </div>
          <div style={S.summaryRow}>
            <span style={{ color: C.g700 }}>Isolierung</span>
            <span style={{ fontWeight: 700, color: C.primary }}>{INSULATION_LABELS[data.insulationQuality]}</span>
          </div>
          <div style={S.summaryRow}>
            <span style={{ color: C.g700 }}>Budget</span>
            <span style={{ fontWeight: 700, color: C.primary }}>{INCOME_LABELS[data.income]}</span>
          </div>
          <div style={S.summaryRow}>
            <span style={{ color: C.g700 }}>Garten</span>
            <span style={{ fontWeight: 700, color: C.primary }}>{data.hasGarden ? "🌿 Ja" : "Nein"}</span>
          </div>
          <div style={{ ...S.summaryRow, borderBottom: "none" }}>
            <span style={{ color: C.g700 }}>Solar-Potenzial</span>
            <span style={{ fontWeight: 700, color: C.primary }}>{data.hasSolarPotential ? "☀️ Ja" : "Nein"}</span>
          </div>
        </div>
      </div>

      {!electricity && !gas && (
        <div style={{ background: "#fff7ed", borderRadius: 14, padding: "12px 16px", marginBottom: 12, fontSize: 13, color: "#92400e" }}>
          Keine Energieverträge eingetragen. Die Ersparnis-Prognose basiert dann auf Durchschnittswerten.
        </div>
      )}
    </>
  );
}

// ── Building & Heating Step ──────────────────────────────────────

const HEATING_OPTIONS: { value: HeatingType; icon: string; label: string }[] = [
  { value: "gas", icon: "🔥", label: "Gas" },
  { value: "oil", icon: "🛢️", label: "Öl" },
  { value: "heat_pump", icon: "♨️", label: "Wärmepumpe" },
  { value: "district", icon: "🏭", label: "Fernwärme" },
  { value: "electric", icon: "⚡", label: "Elektro" },
  { value: "other", icon: "❓", label: "Andere" },
];

const BUILDING_AGE_OPTIONS: { value: BuildingAge; icon: string; label: string; sub: string }[] = [
  { value: "pre1990", icon: "🏚️", label: "Vor 1990", sub: "Altbau" },
  { value: "1990to2010", icon: "🏠", label: "1990–2010", sub: "Mittel" },
  { value: "post2010", icon: "🏗️", label: "Nach 2010", sub: "Neubau" },
];

const INSULATION_OPTIONS: { value: InsulationQuality; icon: string; label: string; sub: string }[] = [
  { value: "poor", icon: "🥶", label: "Schlecht", sub: "Zugluft, alte Fenster" },
  { value: "medium", icon: "😐", label: "Mittel", sub: "Teilweise gedämmt" },
  { value: "good", icon: "🏅", label: "Gut", sub: "Modern, dicht" },
];

function StepBuilding({ data, update }: {
  data: WpHomeData;
  update: (p: Partial<Pick<WpHomeData, 'heatingType' | 'buildingAge' | 'insulationQuality'>>) => void;
}) {
  return (
    <>
      <div style={S.stepTitle}>Haushalt & Gebäude</div>
      <div style={S.stepSub}>Wie wird bei dir geheizt? Und wie alt ist das Gebäude? Das hilft uns, die besten Spar-Tipps zu finden.</div>

      <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border, marginBottom: 12 }}>
        <div style={S.field}>
          <label style={S.label}>Heizungsart</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {HEATING_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => update({ heatingType: opt.value })}
                style={{ ...cardStyle, ...(data.heatingType === opt.value ? cardActiveStyle : {}) }}
              >
                <span style={cardIcon}>{opt.icon}</span>
                <span style={{ ...cardLabel, ...(data.heatingType === opt.value ? cardLabelActive : {}) }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border, marginBottom: 12 }}>
        <div style={S.field}>
          <label style={S.label}>Gebäudealter</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {BUILDING_AGE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => update({ buildingAge: opt.value })}
                style={{ ...cardStyle, ...(data.buildingAge === opt.value ? cardActiveStyle : {}) }}
              >
                <span style={cardIcon}>{opt.icon}</span>
                <span style={{ ...cardLabel, ...(data.buildingAge === opt.value ? cardLabelActive : {}) }}>{opt.label}</span>
                <span style={{ fontSize: 9, color: C.g700 }}>{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border }}>
        <div style={{ ...S.field, marginBottom: 0 }}>
          <label style={S.label}>Isolierungsqualität</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {INSULATION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => update({ insulationQuality: opt.value })}
                style={{ ...cardStyle, ...(data.insulationQuality === opt.value ? cardActiveStyle : {}) }}
              >
                <span style={cardIcon}>{opt.icon}</span>
                <span style={{ ...cardLabel, ...(data.insulationQuality === opt.value ? cardLabelActive : {}) }}>{opt.label}</span>
                <span style={{ fontSize: 9, color: C.g700 }}>{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Lifestyle & Budget Step ──────────────────────────────────────

const INCOME_OPTIONS: { value: IncomeLevel; icon: string; label: string; sub: string }[] = [
  { value: "low", icon: "🦊", label: "Sparfuchs", sub: "< 2.000 €" },
  { value: "medium", icon: "⚖️", label: "Ausgewogen", sub: "2.000–4.000 €" },
  { value: "high", icon: "🛋️", label: "Komfortabel", sub: "4.000–6.000 €" },
  { value: "very_high", icon: "💎", label: "Premium", sub: "> 6.000 €" },
];

function StepLifestyle({ data, update }: {
  data: WpHomeData;
  update: (p: Partial<Pick<WpHomeData, 'income' | 'hasGarden' | 'hasSolarPotential'>>) => void;
}) {
  return (
    <>
      <div style={S.stepTitle}>Lifestyle & Budget</div>
      <div style={S.stepSub}>Damit wir Tipps zeigen, die zu deinem Budget passen — keine unrealistischen Empfehlungen.</div>

      <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border, marginBottom: 12 }}>
        <div style={{ ...S.field, marginBottom: 0 }}>
          <label style={S.label}>Haushaltsbudget</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {INCOME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => update({ income: opt.value })}
                style={{ ...cardStyle, ...(data.income === opt.value ? cardActiveStyle : {}) }}
              >
                <span style={cardIcon}>{opt.icon}</span>
                <span style={{ ...cardLabel, ...(data.income === opt.value ? cardLabelActive : {}) }}>{opt.label}</span>
                <span style={{ fontSize: 9, color: C.g700 }}>{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border, marginBottom: 12 }}>
        <div style={{ ...S.field, marginBottom: 0 }}>
          <label style={S.label}>Hast du einen Garten?</label>
          <div style={toggleGroup}>
            <button
              onClick={() => update({ hasGarden: true })}
              style={{ ...toggleBtn, ...(data.hasGarden === true ? toggleActive : {}) }}
            >
              🌿 Ja
            </button>
            <button
              onClick={() => update({ hasGarden: false })}
              style={{ ...toggleBtn, ...(data.hasGarden === false ? toggleActive : {}) }}
            >
              🏢 Nein
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 14, padding: "12px 14px", border: "1px solid " + C.border }}>
        <div style={{ ...S.field, marginBottom: 0 }}>
          <label style={S.label}>Solar-Potenzial? (Dach, Balkon, Süd-Ausrichtung)</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <button
              onClick={() => update({ hasSolarPotential: true })}
              style={{ ...toggleBtn, ...(data.hasSolarPotential === true ? toggleActive : {}) }}
            >
              ☀️ Ja
            </button>
            <button
              onClick={() => update({ hasSolarPotential: false })}
              style={{ ...toggleBtn, ...(data.hasSolarPotential === false ? toggleActive : {}) }}
            >
              🌧️ Nein
            </button>
            <button
              onClick={() => update({ hasSolarPotential: false })}
              style={{ ...toggleBtn, ...(data.hasSolarPotential === false ? toggleActive : {}) }}
            >
              🤷 Weiß nicht
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Wizard ───────────────────────────────────────────────────────
const TOTAL_STEPS = 6;

export default function Wizard() {
  const { data, updateHousehold, updateElectricity, updateGas, updateProfile, finishWizard } = useWpHome();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  function next() {
    setErrors([]);
    if (step === 0) {
      if (!data.household.plz || !isValidPLZ(data.household.plz)) {
        setErrors(["Bitte eine gültige 5-stellige PLZ eingeben."]);
        return;
      }
    }
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      setShowConfetti(true);
      setTimeout(() => {
        finishWizard();
      }, 1500);
    }
  }

  function back() {
    setErrors([]);
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  }

  const stepTitles = ["Haushalt", "Strom", "Gas", "Gebäude", "Lifestyle", "Fertig!"];
  const stepIcons = ["🏠", "⚡", "🔥", "🏗️", "🎨", "🎉"];
  const pct = (step / (TOTAL_STEPS - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed" as const, inset: 0, background: C.bg, zIndex: 1000,
        display: "flex", flexDirection: "column" as const,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {showConfetti && <ConfettiExplosion />}

      {/* ── Header (like RoomsEditor) ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 16px 12px", borderBottom: "1px solid " + C.border,
        background: C.white,
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.primary }}>
          🏠 Einrichtung
        </div>
        <button
          onClick={finishWizard}
          style={{
            fontSize: 12, padding: "8px 16px", borderRadius: 10,
            border: "1px solid " + C.g300, background: C.white,
            color: C.primary, cursor: "pointer", fontWeight: 600,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          ← Überspringen
        </button>
      </div>

      {/* ── Scrollable Body ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>

          {/* ── Green Gradient Header Card (Step + Progress) ── */}
          <div style={{
            background: "linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)",
            borderRadius: 16, padding: "16px 18px", color: "#fff", marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <motion.span
                key={step}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: 24 }}
              >
                {stepIcons[step]}
              </motion.span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>
                  Schritt {step + 1} von {TOTAL_STEPS}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  {stepTitles[step]}
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{
              height: 6, borderRadius: 3, background: "rgba(255,255,255,0.25)",
              overflow: "hidden",
            }}>
              <motion.div
                style={{
                  height: "100%", borderRadius: 3,
                  background: "#fff",
                }}
                initial={{ width: "0%" }}
                animate={{ width: pct + "%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: 8, height: 8, borderRadius: 4,
                    boxSizing: "border-box" as const,
                  }}
                  animate={{
                    scale: i === step ? 1.3 : 1,
                    background: i < step ? "#fff" : i === step ? "#fff" : "rgba(255,255,255,0.3)",
                    border: i === step ? "2px solid #fff" : "2px solid transparent",
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* ── Error Messages ── */}
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14,
                padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626",
              }}
            >
              {errors.map((e, i) => <div key={i}>{e}</div>)}
            </motion.div>
          )}

          {/* ── Step Content with slide animation ── */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {step === 0 && <StepHousehold data={data.household} update={updateHousehold} />}
              {step === 1 && <StepElectricity data={data.electricity} update={updateElectricity} />}
              {step === 2 && <StepGas data={data.gas} update={updateGas} />}
              {step === 3 && <StepBuilding data={data} update={updateProfile} />}
              {step === 4 && <StepLifestyle data={data} update={updateProfile} />}
              {step === 5 && <StepReview household={data.household} electricity={data.electricity} gas={data.gas} />}
            </motion.div>
          </AnimatePresence>

          {/* spacer for fixed footer */}
          <div style={{ height: 80 }} />
        </div>
      </div>

      {/* ── Footer (fixed bottom, like RoomsEditor) ── */}
      <div style={{
        padding: 16, background: C.white, borderTop: "1px solid " + C.border,
        display: "flex", gap: 10,
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto", width: "100%", display: "flex", gap: 10 }}>
          {step > 0 && (
            <motion.button
              style={S.btnGhost}
              onClick={back}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              ← Zurück
            </motion.button>
          )}
          <motion.button
            style={{
              ...S.btnPrimary,
              ...(step === TOTAL_STEPS - 1 ? {
                background: "linear-gradient(135deg, #24a47d 0%, #167a52 100%)",
                boxShadow: "0 4px 14px rgba(36,164,125,0.3)",
              } : {}),
            }}
            onClick={next}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
          >
            {step < TOTAL_STEPS - 1 ? "Weiter →" : "Dashboard starten 🚀"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
