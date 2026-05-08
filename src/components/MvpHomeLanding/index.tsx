import React from 'react';
import { motion } from 'framer-motion';
import {
  IconArrowRight,
  IconArrowLeft,
  IconBolt,
  IconFlame,
  IconCar,
  IconShieldCheck,
  IconChartBar,
  IconSparkles,
  IconCheck,
} from '@tabler/icons-react';

// ── Design Tokens ────────────────────────────────────────────────
const BLUE    = '#5782B0';
const BLUE_LT = '#EDF2F9';
const BLUE_DK = '#3D5A80';
const GREEN   = '#0C663B';
const GREEN_LT = '#E8F5EF';
const ORANGE  = '#F9AA00';
const ORANGE_LT = '#FEF3C7';
const DARK    = '#2C3E50';
const BG      = '#F5F6F8';
const WHITE   = '#FFFFFF';
const BORDER  = '#E2E8F0';
const TEXT    = DARK;
const TEXT_MUTED = '#7A8C9A';

interface Props {
  onStart: () => void;
  onBack?: () => void;
}

const FEATURES = [
  {
    icon: IconBolt,
    color: BLUE,
    bg: BLUE_LT,
    title: 'Energie & Heizung',
    desc: 'Strom, Gas, Wärmepumpe — wir finden den günstigsten Tarif und die besten Spar-Maßnahmen.',
  },
  {
    icon: IconCar,
    color: '#7C3AED',
    bg: '#F5F3FF',
    title: 'Mobilität',
    desc: 'Ob Verbrenner, E-Auto oder Kein Auto — wir zeigen, wo Sie bei Kraftstoff und Versicherung sparen.',
  },
  {
    icon: IconShieldCheck,
    color: ORANGE,
    bg: ORANGE_LT,
    title: 'Versicherungen',
    desc: 'Doppelversicherungen aufdecken, Lücken schließen und bessere Tarife finden.',
  },
  {
    icon: IconChartBar,
    color: GREEN,
    bg: GREEN_LT,
    title: 'Finanzen & Steuern',
    desc: 'Steuererklärung, Tagesgeld, Sparpläne — Ihr Geld arbeitet härter.',
  },
];

const STATS = [
  { value: 'Ø 1.200 €', label: 'Ersparnis pro Jahr' },
  { value: '5 Min.', label: 'Profil erstellen' },
  { value: '100 %', label: 'Kostenlos' },
];

export default function MvpHomeLanding({ onStart, onBack }: Props) {
  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(245,246,248,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <img src="/apps/wpilot-home/assets/logo-wp.png" alt="WP" height={22} style={{ objectFit: 'contain' }} />
        <span style={{
          fontSize: 11, fontWeight: 800, color: DARK,
          background: ORANGE, borderRadius: 6,
          padding: '3px 7px', letterSpacing: '0.06em',
          fontFamily: "'Poppins', sans-serif",
        }}>HOME</span>
        <div style={{ flex: 1 }} />
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: TEXT_MUTED, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0',
            }}
          >
            <IconArrowLeft size={14} stroke={1.5} /> Zurück
          </button>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px 120px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{ textAlign: 'center', marginBottom: 28 }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.05 }}
              style={{
                width: 60, height: 60, borderRadius: 18,
                background: `linear-gradient(135deg, ${ORANGE} 0%, #f97316 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: `0 6px 20px rgba(249,170,0,0.35)`,
              }}
            >
              <IconSparkles size={30} stroke={1.5} color={WHITE} />
            </motion.div>

            <div style={{ fontSize: 11, fontWeight: 600, color: ORANGE, letterSpacing: '0.08em', marginBottom: 6 }}>
              IHR PERSÖNLICHER SPAR-ASSISTENT
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: TEXT, lineHeight: 1.25, marginBottom: 10 }}>
              Bis zu 1.200 € im Jahr<br />mehr in Ihrer Tasche
            </h1>
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6 }}>
              Wechselpilot HOME analysiert Ihren Haushalt und zeigt Ihnen genau, wo Sie sparen können — persönlich und automatisch.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
              marginBottom: 24,
            }}
          >
            {STATS.map((s, i) => (
              <div key={i} style={{
                background: WHITE, border: `1px solid ${BORDER}`,
                borderRadius: 12, padding: '12px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{s.value}</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, letterSpacing: '0.08em', marginBottom: 12 }}
          >
            WAS SIE ERWARTET
          </motion.div>

          {/* Feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + i * 0.07 }}
                  style={{
                    background: WHITE, border: `1px solid ${BORDER}`,
                    borderRadius: 14, padding: '14px 16px',
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={20} stroke={1.5} color={f.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                  <IconCheck size={16} stroke={2} color={GREEN} style={{ flexShrink: 0, marginTop: 3 }} />
                </motion.div>
              );
            })}
          </div>

          {/* Trust note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontSize: 12, color: TEXT_MUTED, textAlign: 'center', lineHeight: 1.5 }}
          >
            Keine Registrierung nötig · Dauert unter 2 Minuten · Kostenlos
          </motion.p>

        </div>
      </div>

      {/* ── Sticky CTA ────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${BORDER}`,
        padding: '14px 20px',
      }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          style={{
            width: '100%',
            background: `linear-gradient(135deg, ${ORANGE} 0%, #f97316 100%)`,
            border: 'none', borderRadius: 14,
            padding: '15px 20px',
            fontSize: 15, fontWeight: 700, color: DARK,
            cursor: 'pointer',
            boxShadow: `0 4px 16px rgba(249,170,0,0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          Profil erstellen — 2 Minuten <IconArrowRight size={18} stroke={2} />
        </motion.button>
      </div>

    </div>
  );
}
