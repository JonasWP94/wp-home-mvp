import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconCheck,
  IconBolt,
  IconFlame,
  IconGift,
  IconUsers,
  IconChevronRight,
  IconArrowRight,
  IconStar,
  IconStarFilled,
  IconHome,
} from '@tabler/icons-react';

// ── Design Tokens ────────────────────────────────────────────────
const BLUE    = '#5782B0';
const BLUE_LT = '#EDF2F9';
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
const TEXT_DIM = '#A0AEBB';

interface Props {
  onStart?: () => void;
}

export default function MvpThankYou({ onStart }: Props = {}) {
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(245,246,248,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src="/apps/wpilot-home/assets/logo-wp.png" alt="WP" height={20} style={{ objectFit: 'contain' }} />
          <span style={{
            fontSize: 11, fontWeight: 800, color: DARK,
            background: ORANGE, borderRadius: 6,
            padding: '3px 7px', letterSpacing: '0.06em',
            fontFamily: "'Poppins', sans-serif",
          }}>HOME</span>
        </div>

        <button
          onClick={() => { window.location.href = '/apps/wpilot-home/mvp-dashboard.html'; }}
          style={{
            background: WHITE, border: `1.5px solid ${BORDER}`,
            borderRadius: 8, padding: '6px 14px',
            fontSize: 12, fontWeight: 600, color: TEXT,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = BLUE; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
        >
          <IconHome size={14} stroke={1.5} /> Zur Übersicht
        </button>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 20px 24px' }}>
        <div style={{ width: '100%', maxWidth: 780 }}>

          {/* Checkmark + Headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ textAlign: 'center', marginBottom: 18 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{
                width: 56, height: 56, borderRadius: 28,
                background: `linear-gradient(135deg, ${GREEN} 0%, #0d8045 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
                boxShadow: `0 4px 16px rgba(12,102,59,0.25)`,
              }}
            >
              <IconCheck size={28} stroke={2.5} color={WHITE} />
            </motion.div>

            <h1 style={{ fontSize: 22, fontWeight: 800, color: TEXT, lineHeight: 1.2, marginBottom: 4 }}>
              Glückwunsch!
            </h1>
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.4, marginBottom: 2 }}>
              Sie haben Wechselpilot erfolgreich beauftragt.
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: GREEN, lineHeight: 1.3 }}>
              Sie sparen dieses Jahr bereits <span style={{ fontSize: 18 }}>XXX €</span>
            </p>
          </motion.div>

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', marginBottom: 12 }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: BLUE, letterSpacing: '0.06em' }}>
              WOMIT WÜRDEN SIE GERN WEITERMACHEN?
            </p>
          </motion.div>

          {/* ── Action Cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginBottom: 16,
            }}
          >

            {/* Card 1 – weiterer Zähler */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { window.location.href = 'https://konto.wechselpilot.com/neuer-zähler'; }}
              style={{
                width: '100%', background: WHITE,
                border: `2px solid ${BORDER}`, borderRadius: 14,
                padding: '16px 14px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                textAlign: 'center' as const, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = BLUE; (e.currentTarget as HTMLElement).style.background = BLUE_LT; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = WHITE; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: BLUE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <IconBolt size={18} stroke={1.5} color={BLUE} />
                  <IconFlame size={18} stroke={1.5} color={ORANGE} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ textAlign: 'left' as const }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>
                    weiteren Zähler anlegen
                  </div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>
                    Strom, Gas oder Fernwärme
                  </div>
                </div>
                <IconChevronRight size={16} stroke={1.5} color={TEXT_DIM} style={{ flexShrink: 0, marginTop: 2 }} />
              </div>
            </motion.button>

            {/* Card 2 – Freunde einladen */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { window.location.href = 'https://konto.wechselpilot.com/freunde-werben'; }}
              style={{
                width: '100%', background: WHITE,
                border: `2px solid ${BORDER}`, borderRadius: 14,
                padding: '16px 14px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                textAlign: 'center' as const, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ORANGE; (e.currentTarget as HTMLElement).style.background = ORANGE_LT; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = WHITE; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: ORANGE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconUsers size={22} stroke={1.5} color={ORANGE} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ textAlign: 'left' as const }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>
                    Freunde einladen
                  </div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>
                    <span style={{ fontWeight: 700, color: ORANGE, fontSize: 13 }}>50 €</span> Prämie pro Person
                  </div>
                </div>
                <IconChevronRight size={16} stroke={1.5} color={TEXT_DIM} style={{ flexShrink: 0, marginTop: 2 }} />
              </div>
            </motion.button>

            {/* Card 3 – noch mehr sparen → startet Wizard */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (onStart) {
                  onStart();
                } else {
                  window.location.href = '/apps/wpilot-home/mvp.html';
                }
              }}
              style={{
                width: '100%',
                background: `linear-gradient(135deg, ${GREEN_LT} 0%, #f0faf4 100%)`,
                border: `2px solid ${GREEN}33`,
                borderRadius: 14,
                padding: '16px 14px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                textAlign: 'center' as const, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GREEN; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${GREEN}33`; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: GREEN_LT, display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <IconGift size={22} stroke={1.5} color={GREEN} />
                <div style={{
                  position: 'absolute', top: -3, right: -3,
                  width: 16, height: 16, borderRadius: 8,
                  background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${WHITE}`,
                }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: WHITE }}>1</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ textAlign: 'left' as const }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>
                    noch mehr sparen
                  </div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>
                    Willkommensgeschenk abholen
                  </div>
                </div>
                <IconChevronRight size={16} stroke={1.5} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
              </div>
            </motion.button>
          </motion.div>

          {/* ── Rating Section ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{
              background: WHITE,
              border: `1px solid ${BORDER}`, borderRadius: 14,
              padding: '14px 18px', textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: ORANGE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IconStar size={18} stroke={1.5} color={ORANGE} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, lineHeight: 1.2 }}>
                  Wie fanden Sie den Wechselprozess?
                </p>
                <p style={{ fontSize: 11, color: TEXT_MUTED }}>
                  Bewerten Sie Wechselpilot!
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {[1, 2, 3, 4, 5].map(n => {
                const filled = n <= (hoverStar || rating);
                return (
                  <motion.button
                    key={n}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverStar(n)}
                    onMouseLeave={() => setHoverStar(0)}
                    style={{
                      background: 'none', border: 'none',
                      cursor: 'pointer', padding: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {filled ? (
                      <IconStarFilled size={24} color={ORANGE} />
                    ) : (
                      <IconStar size={24} stroke={1.5} color={BORDER} />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {rating > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: ORANGE, border: 'none', borderRadius: 10,
                  padding: '7px 16px', fontSize: 12, fontWeight: 600,
                  color: WHITE, cursor: 'pointer',
                  boxShadow: `0 2px 8px rgba(249,170,0,0.3)`,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  transition: 'all 0.15s',
                }}
              >
                Absenden <IconArrowRight size={14} />
              </motion.button>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
