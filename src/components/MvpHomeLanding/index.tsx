import React from 'react';
import { motion } from 'framer-motion';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';

// ── Design Tokens ────────────────────────────────────────────────
const BLUE     = '#5782B0';
const BLUE_LT  = 'rgba(87,130,176,0.08)';
const ORANGE   = '#F9AA00';
const DARK     = '#2C3E50';
const BG       = '#F5F6F8';
const WHITE    = '#FFFFFF';
const BORDER   = '#E2E8F0';
const TEXT_MUTED = '#7A8C9A';

interface Props {
  onStart: () => void;
  onBack?: () => void;
}

export default function MvpHomeLanding({ onStart, onBack }: Props) {
  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{
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
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px 120px', textAlign: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* House illustration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{ marginBottom: 28 }}
          >
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ width: 96, height: 96, margin: '0 auto', display: 'block' }}>
              <circle cx="60" cy="60" r="55" fill={BLUE_LT} />
              <path d="M60 20 L95 50 L95 95 L25 95 L25 50 Z"
                fill="rgba(87,130,176,0.18)" stroke={BLUE} strokeWidth="2.5" strokeLinejoin="round" />
              <rect x="50" y="60" width="20" height="35" rx="2"
                fill={ORANGE} stroke="#E8920A" strokeWidth="1.5" />
              <rect x="32" y="58" width="14" height="14" rx="2"
                fill="rgba(87,130,176,0.3)" stroke="rgba(87,130,176,0.5)" strokeWidth="1" />
              <rect x="74" y="58" width="14" height="14" rx="2"
                fill="rgba(87,130,176,0.3)" stroke="rgba(87,130,176,0.5)" strokeWidth="1" />
              <path d="M60 12 L60 20 M50 18 L60 20 L70 18"
                stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(26px, 7vw, 36px)', fontWeight: 800,
              color: DARK, lineHeight: 1.2, letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            Der <span style={{ color: ORANGE }}>CFO</span> für<br />Ihr Wohnzimmer.
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)', color: TEXT_MUTED,
              lineHeight: 1.65, marginBottom: 40,
            }}
          >
            Hier können Sie Ihre Haushaltsausgaben gemäß Ihres Verbrauchs und Ihren Interessen optimieren.
            Jede Frage hat einen konkreten Nutzen für Ihren persönlichen Sparplan.
          </motion.p>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {['#5782B0', '#24A47D', '#F9AA00'].map((color, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: color, border: `2px solid ${BG}`,
                  marginLeft: i > 0 ? -8 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12,
                }}>👤</div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: TEXT_MUTED }}>
              Bereits <strong style={{ color: DARK }}>400.000+ Haushalte</strong> gespart
            </span>
          </motion.div>

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
            background: `linear-gradient(135deg, ${ORANGE} 0%, #F59E0B 100%)`,
            border: 'none', borderRadius: 14,
            padding: '15px 20px',
            fontSize: 16, fontWeight: 700, color: '#1a1a2e',
            cursor: 'pointer', letterSpacing: '-0.01em',
            boxShadow: `0 4px 20px rgba(249,170,0,0.35)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          Jetzt loslegen <IconArrowRight size={18} stroke={2} />
        </motion.button>
      </div>

    </div>
  );
}
