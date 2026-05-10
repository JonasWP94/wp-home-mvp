import React from 'react';
import { motion } from 'framer-motion';
import {
  PRIMARY, BG, BORDER, GREY_800,
  YELLOW, ACCENT, WHITE,
  TEXT_MD,
  FW_REGULAR, FW_SEMIBOLD, FW_BOLD,
} from '../_tokens';
import WpHeader from '../_WpHeader';
import WpButton from '../_WpButton';

interface Props {
  onStart: () => void;
  onBack?: () => void;
}

export default function MvpHomeLanding({ onStart, onBack }: Props) {
  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 800px 500px at 50% 25%, rgba(42,111,166,0.06) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(42,111,166,0.2), transparent)',
        pointerEvents: 'none',
      }} />

      <WpHeader onBack={onBack} />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px 140px', textAlign: 'center',
        position: 'relative',
      }}>
        <style>{`
          @media(min-width:640px){
            .wp-cta-inline{display:inline-flex !important;}
            .wp-cta-sticky{display:none !important;}
          }
          @media(min-width:640px){
            .wp-headline{font-size:48px !important;}
          }
          @media(min-width:900px){
            .wp-headline{font-size:56px !important;}
          }
          @keyframes wp-shine {
            0%   { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .wp-cfo {
            background: linear-gradient(90deg, #f9aa00 0%, #ffd166 50%, #f9aa00 100%);
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            animation: wp-shine 4s ease-in-out infinite;
          }
        `}</style>

        <div style={{ width: '100%', maxWidth: 720 }}>

          {/* Eyebrow: Wechselpilot präsentiert + Beta */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginBottom: 22,
              padding: '6px 6px 6px 14px',
              borderRadius: 999,
              background: WHITE,
              border: `1px solid ${BORDER}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: 3,
              background: ACCENT, display: 'inline-block',
              boxShadow: `0 0 0 3px rgba(42,111,166,0.18)`,
            }} />
            <span style={{
              fontSize: 11, fontWeight: FW_SEMIBOLD,
              color: PRIMARY, letterSpacing: '0.04em',
            }}>
              Wechselpilot präsentiert
            </span>
            <span style={{
              fontSize: 9, fontWeight: FW_BOLD,
              color: WHITE,
              background: YELLOW,
              padding: '3px 7px',
              borderRadius: 999,
              letterSpacing: '0.08em',
            }}>
              BETA
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="wp-headline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
              fontSize: 34, fontWeight: FW_BOLD,
              color: PRIMARY, lineHeight: 1.1, letterSpacing: '-0.025em',
              marginBottom: 18, textAlign: 'center',
            }}
          >
            Der{' '}
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 220, damping: 14 }}
              className="wp-cfo"
              style={{ display: 'inline-block' }}
            >
              CFO
            </motion.span>{' '}
            für Ihr Wohnzimmer.
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            style={{
              fontSize: TEXT_MD, color: GREY_800,
              lineHeight: 1.55, marginBottom: 36, fontWeight: FW_REGULAR,
              maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
              textAlign: 'center',
            }}
          >
            Optimieren Sie Ihre Haushaltsausgaben — passend zu Ihrem Verbrauch und Ihren Interessen.
          </motion.p>

          {/* Desktop CTA */}
          <motion.div
            className="wp-cta-inline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            style={{ display: 'none', justifyContent: 'center', marginBottom: 36 }}
          >
            <WpButton onClick={onStart} size="lg">
              Ersparnis berechnen
            </WpButton>
          </motion.div>

          {/* Optional hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.4 }}
            style={{
              fontSize: 12, color: GREY_800, lineHeight: 1.5,
              textAlign: 'center', margin: 0,
              maxWidth: 420, marginLeft: 'auto', marginRight: 'auto',
            }}
          >
            Alle Infos optional. Je mehr Infos Sie teilen, desto besser die Spartipps.
          </motion.p>

        </div>
      </div>

      {/* Sticky CTA (mobile only) */}
      <div className="wp-cta-sticky" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${BORDER}`,
        padding: '14px 20px',
        display: 'flex', justifyContent: 'center',
      }}>
        <WpButton onClick={onStart} size="lg" fullWidth>
          Ersparnis berechnen
        </WpButton>
      </div>
    </div>
  );
}
