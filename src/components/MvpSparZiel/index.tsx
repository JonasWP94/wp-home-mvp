import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconArrowRight, IconArrowLeft, IconCheck } from '@tabler/icons-react';

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

export interface SparZielData {
  sparziel: string;
  zeitaufwand: string;
}

interface Props {
  onDone: (data: SparZielData) => void;
  onBack: () => void;
}

const SPARZIELE = [
  { value: 'Laufende Kosten senken',  sub: 'Monatliche Ausgaben dauerhaft reduzieren', emoji: '📉' },
  { value: 'Einmalig viel sparen',    sub: 'Den größten Hebel jetzt identifizieren',   emoji: '💥' },
  { value: 'Ökologisch & sparsam',    sub: 'Nachhaltigkeit und Kostenoptimierung',      emoji: '🌿' },
];

const ZEITAUFWAND = [
  { value: 'Mühelos',  sub: 'Sofort umsetzbar',       emoji: '⚡' },
  { value: 'Moderat',  sub: 'Paar Stunden / Monat',   emoji: '⏱' },
  { value: 'Intensiv', sub: 'Maximale Ersparnis',      emoji: '🔧' },
];

export default function MvpSparZiel({ onDone, onBack }: Props) {
  const [sparziel, setSparziel] = useState('');
  const [zeitaufwand, setZeitaufwand] = useState('');
  const canContinue = sparziel !== '' && zeitaufwand !== '';

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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px 120px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            {/* Sparziel section */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: BLUE, letterSpacing: '0.08em', marginBottom: 6 }}>
                IHR SPARZIEL
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: TEXT, lineHeight: 1.3, marginBottom: 8 }}>
                Was ist Ihr Sparziel?
              </h1>
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5 }}>
                So sortieren wir die Tipps nach Ihrer Priorität.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {SPARZIELE.map(opt => {
                const sel = sparziel === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSparziel(opt.value)}
                    style={{
                      width: '100%',
                      background: sel ? BLUE_LT : WHITE,
                      border: sel ? `2px solid ${BLUE}` : `2px solid ${BORDER}`,
                      borderRadius: 14, padding: '14px 18px',
                      display: 'flex', alignItems: 'center', gap: 14,
                      cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' as const,
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: sel ? BLUE : '#f3f4f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, transition: 'all 0.15s',
                    }}>{opt.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: sel ? BLUE_DK : TEXT, marginBottom: 2 }}>{opt.value}</div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED }}>{opt.sub}</div>
                    </div>
                    {sel && (
                      <div style={{
                        width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                        background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IconCheck size={14} stroke={2.5} color={WHITE} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Zeitaufwand section */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: BLUE, letterSpacing: '0.08em', marginBottom: 6 }}>
                ZEITAUFWAND
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 6 }}>
                Wie viel Zeit möchten Sie investieren?
              </h2>
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5 }}>
                Wir passen die Vorschläge an Ihren Aufwand an.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {ZEITAUFWAND.map(opt => {
                const sel = zeitaufwand === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setZeitaufwand(opt.value)}
                    style={{
                      background: sel ? BLUE_LT : WHITE,
                      border: sel ? `2px solid ${BLUE}` : `2px solid ${BORDER}`,
                      borderRadius: 14, padding: '14px 10px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: sel ? BLUE : '#f3f4f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, transition: 'all 0.15s',
                    }}>{opt.emoji}</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: sel ? BLUE_DK : TEXT }}>{opt.value}</span>
                    <span style={{ fontSize: 10, color: TEXT_MUTED, textAlign: 'center' as const, lineHeight: 1.3 }}>{opt.sub}</span>
                  </motion.button>
                );
              })}
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
          onClick={() => canContinue && onDone({ sparziel, zeitaufwand })}
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
