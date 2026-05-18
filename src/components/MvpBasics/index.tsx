import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconReceipt, IconCreditCard,
  IconWifi, IconDeviceMobile,
  IconShieldCheck, IconHomeShield, IconHeartHandshake, IconBuilding, IconCar,
  IconCoin, IconShield,
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

type TabDef = {
  key: string;
  label: string;
  TabIcon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
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

  const TABS: TabDef[] = [
    { key: 'finanzen',       label: 'Finanzen',       TabIcon: IconCoin,         questions: FIN_Q },
    { key: 'kommunikation',  label: 'Kommunikation',  TabIcon: IconWifi,         questions: KOM_Q },
    { key: 'versicherungen', label: 'Versicherungen', TabIcon: IconShield,       questions: VERS_Q },
  ];

  const [activeKey, setActiveKey] = useState<string>(TABS[0].key);
  const active = TABS.find(t => t.key === activeKey) ?? TABS[0];

  function countActiveInTab(tab: TabDef) {
    return tab.questions.filter(q => data[q.key]).length;
  }

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader showProgress progressPct={85} />

      <div className="wp-page-basics" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 120px' }}>
        <style>{`@media(min-width:640px){.wp-page-basics{padding:32px 24px 120px !important;}}`}</style>
        <div style={{ width: '100%', maxWidth: 760 }}>

          {/* Headline */}
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
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

          {/* Tab menu */}
          <div
            role="tablist"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
              gap: 6,
              background: '#eef0f3',
              borderRadius: 999,
              padding: 4,
              marginBottom: 18,
            }}
          >
            {TABS.map(tab => {
              const isActive = tab.key === activeKey;
              const TabIcon = tab.TabIcon;
              const activeCount = countActiveInTab(tab);
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveKey(tab.key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: isActive ? ACCENT : 'transparent',
                    color: isActive ? WHITE : GREY_800,
                    border: 'none',
                    borderRadius: 999,
                    padding: '9px 12px',
                    fontSize: 13, fontWeight: FW_BOLD,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    position: 'relative',
                  }}
                >
                  <TabIcon size={15} stroke={1.8} color={isActive ? WHITE : GREY_800} />
                  <span className="wp-tab-label" style={{ whiteSpace: 'nowrap' }}>{tab.label}</span>
                  {activeCount > 0 && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: 16, height: 16, borderRadius: 8,
                      background: isActive ? 'rgba(255,255,255,0.25)' : GREEN,
                      color: WHITE,
                      fontSize: 10, fontWeight: FW_BOLD,
                      padding: '0 5px',
                      marginLeft: 2,
                    }}>
                      {activeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <style>{`
            @media(max-width:520px){
              .wp-tab-label{display:none;}
            }
          `}</style>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {active.questions.map(q => (
                <ToggleRow
                  key={q.key}
                  icon={q.Icon}
                  label={q.label}
                  sub={q.sub}
                  value={Boolean(data[q.key])}
                  onChange={v => setData(d => ({ ...d, [q.key]: v }))}
                />
              ))}
            </motion.div>
          </AnimatePresence>

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
