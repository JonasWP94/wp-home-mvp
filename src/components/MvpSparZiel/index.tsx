import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconArrowRight,
  IconArrowLeft,
  IconTrendingDown,
  IconBolt,
  IconLeaf,
  IconZap,
  IconClock,
  IconTool,
  IconMinus,
  IconCpu,
  IconBuildingCommunity,
  IconCheck,
} from '@tabler/icons-react';

// ── Design Tokens ────────────────────────────────────────────────
const BLUE    = '#5782B0';
const BLUE_LT = '#EDF2F9';
const BLUE_DK = '#3D5A80';
const ORANGE  = '#F9AA00';
const DARK    = '#2C3E50';
const BG      = '#F5F6F8';
const WHITE   = '#FFFFFF';
const BORDER  = '#E2E8F0';
const TEXT    = DARK;
const TEXT_MUTED = '#7A8C9A';
const TEXT_DIM = '#A0AEBB';

export interface SparZielData {
  sparziel: string;
  zeitaufwand: string;
  investitionen: string;
}

interface Props {
  onDone: (data: SparZielData) => void;
  onBack: () => void;
}

const SPARZIELE = [
  { value: 'Laufende Kosten senken', sub: 'Monatliche Ausgaben dauerhaft reduzieren', Icon: IconTrendingDown },
  { value: 'Einmalig viel sparen',   sub: 'Den größten Hebel jetzt identifizieren',   Icon: IconBolt },
  { value: 'Ökologisch & sparsam',   sub: 'Nachhaltigkeit und Kostenoptimierung',      Icon: IconLeaf },
];

const ZEITAUFWAND = [
  { value: 'Mühelos',  sub: 'Sofort umsetzbar',       Icon: IconZap },
  { value: 'Moderat',  sub: 'Paar Stunden / Monat',   Icon: IconClock },
  { value: 'Intensiv', sub: 'Maximale Ersparnis',      Icon: IconTool },
];

const INVESTITIONEN = [
  { value: 'Keine',           sub: 'Nur kostenfreie Maßnahmen',    Icon: IconMinus },
  { value: 'Kleine Gadgets',  sub: 'Bis ca. 100 €',                Icon: IconCpu },
  { value: 'Große Projekte',  sub: 'Sanierung & Umbau möglich',    Icon: IconBuildingCommunity },
];

// ── Compact settings-row chip ────────────────────────────────────
function SettingsRow({
  icon: Icon, label, sub, selected, onClick,
}: {
  icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
  label: string; sub: string; selected: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        width: '100%',
        background: selected ? BLUE_LT : WHITE,
        border: `1.5px solid ${selected ? BLUE : BORDER}`,
        borderRadius: 12,
        padding: '11px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' as const,
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: selected ? BLUE : '#f0f2f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        <Icon size={17} stroke={1.8} color={selected ? WHITE : TEXT_MUTED} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: selected ? BLUE_DK : TEXT, lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 1 }}>{sub}</div>
      </div>
      {selected && (
        <div style={{
          width: 20, height: 20, borderRadius: 10, flexShrink: 0,
          background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconCheck size={11} stroke={3} color={WHITE} />
        </div>
      )}
    </motion.button>
  );
}

// ── Section header ───────────────────────────────────────────────
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: BLUE, letterSpacing: '0.09em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: TEXT }}>{title}</div>
    </div>
  );
}

export default function MvpSparZiel({ onDone, onBack }: Props) {
  const [sparziel, setSparziel]         = useState('');
  const [zeitaufwand, setZeitaufwand]   = useState('');
  const [investitionen, setInvestitionen] = useState('');
  const canContinue = sparziel !== '' && zeitaufwand !== '' && investitionen !== '';

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(245,246,248,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <img src="/apps/wpilot-home/assets/logo-wp.png" alt="WP" height={30} style={{ objectFit: 'contain' }} />
        <span style={{
          background: ORANGE, borderRadius: 6, padding: '2px 7px 3px',
          fontFamily: "'Poppins', sans-serif",
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1,
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: DARK, letterSpacing: '0.06em' }}>HOME</span>
          <span style={{ fontSize: 7, fontWeight: 500, color: DARK, opacity: 0.7, letterSpacing: '0.04em' }}>beta</span>
        </span>
        <div style={{ flex: 1 }} />
      </div>

      {/* ── Progress bar ──────────────────────────────────── */}
      <div style={{ height: 3, background: BORDER }}>
        <div style={{ height: '100%', background: BLUE, width: '10%', transition: 'width 0.3s' }} />
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px 120px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            {/* Page title */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: BLUE, letterSpacing: '0.08em', marginBottom: 6 }}>
                SCHRITT 1 VON 1
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: TEXT, lineHeight: 1.3, marginBottom: 8 }}>
                Ihre Präferenzen
              </h1>
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5 }}>
                Damit wir die Tipps optimal auf Sie zuschneiden können.
              </p>
            </div>

            {/* ── Sparziel ──────────────────────────────────── */}
            <div style={{ marginBottom: 24 }}>
              <SectionHeader label="SPARZIEL" title="Was ist Ihr Sparziel?" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SPARZIELE.map(opt => (
                  <SettingsRow
                    key={opt.value}
                    icon={opt.Icon}
                    label={opt.value}
                    sub={opt.sub}
                    selected={sparziel === opt.value}
                    onClick={() => setSparziel(opt.value)}
                  />
                ))}
              </div>
            </div>

            {/* ── Zeitaufwand ───────────────────────────────── */}
            <div style={{ marginBottom: 24 }}>
              <SectionHeader label="ZEITAUFWAND" title="Wie viel Zeit möchten Sie investieren?" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ZEITAUFWAND.map(opt => (
                  <SettingsRow
                    key={opt.value}
                    icon={opt.Icon}
                    label={opt.value}
                    sub={opt.sub}
                    selected={zeitaufwand === opt.value}
                    onClick={() => setZeitaufwand(opt.value)}
                  />
                ))}
              </div>
            </div>

            {/* ── Investitionen ─────────────────────────────── */}
            <div style={{ marginBottom: 8 }}>
              <SectionHeader label="INVESTITIONSBEREITSCHAFT" title="Was sind Sie bereit zu investieren?" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {INVESTITIONEN.map(opt => (
                  <SettingsRow
                    key={opt.value}
                    icon={opt.Icon}
                    label={opt.value}
                    sub={opt.sub}
                    selected={investitionen === opt.value}
                    onClick={() => setInvestitionen(opt.value)}
                  />
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* ── Bottom nav ────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${BORDER}`,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: `1.5px solid ${BORDER}`,
            borderRadius: 12, padding: '10px 16px',
            fontSize: 14, fontWeight: 600, color: TEXT,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <IconArrowLeft size={16} /> Zurück
        </button>
        <button
          onClick={() => canContinue && onDone({ sparziel, zeitaufwand, investitionen })}
          disabled={!canContinue}
          style={{
            background: canContinue ? BLUE : BORDER,
            border: 'none', borderRadius: 12, padding: '10px 20px',
            fontSize: 14, fontWeight: 600, color: canContinue ? WHITE : TEXT_DIM,
            cursor: canContinue ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
            boxShadow: canContinue ? `0 2px 8px rgba(87,130,176,0.35)` : 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          Weiter <IconArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
