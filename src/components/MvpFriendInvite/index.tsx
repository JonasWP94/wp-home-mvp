import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconArrowLeft, IconArrowRight, IconUsers, IconMail,
  IconBrandWhatsapp, IconCopy, IconCheck, IconCoin,
  IconGift, IconUserPlus, IconUser,
} from '@tabler/icons-react';
import {
  ACCENT, PRIMARY, BG, WHITE, BORDER, GREY_200, GREY_700, GREY_800,
  YELLOW, GREEN, GREEN_DARK, GREEN_BRIGHT, ORANGE,
  TEXT_XS, TEXT_SM, TEXT_MD, TEXT_LG, TEXT_2XL,
  FW_REGULAR, FW_MEDIUM, FW_SEMIBOLD, FW_BOLD,
  SHADOW_SM,
} from '../_tokens';
import WpHeader from '../_WpHeader';

interface Props {
  onBack: () => void;
}

interface InvitedFriend {
  label: string;
  status: 'pending' | 'registered' | 'rewarded';
  date: string;
}

// Demo data — anonymized
const DEMO_FRIENDS: InvitedFriend[] = [
  { label: 'Freund #1', status: 'rewarded',   date: '12. Mai 2026' },
  { label: 'Freund #2', status: 'registered', date: '03. Mai 2026' },
  { label: 'Freund #3', status: 'pending',    date: '28. Apr. 2026' },
];

// Per-side bonus
const BONUS_INVITER = 20;
const BONUS_INVITEE = 20;
const BONUS_TOTAL = BONUS_INVITER + BONUS_INVITEE;

export default function MvpFriendInvite({ onBack }: Props) {
  const inviteLink = 'https://wechselpilot.com/r/jonas-p-9k4f';
  const inviteMessage = `Ich nutze Wechselpilot und spare jedes Jahr beim Strom-, Gas- und Versicherungswechsel. Wenn du dich über meinen Link registrierst, bekommst du ${BONUS_INVITEE} € geschenkt — und ich auch:\n${inviteLink}`;

  const [copied, setCopied] = useState(false);

  function copyLink() {
    try {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function shareEmail() {
    const url = `mailto:?subject=${encodeURIComponent(`${BONUS_INVITEE} € geschenkt bei Wechselpilot`)}&body=${encodeURIComponent(inviteMessage)}`;
    window.location.href = url;
  }

  const earned  = DEMO_FRIENDS.filter(f => f.status === 'rewarded').length * BONUS_INVITER;
  const pending = DEMO_FRIENDS.filter(f => f.status === 'registered').length * BONUS_INVITER;

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader onBack={onBack} hideHomeBadge />

      <div className="wp-friend-page" style={{
        flex: 1, padding: '24px 16px 48px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <style>{`
          @media(min-width:640px){.wp-friend-page{padding:32px 24px 56px !important;}}
          .wp-fi-grid{display:grid;grid-template-columns:1fr;gap:12px;}
          @media(min-width:700px){.wp-fi-grid{grid-template-columns:1fr 1fr;}}
          .wp-fi-share{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;}
          .wp-fi-bonus-split{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:stretch;}
        `}</style>

        <div style={{ width: '100%', maxWidth: 760 }}>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{ textAlign: 'center', marginBottom: 22 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: GREEN_BRIGHT, color: GREEN_DARK,
              borderRadius: 999, padding: '5px 12px',
              fontSize: 11, fontWeight: FW_BOLD,
              letterSpacing: '0.08em', marginBottom: 12,
            }}>
              <IconGift size={13} stroke={2} /> FREUNDE WERBEN FREUNDE
            </div>
            <h1 style={{
              fontSize: TEXT_LG + 6, fontWeight: FW_BOLD,
              color: PRIMARY, lineHeight: 1.2, letterSpacing: '-0.02em',
              marginBottom: 8,
            }}>
              <span style={{ color: GREEN_DARK }}>{BONUS_INVITER} + {BONUS_INVITEE} €</span> für Sie & Ihre/n Freund/in
            </h1>
            <p style={{
              fontSize: TEXT_SM, color: GREY_800, lineHeight: 1.55, fontWeight: FW_REGULAR,
              maxWidth: 480, margin: '0 auto',
            }}>
              Empfehlen Sie Wechselpilot. Für jede/n geworbene/n Freund/in schreiben wir Ihnen <strong style={{ color: PRIMARY }}>{BONUS_INVITER} €</strong> gut — und Ihr/e Freund/in bekommt nochmal <strong style={{ color: PRIMARY }}>{BONUS_INVITEE} €</strong> obendrauf.
            </p>
          </motion.div>

          {/* Bonus split — visual 20+20 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="wp-fi-bonus-split"
            style={{ marginBottom: 12 }}
          >
            <div style={{
              background: WHITE, border: `1px solid ${BORDER}`,
              borderRadius: 6, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 6,
                background: GREEN_BRIGHT, color: GREEN_DARK,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <IconUser size={20} stroke={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: FW_BOLD, color: GREY_800, letterSpacing: '0.1em' }}>SIE BEKOMMEN</div>
                <div style={{ fontSize: 22, fontWeight: FW_BOLD, color: PRIMARY, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                  {BONUS_INVITER} €
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: FW_BOLD, color: GREEN_DARK,
              padding: '0 4px',
            }}>
              +
            </div>

            <div style={{
              background: WHITE, border: `1px solid ${BORDER}`,
              borderRadius: 6, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 6,
                background: GREEN_BRIGHT, color: GREEN_DARK,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <IconGift size={20} stroke={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: FW_BOLD, color: GREY_800, letterSpacing: '0.1em' }}>IHR/E FREUND/IN</div>
                <div style={{ fontSize: 22, fontWeight: FW_BOLD, color: PRIMARY, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                  {BONUS_INVITEE} €
                </div>
              </div>
            </div>
          </motion.div>

          {/* How it works — 3 steps */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            style={{
              background: WHITE, border: `1px solid ${BORDER}`,
              borderRadius: 6, padding: '18px 20px', marginBottom: 12,
            }}
          >
            <h2 style={{
              fontSize: 11, fontWeight: FW_BOLD, color: GREY_800,
              letterSpacing: '0.12em', margin: '0 0 12px',
            }}>
              SO FUNKTIONIERT'S
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { i: 1, t: 'Link teilen', d: 'Per WhatsApp, E-Mail oder einfach kopieren und versenden.' },
                { i: 2, t: 'Freund/in registriert sich', d: 'Über Ihren persönlichen Link bei Wechselpilot anmelden.' },
                { i: 3, t: `${BONUS_INVITER} € für Sie, ${BONUS_INVITEE} € für Ihre/n Freund/in`, d: 'Sobald Ihr/e Freund/in den ersten Vertrag wechselt, schreiben wir beiden die Prämie gut.' },
              ].map(({ i, t, d }) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0,
                    width: 26, height: 26, borderRadius: 13,
                    background: GREEN_DARK, color: WHITE,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: FW_BOLD,
                  }}>
                    {i}
                  </span>
                  <div>
                    <div style={{ fontSize: TEXT_SM, fontWeight: FW_BOLD, color: PRIMARY, marginBottom: 2 }}>{t}</div>
                    <div style={{ fontSize: TEXT_XS + 1, color: GREY_800, lineHeight: 1.5 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Share section */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              background: WHITE, border: `1px solid ${BORDER}`,
              borderRadius: 6, padding: '18px 20px', marginBottom: 12,
            }}
          >
            <h2 style={{
              fontSize: 11, fontWeight: FW_BOLD, color: GREY_800,
              letterSpacing: '0.12em', margin: '0 0 12px',
            }}>
              IHR PERSÖNLICHER EINLADUNGSLINK
            </h2>

            {/* Link box with copy */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#f8faf9', border: `1px solid ${BORDER}`,
              borderRadius: 6, padding: '10px 12px', marginBottom: 12,
            }}>
              <div style={{
                flex: 1, minWidth: 0,
                fontSize: 13, fontFamily: 'monospace',
                color: PRIMARY, fontWeight: FW_MEDIUM,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {inviteLink}
              </div>
              <button
                onClick={copyLink}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: copied ? GREEN_BRIGHT : WHITE,
                  color: copied ? GREEN_DARK : PRIMARY,
                  border: `1px solid ${copied ? GREEN : BORDER}`,
                  borderRadius: 6, padding: '7px 12px',
                  fontSize: 12, fontWeight: FW_BOLD,
                  cursor: 'pointer', fontFamily: 'inherit',
                  whiteSpace: 'nowrap', transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                {copied ? <><IconCheck size={13} stroke={2.5} /> Kopiert</> : <><IconCopy size={13} stroke={2} /> Kopieren</>}
              </button>
            </div>

            {/* Share buttons */}
            <div className="wp-fi-share">
              <button
                onClick={shareWhatsApp}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: '#25D366', color: WHITE, border: 'none',
                  borderRadius: 6, padding: '11px 14px',
                  fontSize: 13, fontWeight: FW_BOLD,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 2px 6px rgba(37,211,102,0.25)',
                }}
              >
                <IconBrandWhatsapp size={16} stroke={2} /> WhatsApp
              </button>
              <button
                onClick={shareEmail}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: WHITE, color: PRIMARY,
                  border: `1.5px solid ${BORDER}`,
                  borderRadius: 6, padding: '11px 14px',
                  fontSize: 13, fontWeight: FW_BOLD,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = PRIMARY; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
              >
                <IconMail size={16} stroke={2} /> E-Mail
              </button>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}
          >
            <button
              onClick={copyLink}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: PRIMARY, color: WHITE, border: 'none',
                borderRadius: 999, padding: '14px 26px',
                fontSize: 14, fontWeight: FW_BOLD,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 14px rgba(36,60,71,0.25)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <IconUsers size={16} stroke={2} /> Jetzt Freunde/innen einladen
            </button>
          </motion.div>

          {/* Fine print */}
          <p style={{
            fontSize: 11, color: GREY_700, lineHeight: 1.5,
            textAlign: 'center', marginTop: 16,
            maxWidth: 480, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Prämie wird beiden Seiten gutgeschrieben, sobald Ihr/e Freund/in den ersten Vertrag erfolgreich gewechselt hat. Auszahlung per Überweisung. Keine Mindestauszahlung.
          </p>
        </div>
      </div>
    </div>
  );
}
