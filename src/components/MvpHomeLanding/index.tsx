import React from 'react';
import { motion } from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';
import {
  ACCENT, PRIMARY, BG, BORDER, GREY_800,
  YELLOW,
  TEXT_MD, TEXT_LG,
  FW_REGULAR, FW_SEMIBOLD, FW_BOLD,
  RADIUS_LG, SHADOW_MD,
} from '../_tokens';
import WpHeader from '../_WpHeader';

interface Props {
  onStart: () => void;
  onBack?: () => void;
}

export default function MvpHomeLanding({ onStart, onBack }: Props) {
  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader onBack={onBack} />

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
            style={{ marginBottom: 24 }}
          >
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ width: 84, height: 84, margin: '0 auto', display: 'block' }}>
              <circle cx="60" cy="60" r="55" fill="rgba(42,111,166,0.08)" />
              <path d="M60 20 L95 50 L95 95 L25 95 L25 50 Z"
                fill="rgba(42,111,166,0.18)" stroke={ACCENT} strokeWidth="2.5" strokeLinejoin="round" />
              <rect x="50" y="60" width="20" height="35" rx="2"
                fill={YELLOW} stroke="#E8920A" strokeWidth="1.5" />
              <rect x="32" y="58" width="14" height="14" rx="2"
                fill="rgba(42,111,166,0.3)" stroke="rgba(42,111,166,0.5)" strokeWidth="1" />
              <rect x="74" y="58" width="14" height="14" rx="2"
                fill="rgba(42,111,166,0.3)" stroke="rgba(42,111,166,0.5)" strokeWidth="1" />
              <path d="M60 12 L60 20 M50 18 L60 20 L70 18"
                stroke={YELLOW} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="wp-headline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 32, fontWeight: FW_BOLD,
              color: PRIMARY, lineHeight: 1.1, letterSpacing: '-0.025em',
              marginBottom: 16, textAlign: 'center',
            }}
          >
            Der <span style={{ color: YELLOW }}>CFO</span> für Ihr Wohnzimmer.
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            style={{
              fontSize: TEXT_MD, color: GREY_800,
              lineHeight: 1.55, marginBottom: 32, fontWeight: FW_REGULAR,
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
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}
          >
            <button
              className="wp-cta-inline"
              onClick={onStart}
              style={{
                display: 'none',
                background: YELLOW,
                border: 'none', borderRadius: RADIUS_LG,
                padding: '14px 36px',
                fontSize: TEXT_LG - 4, fontWeight: FW_SEMIBOLD, color: PRIMARY,
                cursor: 'pointer', letterSpacing: '-0.01em',
                boxShadow: SHADOW_MD,
                alignItems: 'center', gap: 8,
                transition: 'transform 0.1s, box-shadow 0.1s',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              Jetzt loslegen <IconArrowRight size={18} stroke={2} />
            </button>
          </motion.div>

          {/* Trust + optional hint */}
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
                {[ACCENT, '#24A47D', YELLOW].map((color, i) => (
                  <div key={i} style={{
                    width: 26, height: 26, borderRadius: 13,
                    background: color, border: `2px solid ${BG}`,
                    marginLeft: i > 0 ? -8 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11,
                  }}>👤</div>
                ))}
              </div>
              <span style={{ fontSize: 13, color: GREY_800, fontWeight: FW_REGULAR }}>
                Bereits <strong style={{ color: PRIMARY, fontWeight: FW_SEMIBOLD }}>400.000+ Haushalte</strong> gespart
              </span>
            </div>
            <p style={{ fontSize: 12, color: GREY_800, lineHeight: 1.5, textAlign: 'center', margin: 0 }}>
              Alle Infos optional. Je mehr Infos Sie teilen, desto besser die Spartipps.
            </p>
          </motion.div>

        </div>
      </div>

      {/* Sticky CTA (mobile only) */}
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
            background: YELLOW,
            border: 'none', borderRadius: RADIUS_LG,
            padding: '15px 20px',
            fontSize: TEXT_LG - 4, fontWeight: FW_SEMIBOLD, color: PRIMARY,
            cursor: 'pointer', letterSpacing: '-0.01em',
            boxShadow: SHADOW_MD,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Jetzt loslegen <IconArrowRight size={18} stroke={2} />
        </motion.button>
      </div>
    </div>
  );
}
