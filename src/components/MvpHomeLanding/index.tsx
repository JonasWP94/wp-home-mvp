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
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <img src="/apps/wpilot-home/assets/logo-wp.png" alt="WP" height={30} style={{ objectFit: 'contain' }} />
        <span style={{
          background: ORANGE, borderRadius: 6,
          padding: '2px 7px 3px',
          fontFamily: "'Poppins', sans-serif",
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1,
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: DARK, letterSpacing: '0.06em' }}>HOME</span>
          <span style={{ fontSize: 7, fontWeight: 500, color: DARK, opacity: 0.7, letterSpacing: '0.04em' }}>beta</span>
        </span>
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
        padding: '40px 32px 120px', textAlign: 'center',
      }}>
        <style>{`
          @media(min-width:640px){
            .wp-cta-inline{display:inline-flex !important;}
            .wp-cta-sticky{display:none !important;}
          }
          @media(min-width:640px){
            .wp-headline{font-size:44px !important;}
          }
          @media(min-width:900px){
            .wp-headline{font-size:52px !important;}
          }
        `}</style>

        <div style={{ width: '100%', maxWidth: 720 }}>

          {/* House illustration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{ marginBottom: 20 }}
          >
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ width: 80, height: 80, margin: '0 auto', display: 'block' }}>
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
            className="wp-headline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 32, fontWeight: 800,
              color: DARK, lineHeight: 1.1, letterSpacing: '-0.025em',
              marginBottom: 18, textAlign: 'center',
            }}
          >
            Der <span style={{ color: ORANGE }}>CFO</span> für Ihr Wohnzimmer.
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            style={{
              fontSize: 16, color: TEXT_MUTED,
              lineHeight: 1.6, marginBottom: 28,
              maxWidth: 560, marginLeft: 'auto', marginRight: 'auto',
              textAlign: 'center',
            }}
          >
            Optimieren Sie Ihre Haushaltsausgaben — passend zu Ihrem Verbrauch und Ihren Interessen.
          </motion.p>

          {/* Desktop CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}
          >
            <button
              className="wp-cta-inline"
              onClick={onStart}
              style={{
                display: 'none',
                background: `linear-gradient(135deg, ${ORANGE} 0%, #F59E0B 100%)`,
                border: 'none', borderRadius: 14,
                padding: '14px 36px',
                fontSize: 16, fontWeight: 700, color: '#1a1a2e',
                cursor: 'pointer', letterSpacing: '-0.01em',
                boxShadow: `0 4px 20px rgba(249,170,0,0.35)`,
                alignItems: 'center', gap: 8,
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(249,170,0,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(249,170,0,0.35)'; }}
            >
              Jetzt loslegen <IconArrowRight size={18} stroke={2} />
            </button>
          </motion.div>

          {/* Trust + optional hint combined */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.34 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {['#5782B0', '#24A47D', '#F9AA00'].map((color, i) => (
                  <div key={i} style={{
                    width: 26, height: 26, borderRadius: 13,
                    background: color, border: `2px solid ${BG}`,
                    marginLeft: i > 0 ? -8 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11,
                  }}>👤</div>
                ))}
              </div>
              <span style={{ fontSize: 13, color: TEXT_MUTED }}>
                Bereits <strong style={{ color: DARK }}>400.000+ Haushalte</strong> gespart
              </span>
            </div>
            <p style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5, textAlign: 'center', margin: 0 }}>
              Alle Infos optional. Je mehr Infos Sie teilen, desto besser die Spartipps.
            </p>
          </motion.div>

        </div>
      </div>

      {/* ── Sticky CTA (mobile only) ───────────────────────── */}
      <div className="wp-cta-sticky" style={{
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
