import React from 'react';
import { motion } from 'framer-motion';
import {
  PRIMARY, BG, BORDER, GREY_800,
  YELLOW,
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
    }}>
      <WpHeader onBack={onBack} />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px 140px', textAlign: 'center',
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
        `}</style>

        <div style={{ width: '100%', maxWidth: 720 }}>

          {/* Headline */}
          <motion.h1
            className="wp-headline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            style={{
              fontSize: 34, fontWeight: FW_BOLD,
              color: PRIMARY, lineHeight: 1.1, letterSpacing: '-0.025em',
              marginBottom: 18, textAlign: 'center',
            }}
          >
            Der <span style={{ color: YELLOW }}>CFO</span> für Ihr Wohnzimmer.
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
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
            transition={{ delay: 0.25, duration: 0.4 }}
            style={{ display: 'none', justifyContent: 'center', marginBottom: 36 }}
          >
            <WpButton onClick={onStart} size="lg">
              Ersparnis berechnen
            </WpButton>
          </motion.div>

          {/* Trust + optional hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}
          >
            <span style={{ fontSize: 13, color: GREY_800, fontWeight: FW_REGULAR }}>
              Bereits <strong style={{ color: PRIMARY, fontWeight: FW_SEMIBOLD }}>400.000+ Haushalte</strong> gespart
            </span>
            <p style={{ fontSize: 12, color: GREY_800, lineHeight: 1.5, textAlign: 'center', margin: 0, maxWidth: 420 }}>
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
        display: 'flex', justifyContent: 'center',
      }}>
        <WpButton onClick={onStart} size="lg" fullWidth>
          Ersparnis berechnen
        </WpButton>
      </div>
    </div>
  );
}
