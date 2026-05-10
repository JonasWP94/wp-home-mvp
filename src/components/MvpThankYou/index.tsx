import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconCheck,
  IconBolt,
  IconGift,
  IconUsers,
  IconChevronRight,
  IconArrowRight,
  IconStar,
  IconStarFilled,
  IconHome,
} from '@tabler/icons-react';
import {
  ACCENT, PRIMARY, BG, WHITE, BORDER, GREY_200, GREY_700, GREY_800,
  YELLOW,
  GREEN_DARK,
  RADIUS_MD, RADIUS_LG, RADIUS_SM,
  TEXT_XS, TEXT_SM, TEXT_MD, TEXT_2XL,
  FW_REGULAR, FW_SEMIBOLD, FW_BOLD,
  SHADOW_SM,
} from '../_tokens';
import WpHeader from '../_WpHeader';

interface Props {
  onStart?: () => void;
}

export default function MvpThankYou({ onStart }: Props = {}) {
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader
        rightSlot={
          <button
            onClick={() => { window.location.href = '/apps/wpilot-home/mvp-dashboard.html'; }}
            style={{
              background: WHITE, border: `1.5px solid ${BORDER}`,
              borderRadius: RADIUS_SM, padding: '6px 12px',
              fontSize: TEXT_XS, fontWeight: FW_SEMIBOLD, color: PRIMARY,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              transition: 'all 0.15s', fontFamily: "'Poppins', sans-serif",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
          >
            <IconHome size={14} stroke={1.8} /> Zur Übersicht
          </button>
        }
      />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 820 }}>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{ textAlign: 'center', marginBottom: 24 }}
          >
            <h1 style={{
              fontSize: TEXT_2XL - 4, fontWeight: FW_BOLD,
              color: PRIMARY, lineHeight: 1.2, marginBottom: 10,
              letterSpacing: '-0.02em',
              maxWidth: 560, marginLeft: 'auto', marginRight: 'auto',
            }}>
              Glückwunsch — Sie haben Wechselpilot erfolgreich beauftragt.
            </h1>
            <p style={{
              fontSize: TEXT_MD - 1, color: GREY_800, lineHeight: 1.55,
              fontWeight: FW_REGULAR,
              maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
            }}>
              Ab jetzt übernehmen wir. Sie brauchen nichts weiter zu tun.
            </p>
          </motion.div>

          {/* Animated savings pill: check first, then text expands to the right */}
          <SavingsPill amount="475 €" />


          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', marginBottom: 14 }}
          >
            <p style={{
              fontSize: 11, fontWeight: FW_BOLD, color: ACCENT,
              letterSpacing: '0.1em',
            }}>
              WOMIT WÜRDEN SIE GERN WEITERMACHEN?
            </p>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginBottom: 20,
            }}
          >
            {/* Card 1 */}
            <ActionCard
              onClick={() => { window.location.href = 'https://konto.wechselpilot.com/neuer-zähler'; }}
              icon={<IconBolt size={20} stroke={1.8} color={GREY_800} />}
              title="Weiteren Zähler anlegen"
              sub="Strom, Gas oder Fernwärme"
            />

            {/* Card 2 */}
            <ActionCard
              onClick={() => { window.location.href = 'https://konto.wechselpilot.com/freunde-werben'; }}
              icon={<IconUsers size={20} stroke={1.8} color={GREY_800} />}
              title="Freunde einladen"
              subRich={
                <>
                  <span style={{ fontWeight: FW_SEMIBOLD, color: PRIMARY }}>50 €</span> Prämie pro Person
                </>
              }
            />

            {/* Card 3 */}
            <ActionCard
              onClick={() => {
                if (onStart) onStart();
                else window.location.href = '/apps/wpilot-home/mvp.html';
              }}
              icon={
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <IconGift size={20} stroke={1.8} color={GREY_800} />
                  <div style={{
                    position: 'absolute', top: -5, right: -6,
                    width: 14, height: 14, borderRadius: 7,
                    background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${WHITE}`,
                  }}>
                    <span style={{ fontSize: 8, fontWeight: FW_BOLD, color: WHITE, lineHeight: 1 }}>1</span>
                  </div>
                </div>
              }
              title="Noch mehr sparen"
              sub="Willkommensgeschenk abholen"
            />
          </motion.div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{
              background: WHITE,
              border: `1px solid ${BORDER}`, borderRadius: RADIUS_LG,
              padding: '16px 20px', textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
              flexWrap: 'wrap',
              boxShadow: SHADOW_SM,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: RADIUS_SM,
                background: GREY_200, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IconStar size={18} stroke={1.8} color={GREY_800} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: TEXT_SM, fontWeight: FW_SEMIBOLD, color: PRIMARY, lineHeight: 1.25 }}>
                  Wie fanden Sie den Wechselprozess?
                </p>
                <p style={{ fontSize: TEXT_XS, color: GREY_800, fontWeight: FW_REGULAR, marginTop: 1 }}>
                  Bewerten Sie Wechselpilot!
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
                    {filled
                      ? <IconStarFilled size={26} color={YELLOW} />
                      : <IconStar size={26} stroke={1.6} color={BORDER} />}
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
                  background: YELLOW, border: 'none', borderRadius: RADIUS_MD,
                  padding: '8px 18px', fontSize: TEXT_XS + 1, fontWeight: FW_SEMIBOLD,
                  color: PRIMARY, cursor: 'pointer',
                  boxShadow: `0 2px 8px rgba(249,170,0,0.30)`,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  transition: 'all 0.15s',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Absenden <IconArrowRight size={14} stroke={2} />
              </motion.button>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

// ── Savings Pill ─────────────────────────────────────────────────
function SavingsPill({ amount }: { amount: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', marginBottom: 32,
      perspective: 800,
    }}>
      <motion.div
        initial={{ width: 56, opacity: 0 }}
        animate={{ width: 'auto', opacity: 1 }}
        transition={{
          width: { delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.3 },
        }}
        style={{
          height: 56, borderRadius: 999,
          background: GREEN_DARK,
          color: WHITE,
          display: 'inline-flex', alignItems: 'center',
          paddingLeft: 6, paddingRight: 0,
          overflow: 'hidden', whiteSpace: 'nowrap',
          boxShadow: '0 6px 20px rgba(23,122,82,0.22)',
        }}
      >
        {/* Check disc */}
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
          style={{
            width: 44, height: 44, borderRadius: 22,
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IconCheck size={24} stroke={2.8} color={WHITE} />
        </motion.div>

        {/* Text — fades in after pill expands */}
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.05, duration: 0.35 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            paddingLeft: 14, paddingRight: 22,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: FW_REGULAR, opacity: 0.92, letterSpacing: '-0.01em' }}>
            Ihre voraussichtliche Ersparnis dieses Jahr
          </span>
          <span style={{ fontSize: 18, fontWeight: FW_BOLD, letterSpacing: '-0.01em' }}>
            {amount}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Action Card sub-component ────────────────────────────────────
function ActionCard({
  onClick, icon, title, sub, subRich,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  sub?: string;
  subRich?: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        width: '100%',
        background: WHITE,
        border: `1.5px solid ${BORDER}`,
        borderRadius: RADIUS_MD,
        padding: '12px 14px',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12,
        textAlign: 'left' as const, transition: 'border-color 0.15s',
        fontFamily: "'Poppins', sans-serif",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GREY_700; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: RADIUS_SM, flexShrink: 0,
        background: GREY_200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: TEXT_SM, fontWeight: FW_SEMIBOLD, color: PRIMARY, lineHeight: 1.25 }}>
          {title}
        </div>
        <div style={{ fontSize: TEXT_XS, color: GREY_800, fontWeight: FW_REGULAR, marginTop: 2, lineHeight: 1.35 }}>
          {subRich ?? sub}
        </div>
      </div>
      <IconChevronRight size={16} stroke={1.8} color={GREY_700} style={{ flexShrink: 0 }} />
    </motion.button>
  );
}
