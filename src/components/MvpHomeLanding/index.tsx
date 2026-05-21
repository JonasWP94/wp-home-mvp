import React from 'react';
import { motion } from 'framer-motion';
import { IconArrowLeft } from '@tabler/icons-react';
import {
  PRIMARY, BG, BORDER, GREY_800,
  YELLOW, ACCENT, WHITE,
  TEXT_MD,
  FW_REGULAR, FW_SEMIBOLD, FW_BOLD,
} from '../_tokens';
import logoWp from '../../assets/logo-wp.png';
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
      <WpHeader hideHomeBadge />

      <div className="wp-landing" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 20px 40px', textAlign: 'center',
      }}>
        <style>{`@media(min-width:640px){.wp-landing{padding:40px 24px 56px !important;}}`}</style>
        <style>{`
          @media(min-width:640px){
            .wp-headline{font-size:40px !important;}
          }
          @media(min-width:900px){
            .wp-headline{font-size:46px !important;}
          }
        `}</style>

        <div style={{ width: '100%', maxWidth: 720 }}>

          {/* Wechselpilot HOME Logo */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.35 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginBottom: 22,
            }}
          >
            <img
              src={logoWp}
              alt="Wechselpilot"
              style={{ height: 36, objectFit: 'contain' }}
            />
            <span style={{
              background: YELLOW, borderRadius: 999,
              padding: '6px 14px',
              fontFamily: "'Poppins', sans-serif",
              display: 'inline-flex', alignItems: 'center', lineHeight: 1,
            }}>
              <span style={{ fontSize: 15, fontWeight: FW_BOLD, color: PRIMARY, letterSpacing: '0.06em' }}>HOME</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="wp-headline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            style={{
              fontSize: 30, fontWeight: FW_BOLD,
              color: PRIMARY, lineHeight: 1.15, letterSpacing: '-0.02em',
              marginBottom: 14, textAlign: 'center',
            }}
          >
            Ihr <span style={{ color: YELLOW }}>Spar-Lotse</span> für's Wohnzimmer.
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            style={{
              fontSize: TEXT_MD, color: GREY_800,
              lineHeight: 1.55, marginBottom: 32, fontWeight: FW_REGULAR,
              maxWidth: 500, marginLeft: 'auto', marginRight: 'auto',
              textAlign: 'center',
            }}
          >
            Optimieren Sie Ihre Haushaltsausgaben — passend zu Ihrem Verbrauch und Ihren Interessen.
          </motion.p>

          {/* CTA — always inline, no sticky */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}
          >
            <WpButton onClick={onStart} size="lg">
              Ersparnis berechnen
            </WpButton>
          </motion.div>

          {/* Back link below CTA */}
          {onBack && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.35 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}
            >
              <button
                onClick={onBack}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: GREY_800, fontSize: 13, fontWeight: FW_SEMIBOLD,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '8px 12px', fontFamily: "'Poppins', sans-serif",
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = PRIMARY; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = GREY_800; }}
              >
                <IconArrowLeft size={14} stroke={2} /> Zurück
              </button>
            </motion.div>
          )}

          {/* Optional hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.35 }}
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

    </div>
  );
}
