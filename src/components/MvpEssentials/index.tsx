import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconX,
  IconReceiptTax,
  IconBolt,
  IconCreditCard,
  IconChartLine,
} from '@tabler/icons-react';

// ── Design Tokens ────────────────────────────────────────────────
const BLUE    = '#5782B0';
const BLUE_LT = '#EDF2F9';
const BLUE_DK = '#3D5A80';
const ORANGE  = '#F9AA00';
const GREEN   = '#0C663B';
const DARK    = '#2C3E50';
const BG      = '#F5F6F8';
const WHITE   = '#FFFFFF';
const BORDER  = '#E2E8F0';
const TEXT    = DARK;
const TEXT_MUTED = '#7A8C9A';
const TEXT_DIM = '#A0AEBB';

export interface EssentialsData {
  steuererklaerung: 'ja' | 'nein' | '';
  energievertraege: 'ja' | 'nein' | '';
  girokonto: 'ja' | 'nein' | '';
  neobroker: 'ja' | 'nein' | '';
}

interface Props {
  onDone: (data: EssentialsData) => void;
  onBack: () => void;
}

const QUESTIONS: { key: keyof EssentialsData; label: string; sub: string; Icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }> }[] = [
  { key: 'steuererklaerung', label: 'Steuererklärung schon erledigt?', sub: 'Durchschnittlich 1.095 € Rückerstattung pro Jahr', Icon: IconReceiptTax },
  { key: 'energievertraege', label: 'Energieverträge optimiert?',       sub: 'Strom & Gas regelmäßig wechseln spart hunderte €', Icon: IconBolt },
  { key: 'girokonto',        label: 'Haben Sie ein kostenloses Girokonto?', sub: 'Bis zu 60 € jährlich an Kontoführungsgebühren sparen', Icon: IconCreditCard },
  { key: 'neobroker',        label: 'Kunde bei einem Neo-Broker?',       sub: 'Trade Republic, Scalable Capital o. ä.',           Icon: IconChartLine },
];

function YesNoRow({
  icon: Icon, label, sub, value, onChange,
}: {
  icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
  label: string; sub: string;
  value: 'ja' | 'nein' | '';
  onChange: (v: 'ja' | 'nein') => void;
}) {
  return (
    <div style={{
      background: WHITE,
      border: `1.5px solid ${BORDER}`,
      borderRadius: 12,
      padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: '#f0f2f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={17} stroke={1.8} color={TEXT_MUTED} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 1 }}>{sub}</div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onChange('ja')}
          style={{
            width: 44, height: 32, borderRadius: 8,
            background: value === 'ja' ? GREEN : WHITE,
            border: `1.5px solid ${value === 'ja' ? GREEN : BORDER}`,
            color: value === 'ja' ? WHITE : TEXT_MUTED,
            fontSize: 12, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
          }}
        >
          <IconCheck size={13} stroke={2.5} /> Ja
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onChange('nein')}
          style={{
            width: 50, height: 32, borderRadius: 8,
            background: value === 'nein' ? '#94a3b8' : WHITE,
            border: `1.5px solid ${value === 'nein' ? '#94a3b8' : BORDER}`,
            color: value === 'nein' ? WHITE : TEXT_MUTED,
            fontSize: 12, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
          }}
        >
          <IconX size={13} stroke={2.5} /> Nein
        </motion.button>
      </div>
    </div>
  );
}

export default function MvpEssentials({ onDone, onBack }: Props) {
  const [data, setData] = useState<EssentialsData>({
    steuererklaerung: '', energievertraege: '', girokonto: '', neobroker: '',
  });

  const allAnswered = QUESTIONS.every(q => data[q.key] !== '');

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
        <div style={{ height: '100%', background: BLUE, width: '20%', transition: 'width 0.3s' }} />
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px 120px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            {/* Page title */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: BLUE, letterSpacing: '0.08em', marginBottom: 6 }}>
                ESSENTIELLE TIPPS
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: TEXT, lineHeight: 1.3, marginBottom: 8 }}>
                Haben Sie die Basics schon erledigt?
              </h1>
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5 }}>
                Diese vier Themen bringen den meisten Haushalten jährlich vierstellige Beträge.
              </p>
            </div>

            {/* Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUESTIONS.map(q => (
                <YesNoRow
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
          onClick={() => allAnswered && onDone(data)}
          disabled={!allAnswered}
          style={{
            background: allAnswered ? BLUE : BORDER,
            border: 'none', borderRadius: 12, padding: '10px 20px',
            fontSize: 14, fontWeight: 600, color: allAnswered ? WHITE : TEXT_DIM,
            cursor: allAnswered ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
            boxShadow: allAnswered ? `0 2px 8px rgba(87,130,176,0.35)` : 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          Weiter <IconArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
