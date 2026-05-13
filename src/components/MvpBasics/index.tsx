import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconReceipt, IconCreditCard,
  IconWifi, IconDeviceMobile,
  IconShieldCheck, IconHomeShield, IconHeartHandshake, IconBuilding, IconCar,
  IconCheck, IconChevronDown, IconArrowRight,
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
  steuererklaerung:    boolean | null;
  girokonto:           boolean | null;
  internet:            boolean | null;
  mobilfunk:           boolean | null;
  haftpflicht:         boolean | null;
  hausrat:             boolean | null;
  berufsunfaehigkeit:  boolean | null;
  gebaeude:            boolean | null;
  kfzVersicherung:     boolean | null;
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

type Section = {
  key: 'finanzen' | 'kommunikation' | 'versicherungen';
  title: string;
  Icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
  questions: QuestionDef[];
};

const FIN_Q: QuestionDef[] = [
  { key: 'steuererklaerung', label: 'Steuererklärung erledigt',        sub: 'Ø 1.095 € Rückerstattung pro Jahr',         Icon: IconReceipt },
  { key: 'girokonto',        label: 'Kostenloses Girokonto vorhanden', sub: 'Bis zu 60 € Kontoführungsgebühren / Jahr',  Icon: IconCreditCard },
];

const KOM_Q: QuestionDef[] = [
  { key: 'internet',  label: 'Internet-Vertrag aktuell',  sub: 'Anbieterwechsel spart Ø 240 € / Jahr',      Icon: IconWifi },
  { key: 'mobilfunk', label: 'Mobilfunk-Vertrag aktuell', sub: 'Tarif neu verhandeln spart Ø 180 € / Jahr', Icon: IconDeviceMobile },
];

const VERS_Q_ALL: QuestionDef[] = [
  { key: 'haftpflicht',        label: 'Privathaftpflichtversicherung',  sub: 'Schützt vor teuren Schadensersatzforderungen',                              Icon: IconShieldCheck },
  { key: 'hausrat',            label: 'Hausratversicherung',            sub: 'Deckt Einbruch, Feuer & Wasser',                                            Icon: IconHomeShield },
  { key: 'gebaeude',           label: 'Wohngebäudeversicherung',        sub: 'Pflicht für Hauseigentümer',                                                Icon: IconBuilding },
  { key: 'kfzVersicherung',    label: 'KFZ-Versicherung aktuell',       sub: 'Anbieterwechsel spart Ø 300 € pro Fahrzeug / Jahr',                          Icon: IconCar },
  { key: 'berufsunfaehigkeit', label: 'Berufsunfähigkeitsversicherung', sub: 'Sichert Ihr Einkommen bei Krankheit oder Unfall',                            Icon: IconHeartHandshake },
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
    steuererklaerung: initial?.steuererklaerung ?? false,
    girokonto:        initial?.girokonto ?? false,
    internet:         initial?.internet ?? false,
    mobilfunk:        initial?.mobilfunk ?? false,
    haftpflicht:      initial?.haftpflicht ?? false,
    hausrat:          initial?.hausrat ?? false,
    berufsunfaehigkeit: initial?.berufsunfaehigkeit ?? false,
    gebaeude:         initial?.gebaeude ?? false,
    kfzVersicherung:  initial?.kfzVersicherung ?? false,
  });

  // Filter Versicherungen by context
  const versQuestions = VERS_Q_ALL.filter(q => {
    if (q.key === 'gebaeude' && !showGebaeude) return false;
    if (q.key === 'kfzVersicherung' && !showKfz) return false;
    return true;
  });

  const SECTIONS: Section[] = [
    { key: 'finanzen',       title: 'Finanzen',       Icon: IconReceipt,     questions: FIN_Q },
    { key: 'kommunikation',  title: 'Kommunikation',  Icon: IconWifi,        questions: KOM_Q },
    { key: 'versicherungen', title: 'Versicherungen', Icon: IconShieldCheck, questions: versQuestions },
  ];

  // Track which section is open (only one at a time)
  const [openSection, setOpenSection] = useState<Section['key']>('finanzen');
  // Track which sections the user has confirmed (or skipped) → marked complete
  const [completed, setCompleted] = useState<Set<Section['key']>>(new Set());

  function completeSection(sec: Section['key']) {
    const newCompleted = new Set(completed); newCompleted.add(sec);
    setCompleted(newCompleted);
    // Find next un-completed section
    const idx = SECTIONS.findIndex(s => s.key === sec);
    const next = SECTIONS.slice(idx + 1).find(s => !newCompleted.has(s.key));
    if (next) {
      setOpenSection(next.key);
    } else {
      // All done
      onDone(data);
    }
  }

  function skipAll() {
    onDone(data);
  }

  const progressPct = 50 + (completed.size / SECTIONS.length) * 45;

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader showProgress progressPct={progressPct} />

      <div className="wp-page-basics" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 120px' }}>
        <style>{`@media(min-width:640px){.wp-page-basics{padding:32px 24px 120px !important;}}`}</style>
        <div style={{ width: '100%', maxWidth: 720 }}>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h1 style={{
                fontSize: TEXT_LG + 4, fontWeight: FW_SEMIBOLD,
                color: PRIMARY, lineHeight: 1.25, marginBottom: 8,
                letterSpacing: '-0.01em',
              }}>
                Basics: <span style={{ color: ACCENT }}>Spar-Potenziale</span>
              </h1>
              <p style={{ fontSize: TEXT_SM, color: GREY_800, lineHeight: 1.55, fontWeight: FW_REGULAR }}>
                Aktivieren Sie, was bereits optimiert ist — alles andere zeigen wir Ihnen als Spartipp.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SECTIONS.map((section, sIdx) => {
                const isOpen = openSection === section.key;
                const isComplete = completed.has(section.key);
                const SectionIcon = section.Icon;

                return (
                  <div
                    key={section.key}
                    style={{
                      background: WHITE,
                      borderRadius: 14,
                      border: `1.5px solid ${isOpen ? ACCENT : isComplete ? GREEN : BORDER}`,
                      overflow: 'hidden',
                      transition: 'border-color 0.25s',
                    }}
                  >
                    {/* Section header */}
                    <button
                      onClick={() => setOpenSection(isOpen ? null as any : section.key)}
                      style={{
                        width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                        padding: '14px 16px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        textAlign: 'left' as const, fontFamily: 'inherit',
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: isComplete ? GREEN : isOpen ? ACCENT : GREY_200,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                      }}>
                        {isComplete
                          ? <IconCheck size={16} stroke={2.5} color={WHITE} />
                          : <SectionIcon size={16} stroke={1.8} color={isOpen ? WHITE : GREY_800} />
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: FW_BOLD, color: isOpen ? ACCENT : GREY_800, letterSpacing: '0.04em', marginBottom: 2 }}>
                          SCHRITT {sIdx + 1} / {SECTIONS.length}
                        </div>
                        <div style={{ fontSize: TEXT_SM + 1, fontWeight: FW_SEMIBOLD, color: PRIMARY, lineHeight: 1.25 }}>
                          {section.title}
                        </div>
                      </div>
                      <IconChevronDown
                        size={20} stroke={1.8} color={GREY_800}
                        style={{
                          transition: 'transform 0.25s',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          flexShrink: 0,
                        }}
                      />
                    </button>

                    {/* Section body */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '4px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {section.questions.map(q => (
                              <ToggleRow
                                key={q.key}
                                icon={q.Icon}
                                label={q.label}
                                sub={q.sub}
                                value={Boolean(data[q.key])}
                                onChange={v => setData(d => ({ ...d, [q.key]: v }))}
                              />
                            ))}

                            {/* Buttons row */}
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              marginTop: 6,
                            }}>
                              <button
                                onClick={() => completeSection(section.key)}
                                style={{
                                  background: 'transparent',
                                  color: GREY_700,
                                  border: 'none',
                                  fontSize: 13, fontWeight: FW_MEDIUM,
                                  cursor: 'pointer',
                                  padding: '8px 4px',
                                  fontFamily: 'inherit',
                                }}
                              >
                                Überspringen
                              </button>
                              <div style={{ flex: 1 }} />
                              <button
                                onClick={() => completeSection(section.key)}
                                style={{
                                  background: PRIMARY,
                                  color: WHITE,
                                  border: 'none', borderRadius: 999,
                                  padding: '10px 18px',
                                  fontSize: 13, fontWeight: FW_BOLD,
                                  cursor: 'pointer',
                                  display: 'inline-flex', alignItems: 'center', gap: 6,
                                  fontFamily: 'inherit',
                                }}
                              >
                                Weiter <IconArrowRight size={14} stroke={2.5} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Skip all */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                onClick={skipAll}
                style={{
                  background: 'none', border: 'none',
                  fontSize: 12, color: GREY_800, fontWeight: FW_MEDIUM,
                  cursor: 'pointer', padding: '6px 8px',
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                }}
              >
                Alle Basics überspringen
              </button>
            </div>

          </motion.div>
        </div>
      </div>

      <WpBottomNav
        onBack={onBack}
        onNext={() => onDone(data)}
        nextLabel="Ergebnis anzeigen"
      />
    </div>
  );
}
