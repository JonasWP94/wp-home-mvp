import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconReceipt, IconCreditCard,
  IconWifi, IconDeviceMobile,
  IconShieldCheck, IconHomeShield, IconHeartHandshake, IconBuilding, IconCar,
} from '@tabler/icons-react';
import {
  ACCENT, PRIMARY, BG, WHITE, BORDER, GREY_200, GREY_700, GREY_800,
  GREEN,
  RADIUS_MD, RADIUS_SM,
  TEXT_XS, TEXT_SM, TEXT_LG,
  FW_REGULAR, FW_MEDIUM, FW_SEMIBOLD, FW_BOLD,
} from '../_tokens';
import WpHeader from '../_WpHeader';
import WpBottomNav from '../_WpBottomNav';

export interface BasicsData {
  steuererklaerung:    boolean;
  girokonto:           boolean;
  internet:            boolean;
  mobilfunk:           boolean;
  haftpflicht:         boolean;
  hausrat:             boolean;
  berufsunfaehigkeit:  boolean;
  gebaeude:            boolean;
  kfzVersicherung:     boolean;
}

interface Props {
  initial?: Partial<BasicsData>;
  showGebaeude?: boolean;
  showKfz?: boolean;
  onDone: (data: BasicsData) => void;
  onBack: () => void;
}

type QuestionDef = {
  key: keyof BasicsData;
  label: string;
  sub: string;
  Icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
};

type StepDef = {
  key: string;
  accent: string;
  questions: QuestionDef[];
};

const FIN_Q: QuestionDef[] = [
  { key: 'steuererklaerung', label: 'Steuererklärung erledigt',        sub: 'Ø 1.095 € Rückerstattung pro Jahr',         Icon: IconReceipt },
  { key: 'girokonto',        label: 'Kostenloses Girokonto vorhanden', sub: 'Bis zu 120 € Kontoführungsgebühren / Jahr', Icon: IconCreditCard },
];

const KOM_Q: QuestionDef[] = [
  { key: 'internet',  label: 'Internet-Vertrag aktuell',  sub: 'Anbieterwechsel spart Ø 240 € / Jahr',      Icon: IconWifi },
  { key: 'mobilfunk', label: 'Mobilfunk-Vertrag aktuell', sub: 'Tarif neu verhandeln spart Ø 180 € / Jahr', Icon: IconDeviceMobile },
];

// ── iOS-style Toggle ─────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  const W = 46, H = 26, KNOB = 22, PAD = (H - KNOB) / 2;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!on); }}
      role="switch" aria-checked={on}
      style={{
        width: W, height: H, borderRadius: H / 2,
        background: on ? GREEN : '#cfcfd5',
        border: 'none', padding: 0,
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s ease', flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: on ? W - KNOB - PAD : PAD }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{
          position: 'absolute', top: PAD, left: 0,
          width: KNOB, height: KNOB, borderRadius: KNOB / 2,
          background: WHITE,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
        }}
      />
    </button>
  );
}

function ToggleRow({ icon: Icon, label, sub, value, onChange }: {
  icon: QuestionDef['Icon']; label: string; sub: string;
  value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        background: WHITE,
        border: `1.5px solid ${value ? GREEN : BORDER}`,
        borderRadius: RADIUS_MD, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'border-color 0.2s ease',
        cursor: 'pointer', userSelect: 'none',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: RADIUS_SM, flexShrink: 0,
        background: value ? '#d3ede5' : GREY_200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}>
        <Icon size={20} stroke={1.8} color={value ? GREEN : GREY_800} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: TEXT_SM, fontWeight: FW_SEMIBOLD, color: PRIMARY, lineHeight: 1.25 }}>{label}</div>
        <div style={{ fontSize: TEXT_XS, fontWeight: FW_REGULAR, color: GREY_800, marginTop: 2, lineHeight: 1.4 }}>{sub}</div>
      </div>
      <Toggle on={value} onChange={onChange} />
    </div>
  );
}

export default function MvpBasics({ initial, showGebaeude, showKfz, onDone, onBack }: Props) {
  const [data, setData] = useState<BasicsData>({
    steuererklaerung:    initial?.steuererklaerung    ?? false,
    girokonto:           initial?.girokonto           ?? false,
    internet:            initial?.internet            ?? false,
    mobilfunk:           initial?.mobilfunk           ?? false,
    haftpflicht:         initial?.haftpflicht         ?? false,
    hausrat:             initial?.hausrat             ?? false,
    berufsunfaehigkeit:  initial?.berufsunfaehigkeit  ?? false,
    gebaeude:            initial?.gebaeude            ?? false,
    kfzVersicherung:     initial?.kfzVersicherung     ?? false,
  });

  const VERS_Q: QuestionDef[] = [
    { key: 'haftpflicht', label: 'Privathaftpflichtversicherung', sub: 'Schützt vor teuren Schadensersatzforderungen — Pflicht für jeden Haushalt', Icon: IconShieldCheck },
    { key: 'hausrat',     label: 'Hausratversicherung',           sub: 'Deckt Einbruch, Feuer & Wasser — Anbieterwechsel spart Ø 120 € / Jahr',     Icon: IconHomeShield },
    ...(showGebaeude ? [{ key: 'gebaeude' as keyof BasicsData, label: 'Wohngebäudeversicherung', sub: 'Pflicht für Hauseigentümer — Tarifvergleich spart oft mehrere hundert Euro', Icon: IconBuilding }] : []),
    ...(showKfz      ? [{ key: 'kfzVersicherung' as keyof BasicsData, label: 'KFZ-Versicherung aktuell', sub: 'Anbieterwechsel spart Ø 350 € pro Fahrzeug / Jahr', Icon: IconCar }] : []),
    { key: 'berufsunfaehigkeit', label: 'Berufsunfähigkeitsversicherung', sub: 'Sichert Ihr Einkommen bei Krankheit oder Unfall', Icon: IconHeartHandshake },
  ];

  const STEPS: StepDef[] = [
    { key: 'finanzen',       accent: 'Finanzen',       questions: FIN_Q },
    { key: 'kommunikation',  accent: 'Kommunikation',  questions: KOM_Q },
    { key: 'versicherungen', accent: 'Versicherungen', questions: VERS_Q },
  ];

  const [stepIdx, setStepIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const current = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const total = STEPS.length;

  function goNext() {
    if (isLast) { onDone(data); return; }
    setDir(1);
    setStepIdx(i => i + 1);
  }
  function skip() {
    goNext();
  }
  function goBack() {
    if (stepIdx === 0) { onBack(); return; }
    setDir(-1);
    setStepIdx(i => i - 1);
  }
  function skipAll() {
    onDone(data);
  }

  const progressPct = 60 + ((stepIdx + 1) / total) * 30;

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader showProgress progressPct={progressPct} />

      <div className="wp-page-basics" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 120px' }}>
        <style>{`@media(min-width:640px){.wp-page-basics{padding:32px 24px 120px !important;}}`}</style>
        <div style={{ width: '100%', maxWidth: 720 }}>

          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
            {STEPS.map((_, i) => {
              const isActive = i === stepIdx;
              const isDoneStep = i < stepIdx;
              return (
                <motion.div
                  key={i}
                  animate={{
                    width: isActive ? 28 : 8,
                    background: isDoneStep ? ACCENT : isActive ? ACCENT : 'rgba(42,111,166,0.18)',
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: 6, borderRadius: 3 }}
                />
              );
            })}
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current.key}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{
                  fontSize: 11, fontWeight: FW_BOLD, color: ACCENT,
                  letterSpacing: '0.1em', marginBottom: 8,
                }}>
                  SCHRITT {stepIdx + 1} VON {total}
                </div>
                <h1 style={{
                  fontSize: TEXT_LG + 4, fontWeight: FW_SEMIBOLD,
                  color: PRIMARY, lineHeight: 1.25, marginBottom: 8,
                  letterSpacing: '-0.01em',
                }}>
                  Basics: <span style={{ color: ACCENT }}>{current.accent}</span>
                </h1>
                <p style={{ fontSize: TEXT_SM, color: GREY_800, lineHeight: 1.55, fontWeight: FW_REGULAR }}>
                  Aktivieren Sie, was bereits optimiert ist — alles andere zeigen wir Ihnen als Spartipp.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {current.questions.map(q => (
                  <ToggleRow
                    key={q.key}
                    icon={q.Icon}
                    label={q.label}
                    sub={q.sub}
                    value={Boolean(data[q.key])}
                    onChange={v => setData(d => ({ ...d, [q.key]: v }))}
                  />
                ))}
              </div>

              {/* Skip current step */}
              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <button
                  onClick={skip}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: GREY_700, fontWeight: FW_MEDIUM,
                    padding: '6px 8px', fontFamily: 'inherit',
                  }}
                >
                  Diesen Schritt überspringen
                </button>
              </div>

              {/* Skip everything */}
              {stepIdx === 0 && (
                <div style={{ textAlign: 'center', marginTop: 4 }}>
                  <button
                    onClick={skipAll}
                    style={{
                      background: 'none', border: 'none',
                      fontSize: 12, color: GREY_800, fontWeight: FW_MEDIUM,
                      cursor: 'pointer', padding: '4px 8px',
                      textDecoration: 'underline', fontFamily: 'inherit',
                    }}
                  >
                    Alle Basics überspringen
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      <WpBottomNav
        onBack={goBack}
        onNext={goNext}
        nextLabel={isLast ? 'Ergebnis anzeigen' : 'Weiter'}
        middle={
          <div style={{ fontSize: 12, color: GREY_800, fontWeight: FW_SEMIBOLD }}>
            {stepIdx + 1} / {total}
          </div>
        }
      />
    </div>
  );
}
