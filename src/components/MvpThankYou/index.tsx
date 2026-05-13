import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconCheck,
  IconBolt,
  IconFlame,
  IconSparkles,
  IconUsers,
  IconChevronRight,
  IconStar,
  IconStarFilled,
  IconHome,
} from '@tabler/icons-react';
import {
  ACCENT, PRIMARY, BG, WHITE, BORDER, GREY_200, GREY_700, GREY_800,
  YELLOW,
  GREEN_DARK,
  RADIUS_MD, RADIUS_LG, RADIUS_SM,
  TEXT_XS, TEXT_SM, TEXT_MD, TEXT_LG, TEXT_2XL,
  FW_REGULAR, FW_SEMIBOLD, FW_BOLD,
  SHADOW_SM,
} from '../_tokens';
import WpHeader from '../_WpHeader';

interface Props {
  onStart?: () => void;
}

export default function MvpThankYou({ onStart }: Props = {}) {
  const [rating, setRating] = useState<number>(() => {
    const v = typeof window !== 'undefined' ? localStorage.getItem('wpilot_thx_rating') : null;
    return v ? Number(v) : 0;
  });
  const [hoverStar, setHoverStar] = useState(0);

  function saveRating(n: number) {
    setRating(n);
    try { localStorage.setItem('wpilot_thx_rating', String(n)); } catch {}
  }

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader
        hideHomeBadge
        rightSlot={
          <button
            onClick={() => { window.location.href = 'https://konto.wechselpilot.com/übersicht'; }}
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

      <div className="wp-page-thx" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}>
        <style>{`
          @media(min-width:640px){
            .wp-page-thx{padding:32px 24px !important;}
          }
        `}</style>
        <div style={{ width: '100%', maxWidth: 820 }}>

          {/* Glückwunsch + Headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            style={{ textAlign: 'center', marginBottom: 28 }}
          >
            <div style={{
              fontSize: TEXT_2XL - 4, fontWeight: FW_BOLD,
              color: PRIMARY, lineHeight: 1.15, marginBottom: 8,
              letterSpacing: '-0.02em',
            }}>
              Glückwunsch!
            </div>
            <h1 style={{
              fontSize: TEXT_LG + 2, fontWeight: FW_SEMIBOLD,
              color: PRIMARY, lineHeight: 1.3, marginBottom: 10,
              letterSpacing: '-0.01em',
              maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
            }}>
              Sie haben Wechselpilot erfolgreich beauftragt.
            </h1>
            <p style={{
              fontSize: TEXT_MD - 1, color: GREY_800, lineHeight: 1.55,
              fontWeight: FW_REGULAR,
              maxWidth: 480, marginLeft: 'auto', marginRight: 'auto',
            }}>
              Ab jetzt übernehmen wir. Sie brauchen nichts weiter zu tun.
            </p>
          </motion.div>

          {/* Savings pill — same width as cards grid */}
          <div style={{ marginBottom: 14 }}>
            <SavingsPill amount="475 €" />
          </div>

          {/* Action Cards — staggered entry */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              marginBottom: 14,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActionCard
                onClick={() => { window.location.href = 'https://konto.wechselpilot.com/neuer-zähler'; }}
                icon={
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <IconBolt size={26} stroke={2} color={ACCENT} />
                    <IconFlame size={24} stroke={2} color="#e85d4a" />
                  </div>
                }
                title="Weiteren Zähler anlegen"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.55, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActionCard
                onClick={() => { window.location.href = 'https://konto.wechselpilot.com/freunde-werben'; }}
                icon={<IconUsers size={26} stroke={2} color={YELLOW} />}
                title="Freunde einladen"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActionCard
                onClick={() => {
                  if (onStart) onStart();
                  else window.location.href = '/apps/wpilot-home/mvp.html';
                }}
                icon={<IconSparkles size={26} stroke={2} color={GREEN_DARK} />}
                title="Noch mehr sparen"
                badge
              />
            </motion.div>
          </div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
                    onClick={() => saveRating(n)}
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

          </motion.div>

        </div>
      </div>
    </div>
  );
}

// ── Savings Pill ─────────────────────────────────────────────────
function SavingsPill({ amount }: { amount: string }) {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <motion.div
        initial={{ width: 64, borderRadius: 32 }}
        animate={{ width: '100%', borderRadius: 14 }}
        transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 64,
          background: GREEN_DARK, color: WHITE,
          display: 'flex', alignItems: 'center',
          overflow: 'hidden', whiteSpace: 'nowrap',
          boxShadow: '0 4px 18px rgba(23,122,82,0.22)',
          justifyContent: 'center',
        }}
      >
        {/* Check disc — centered initially, then sits on left as pill expands */}
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.5 }}
          style={{
            width: 44, height: 44, borderRadius: 22, flexShrink: 0,
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <IconCheck size={24} stroke={2.8} color={WHITE} />
        </motion.div>

        {/* Text block — width:0 initially so check disc stays centered in 64px circle */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'auto', opacity: 1 }}
          transition={{
            width:   { delay: 1.65, duration: 0.4 },
            opacity: { delay: 1.7,  duration: 0.3 },
          }}
          style={{
            flex: 'none',
            display: 'flex', alignItems: 'center',
            overflow: 'hidden', whiteSpace: 'nowrap',
          }}
        >
          <style>{`
            .wp-pill-label-long { display: inline; }
            .wp-pill-label-short { display: none; }
            @media(max-width:519px){
              .wp-pill-label-long { display: none; }
              .wp-pill-label-short { display: inline; }
            }
          `}</style>
          <span style={{
            paddingLeft: 14, paddingRight: 14,
            fontSize: 14, fontWeight: FW_REGULAR,
            letterSpacing: '-0.01em', fontFamily: "'Poppins', sans-serif",
          }}>
            <span className="wp-pill-label-long">Ihre voraussichtliche Ersparnis dieses Jahr</span>
            <span className="wp-pill-label-short">Ersparnis dieses Jahr</span>
          </span>
          <span style={{
            fontSize: 19, fontWeight: FW_BOLD,
            letterSpacing: '-0.01em', paddingRight: 22,
            fontFamily: "'Poppins', sans-serif",
          }}>
            {amount}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Action Card (Screenshot-Style) ───────────────────────────────
function ActionCard({
  onClick, icon, title, badge,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  badge?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        width: '100%',
        background: WHITE,
        border: `1px solid ${BORDER}`,
        borderRadius: RADIUS_LG,
        padding: '18px 18px',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 32, minHeight: 110,
        textAlign: 'left' as const, transition: 'border-color 0.15s, transform 0.15s',
        fontFamily: "'Poppins', sans-serif",
        position: 'relative',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GREY_700; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
    >
      {/* Icon top-left, naked (no container) */}
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        {icon}
        {badge && (
          <div style={{
            position: 'absolute', top: -6, right: -8,
            width: 16, height: 16, borderRadius: 8,
            background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${WHITE}`,
          }}>
            <span style={{ fontSize: 9, fontWeight: FW_BOLD, color: WHITE, lineHeight: 1 }}>1</span>
          </div>
        )}
      </div>

      {/* Title + chevron bottom-left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: TEXT_SM + 1, fontWeight: FW_SEMIBOLD, color: PRIMARY, lineHeight: 1.25 }}>
          {title}
        </span>
        <IconChevronRight size={16} stroke={2} color={PRIMARY} style={{ flexShrink: 0 }} />
      </div>
    </motion.button>
  );
}
