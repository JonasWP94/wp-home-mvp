import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconDeviceMobile,
  IconWifi,
} from '@tabler/icons-react';
import {
  ACCENT, PRIMARY, BG, WHITE, BORDER, GREY_200, GREY_800,
  GREEN,
  RADIUS_MD, RADIUS_SM,
  TEXT_XS, TEXT_SM, TEXT_LG,
  FW_REGULAR, FW_SEMIBOLD,
} from '../_tokens';
import WpHeader from '../_WpHeader';
import WpBottomNav from '../_WpBottomNav';

export interface KommunikationData {
  mobilfunk: boolean;
  internet:  boolean;
}

interface Props {
  onDone: (data: KommunikationData) => void;
  onBack: () => void;
}

const QUESTIONS: { key: keyof KommunikationData; label: string; sub: string; Icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }> }[] = [
  { key: 'mobilfunk', label: 'Mobilfunk', sub: 'Tarif neu verhandeln spart Ø 180 € / Jahr',  Icon: IconDeviceMobile },
  { key: 'internet',  label: 'Internet',  sub: 'Anbieterwechsel spart Ø 240 € / Jahr',       Icon: IconWifi },
];

// ── iOS-style Toggle ─────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  const W = 46;
  const H = 26;
  const KNOB = 22;
  const PAD = (H - KNOB) / 2;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!on); }}
      role="switch"
      aria-checked={on}
      style={{
        width: W, height: H, borderRadius: H / 2,
        background: on ? GREEN : '#cfcfd5',
        border: 'none', padding: 0,
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s ease',
        flexShrink: 0,
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

function ToggleRow({
  icon: Icon, label, sub, value, onChange,
}: {
  icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
  label: string; sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        background: WHITE,
        border: `1.5px solid ${value ? GREEN : BORDER}`,
        borderRadius: RADIUS_MD,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'border-color 0.2s ease',
        cursor: 'pointer',
        userSelect: 'none',
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

export default function MvpKommunikation({ onDone, onBack }: Props) {
  const [data, setData] = useState<KommunikationData>({
    mobilfunk: false, internet: false,
  });

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader showProgress progressPct={45} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px 120px' }}>
        <div style={{ width: '100%', maxWidth: 820 }}>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h1 style={{
                fontSize: TEXT_LG + 4, fontWeight: FW_SEMIBOLD,
                color: PRIMARY, lineHeight: 1.25, marginBottom: 8,
                letterSpacing: '-0.01em',
              }}>
                Basics: <span style={{ color: ACCENT }}>Kommunikation</span>
              </h1>
              <p style={{ fontSize: TEXT_SM, color: GREY_800, lineHeight: 1.55, fontWeight: FW_REGULAR }}>
                Aktivieren Sie, was bereits optimiert ist — alles andere zeigen wir Ihnen als Spartipp.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUESTIONS.map(q => (
                <ToggleRow
                  key={q.key}
                  icon={q.Icon}
                  label={q.label}
                  sub={q.sub}
                  value={data[q.key]}
                  onChange={v => setData(d => ({ ...d, [q.key]: v }))}
                />
              ))}
            </div>

          </motion.div>
        </div>
      </div>

      <WpBottomNav
        onBack={onBack}
        onNext={() => onDone(data)}
      />
    </div>
  );
}
