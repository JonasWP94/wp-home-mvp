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
import {
  ACCENT, PRIMARY, BG, WHITE, BORDER, GREY_700, GREY_800,
  YELLOW, YELLOW_BRIGHT,
  GREEN, GREEN_DARK, GREEN_BRIGHT,
  BLUE_VERY_BRIGHT,
  RADIUS_MD, RADIUS_LG, RADIUS_SM,
  TEXT_XS, TEXT_SM, TEXT_MD, TEXT_LG, TEXT_2XL,
  FW_REGULAR, FW_MEDIUM, FW_SEMIBOLD, FW_BOLD,
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

          {/* Checkmark + Headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ textAlign: 'center', marginBottom: 28 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{
                width: 64, height: 64, borderRadius: 32,
                background: GREEN_DARK,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
                boxShadow: `0 4px 16px rgba(23,122,82,0.30)`,
              }}
            >
              <IconCheck size={32} stroke={2.5} color={WHITE} />
            </motion.div>

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
            <p style={{
              fontSize: TEXT_MD, fontWeight: FW_SEMIBOLD,
              color: GREEN_DARK, lineHeight: 1.3, marginTop: 12,
            }}>
              Ihre voraussichtliche Ersparnis dieses Jahr:{' '}
              <span style={{ fontSize: TEXT_LG, fontWeight: FW_BOLD }}>475 €</span>
            </p>
          </motion.div>

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
              hoverColor={ACCENT}
              hoverBg={BLUE_VERY_BRIGHT}
              iconBg={BLUE_VERY_BRIGHT}
              icon={
                <div style={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <IconBolt size={18} stroke={1.6} color={ACCENT} />
                  <IconFlame size={18} stroke={1.6} color={YELLOW} />
                </div>
              }
              title="Weiteren Zähler anlegen"
              sub="Strom, Gas oder Fernwärme"
              chevColor={undefined}
            />

            {/* Card 2 */}
            <ActionCard
              onClick={() => { window.location.href = 'https://konto.wechselpilot.com/freunde-werben'; }}
              hoverColor={YELLOW}
              hoverBg={YELLOW_BRIGHT}
              iconBg={YELLOW_BRIGHT}
              icon={<IconUsers size={22} stroke={1.6} color={YELLOW} />}
              title="Freunde einladen"
              subRich={
                <>
                  <span style={{ fontWeight: FW_BOLD, color: YELLOW, fontSize: TEXT_SM }}>50 €</span> Prämie pro Person
                </>
              }
              chevColor={undefined}
            />

            {/* Card 3 */}
            <ActionCard
              onClick={() => {
                if (onStart) onStart();
                else window.location.href = '/apps/wpilot-home/mvp.html';
              }}
              highlight
              hoverColor={GREEN_DARK}
              hoverBg="#f0faf4"
              iconBg={GREEN_BRIGHT}
              icon={
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <IconGift size={22} stroke={1.6} color={GREEN_DARK} />
                  <div style={{
                    position: 'absolute', top: -4, right: -6,
                    width: 16, height: 16, borderRadius: 8,
                    background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${WHITE}`,
                  }}>
                    <span style={{ fontSize: 8, fontWeight: FW_BOLD, color: WHITE }}>1</span>
                  </div>
                </div>
              }
              title="Noch mehr sparen"
              sub="Willkommensgeschenk abholen"
              chevColor={GREEN_DARK}
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
                background: YELLOW_BRIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IconStar size={18} stroke={1.8} color={YELLOW} />
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

// ── Action Card sub-component ────────────────────────────────────
function ActionCard({
  onClick, icon, title, sub, subRich, chevColor, highlight, hoverColor, hoverBg, iconBg,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  sub?: string;
  subRich?: React.ReactNode;
  chevColor?: string;
  highlight?: boolean;
  hoverColor: string;
  hoverBg: string;
  iconBg: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        width: '100%',
        background: highlight ? `linear-gradient(135deg, ${GREEN_BRIGHT} 0%, #f0faf4 100%)` : WHITE,
        border: highlight ? `2px solid ${GREEN_DARK}33` : `1.5px solid ${BORDER}`,
        borderRadius: RADIUS_MD,
        padding: '12px 14px',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12,
        textAlign: 'left' as const, transition: 'all 0.15s',
        fontFamily: "'Poppins', sans-serif",
      }}
      onMouseEnter={e => {
        const t = e.currentTarget as HTMLElement;
        t.style.borderColor = hoverColor;
        if (!highlight) t.style.background = hoverBg;
      }}
      onMouseLeave={e => {
        const t = e.currentTarget as HTMLElement;
        t.style.borderColor = highlight ? `${GREEN_DARK}33` : BORDER;
        if (!highlight) t.style.background = WHITE;
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: RADIUS_SM, flexShrink: 0,
        background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
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
      <IconChevronRight size={16} stroke={1.8} color={chevColor ?? GREY_700} style={{ flexShrink: 0 }} />
    </motion.button>
  );
}
