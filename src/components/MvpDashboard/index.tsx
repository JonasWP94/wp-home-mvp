import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconHome,
  IconBuilding,
  IconFlame,
  IconCar,
  IconUsers,
  IconUser,
  IconCheck,
  IconRefresh,
  IconTemperature,
  IconBolt,
  IconReceipt,
  IconChartBar,
  IconSun,
  IconLeaf,
  IconBatteryCharging,
  IconCoin,
  IconShield,
  IconArrowRight,
  IconCircle,
  IconPig,
  IconPlug,
  IconX,
} from '@tabler/icons-react';

// ── Types ────────────────────────────────────────────────────────
interface MvpProfile {
  tenure: 'miete' | 'eigentum' | '';
  propertyType: 'wohnung' | 'haus' | '';
  heatingType: 'gas' | 'oel' | 'strom' | 'waermepumpe' | '';
  autoType: 'verbrenner' | 'eauto' | 'hybrid' | 'keins' | '';
  hasChildren: boolean | null;
}

interface MvpTip {
  id: string;
  title: string;
  description?: string;
  partner: string;
  partnerLinks?: { name: string; url: string; logo: string }[];
  priority: 3 | 2 | 1;
  category: string;
  icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
  savingsHg2: number;   // 2 Personen (ohne Kinder)
  savingsHg3: number;   // 3+ Personen (mit Kindern)
  condition: (p: MvpProfile) => boolean;
}

// ── Hardcoded Tips with real savings from tips.json ──────────────
const ALL_TIPS: MvpTip[] = [
  {
    id: 'strom-gas-wechsel',
    title: 'Strom/Gas wechseln',
    partner: 'Octopus, Tibber, Lichtblick',
    priority: 3,
    category: 'Energie',
    icon: IconBolt,
    savingsHg2: 836,
    savingsHg3: 836,
    condition: () => true,
  },
  {
    id: 'steuererklaerung',
    title: 'Steuererklärung einreichen',
    description: 'Mit einer Steuer-App geht es ganz einfach — auch ohne Steuerwissen. Antworten auf Fragen geben, fertig. Durchschnittliche Rückerstattung: über 1.000 €.',
    partner: 'Taxfix, WISO, Zasta',
    partnerLinks: [
      { name: 'Taxfix', url: 'https://taxfix.de', logo: '/apps/wpilot-home/assets/partners/taxfix.png' },
      { name: 'WISO', url: 'https://www.wiso-steuer.de', logo: '/apps/wpilot-home/assets/partners/wiso.png' },
      { name: 'Zasta', url: 'https://www.zasta.de', logo: '/apps/wpilot-home/assets/partners/zasta.png' },
    ],
    priority: 3,
    category: 'Steuern',
    icon: IconReceipt,
    savingsHg2: 1095,
    savingsHg3: 1095,
    condition: () => true,
  },
  {
    id: 'kfz-versicherung',
    title: 'KFZ-Versicherung wechseln',
    partner: 'Clark, Tarifcheck, HUK24',
    priority: 3,
    category: 'Versicherung',
    icon: IconCar,
    savingsHg2: 800,
    savingsHg3: 800,
    condition: (p) => p.autoType !== 'keins',
  },
  {
    id: 'thg-praemie',
    title: 'THG-Prämie',
    partner: 'Geld für eAuto/Hybrid',
    priority: 1,
    category: 'Mobilität',
    icon: IconBatteryCharging,
    savingsHg2: 630,
    savingsHg3: 630,
    condition: (p) => p.autoType === 'eauto' || p.autoType === 'hybrid',
    id: 'thermostate',
    title: 'Smarte Thermostate',
    partner: 'tado°, Homematic IP',
    priority: 3,
    category: 'Heizung',
    icon: IconTemperature,
    savingsHg2: 180,
    savingsHg3: 220,
    condition: () => true,
  },
  {
    id: 'solaranlage',
    title: 'Solaranlage',
    partner: 'Enpal, Zolar',
    priority: 2,
    category: 'Solar',
    icon: IconSun,
    savingsHg2: 300,
    savingsHg3: 300,
    condition: (p) => p.tenure === 'eigentum' && p.propertyType === 'haus',
  },
  {
    id: 'waermepumpe',
    title: 'Wärmepumpe',
    partner: 'Thermondo, 1KOMMA5°',
    priority: 2,
    category: 'Heizung',
    icon: IconLeaf,
    savingsHg2: 700,
    savingsHg3: 700,
    condition: (p) => p.tenure === 'eigentum' && p.propertyType === 'haus' && p.heatingType !== 'waermepumpe',
  },
  {
    id: 'balkonkraftwerk',
    title: 'Balkonkraftwerk',
    partner: 'Yuma, Priwatt',
    priority: 2,
    category: 'Solar',
    icon: IconSun,
    savingsHg2: 180,
    savingsHg3: 200,
    condition: (p) => !(p.tenure === 'eigentum' && p.propertyType === 'haus'),
  },
  {
    id: 'dynamischer-stromtarif',
    title: 'Dynamischer Stromtarif',
    partner: 'Tibber, Octopus',
    priority: 2,
    category: 'Energie',
    icon: IconBolt,
    savingsHg2: 836,
    savingsHg3: 836,
    condition: (p) => p.autoType === 'eauto' || p.autoType === 'hybrid' || p.heatingType === 'waermepumpe',
  },
  {
    id: 'hausrat-haftpflicht',
    title: 'Hausrat-/Haftpflicht',
    partner: 'Clark',
    priority: 2,
    category: 'Versicherung',
    icon: IconShield,
    savingsHg2: 160,
    savingsHg3: 160,
    condition: () => true,
  },
  {
    id: 'thg-praemie',
    title: 'THG-Prämie',
    partner: 'Geld für eAuto',
    priority: 1,
    category: 'Mobilität',
    icon: IconBatteryCharging,
    savingsHg2: 630,
    savingsHg3: 630,
    condition: (p) => p.autoType === 'eauto',
  },
  {
    id: 'wallbox',
    title: 'Wallbox / Laden zuhause',
    partner: 'Enpal, charge.cloud',
    priority: 1,
    category: 'Mobilität',
    icon: IconBatteryCharging,
    savingsHg2: 280,
    savingsHg3: 280,
    condition: (p) => p.autoType === 'hybrid',
  },
  {
    id: 'kostenloses-girokonto',
    title: 'Kostenloses Girokonto',
    partner: 'ING, DKB',
    priority: 1,
    category: 'Finanzen',
    icon: IconPig,
    savingsHg2: 120,
    savingsHg3: 120,
    condition: () => true,
  },
];

// ── Design Tokens (matching full WizardNew + Dashboard) ──────────
const BLUE    = '#5782B0';
const BLUE_LT = '#EDF2F9';
const BLUE_DK = '#3D5A80';
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

const PRIORITY_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  3: { bg: GREEN_LT, text: GREEN, label: 'Top' },
  2: { bg: ORANGE_LT, text: '#92400e', label: 'Empfohlen' },
  1: { bg: '#f3f4f6', text: TEXT_MUTED, label: 'Tipp' },
};

function fmt(n: number) { return n.toLocaleString('de-DE'); }

// ── Animated Counter ─────────────────────────────────────────────
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);
  return <>{fmt(display)}{suffix}</>;
}

// ── Profile pill icons ───────────────────────────────────────────
function ProfileIcon({ type, value }: { type: string; value: string }) {
  const props = { size: 16, stroke: 1.5, color: BLUE_DK };
  switch (type) {
    case 'tenure': return <IconHome {...props} />;
    case 'property': return value === 'haus' ? <IconHome {...props} /> : <IconBuilding {...props} />;
    case 'heating': return <IconFlame {...props} />;
    case 'auto': return value === 'eauto' ? <IconBatteryCharging {...props} /> : value === 'hybrid' ? <IconPlug {...props} /> : value === 'verbrenner' ? <IconCar {...props} /> : <IconBike {...props} />;
    case 'children': return value === 'mit' ? <IconUsers {...props} /> : <IconUser {...props} />;
    default: return <IconCircle {...props} />;
  }
}

import { IconBike } from '@tabler/icons-react';

// ── Main Component ───────────────────────────────────────────────
export default function MvpDashboard() {
  const [profile, setProfile] = useState<MvpProfile | null>(null);
  const [done, setDone] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wpilot_mvp_done') || '[]')); } catch { return new Set(); }
  });
  const [removed, setRemoved] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wpilot_mvp_removed') || '[]')); } catch { return new Set(); }
  });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showRemoved, setShowRemoved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('wpilot_mvp_profile');
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('wpilot_mvp_done', JSON.stringify([...done]));
  }, [done]);

  useEffect(() => {
    localStorage.setItem('wpilot_mvp_removed', JSON.stringify([...removed]));
  }, [removed]);

  const tips = useMemo(() => {
    if (!profile) return [];
    return ALL_TIPS
      .filter(t => t.condition(profile))
      .filter(t => !removed.has(t.id))
      .sort((a, b) => b.priority - a.priority || b.savingsHg2 - a.savingsHg2);
  }, [profile, removed]);

  const removedTips = useMemo(() => {
    if (!profile) return [];
    return ALL_TIPS
      .filter(t => t.condition(profile))
      .filter(t => removed.has(t.id))
      .sort((a, b) => b.priority - a.priority || b.savingsHg2 - a.savingsHg2);
  }, [profile, removed]);

  // Use hg3 if children, hg2 otherwise
  const hg = profile?.hasChildren ? 3 : 2;
  const getSavings = (tip: MvpTip) => hg === 3 ? tip.savingsHg3 : tip.savingsHg2;

  const total = useMemo(() => tips.reduce((s, t) => s + getSavings(t), 0), [tips, hg]);
  const doneCount = useMemo(() => tips.filter(t => done.has(t.id)).length, [tips, done]);
  const doneTotal = useMemo(() => tips.filter(t => done.has(t.id)).reduce((s, t) => s + getSavings(t), 0), [tips, done, hg]);

  if (!profile) {
    return (
      <div style={{ minHeight: '100dvh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: TEXT_MUTED, marginBottom: 16 }}>Kein Profil gefunden</p>
          <button onClick={() => window.location.href = '/apps/wpilot-home/mvp.html'} style={{
            background: BLUE, color: WHITE, border: 'none', borderRadius: 12,
            padding: '12px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto',
            boxShadow: `0 2px 8px rgba(87,130,176,0.35)`,
          }}>
            Wizard starten <IconArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  function toggleDone(id: string) {
    setDone(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function removeTip(id: string) {
    setRemoved(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setDone(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function restoreTip(id: string) {
    setRemoved(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  const profilePills = [
    { type: 'tenure', label: profile.tenure === 'eigentum' ? 'Eigentum' : 'Miete', value: profile.tenure },
    { type: 'property', label: profile.propertyType === 'haus' ? 'Haus' : 'Wohnung', value: profile.propertyType },
    { type: 'heating', label: ({ gas: 'Gas', oel: 'Öl', strom: 'Strom', waermepumpe: 'Wärmepumpe' } as any)[profile.heatingType] || '', value: profile.heatingType },
    { type: 'auto', label: ({ verbrenner: 'Verbrenner', eauto: 'E-Auto', hybrid: 'Hybrid', keins: 'Kein Auto' } as any)[profile.autoType], value: profile.autoType },
    { type: 'children', label: profile.hasChildren ? 'Mit Kindern' : 'Ohne Kinder', value: profile.hasChildren ? 'mit' : 'ohne' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: BG }}>
      {/* ── Header ─────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(245,246,248,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <img src="/apps/wpilot-home/assets/logo-wp.png" alt="WP" height={22} style={{ objectFit: 'contain', flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: "'Poppins', sans-serif", letterSpacing: '0.05em' }}>HOME</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => { localStorage.removeItem('wpilot_mvp_profile'); window.location.href = '/apps/wpilot-home/mvp.html'; }} style={{
          background: 'none', border: `1px solid ${BORDER}`, borderRadius: 8,
          padding: '6px 12px', fontSize: 12, fontWeight: 500, color: TEXT_MUTED, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <IconRefresh size={14} /> Neu starten
        </button>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 40px' }}>
        {/* ── Hero ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)',
            borderRadius: 18, padding: '24px 20px', color: '#fff',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(36,164,125,0.25)',
            marginBottom: 14,
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 8, letterSpacing: '0.05em' }}>
              Ihr Sparpotenzial pro Jahr
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}>
                <AnimatedCounter value={total} />
              </span>
              <span style={{ fontSize: 20, fontWeight: 700, opacity: 0.8 }}>€</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16 }}>
              {tips.length} Empfehlungen basierend auf Ihren Antworten
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px', flex: '1 1 0', minWidth: 80 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  <AnimatedCounter value={doneTotal} suffix=" €" />
                </div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>Erledigt</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px', flex: '1 1 0', minWidth: 80 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{doneCount}/{tips.length}</div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>Tipps erledigt</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Profile summary ───────────────────────────── */}
        <div style={{
          background: WHITE, borderRadius: 14, padding: '14px 16px',
          marginBottom: 20, border: `1px solid ${BORDER}`,
          display: 'flex', gap: 8, flexWrap: 'wrap',
        }}>
          {profilePills.map(p => (
            <span key={p.type} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: BLUE_LT, borderRadius: 8, padding: '5px 10px',
              fontSize: 12, fontWeight: 500, color: BLUE_DK,
            }}>
              <ProfileIcon type={p.type} value={p.value} />
              {p.label}
            </span>
          ))}
        </div>

        {/* ── Tip list ──────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tips.map((tip, i) => {
            const isDone = done.has(tip.id);
            const isExpanded = expanded === tip.id;
            const pri = PRIORITY_COLORS[tip.priority];
            const TipIcon = tip.icon;
            const savings = getSavings(tip);

            return (
              <div className="mvp-tip-row" style={{ position: 'relative' }}>
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="mvp-tip-card"
                style={{
                  background: WHITE,
                  borderRadius: 14,
                  border: isDone ? `2px solid ${GREEN}` : `1px solid ${BORDER}`,
                  overflow: 'hidden',
                  opacity: isDone ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {/* Main row */}
                <div
                  onClick={() => setExpanded(isExpanded ? null : tip.id)}
                  style={{
                    padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: BLUE_LT,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <TipIcon size={22} stroke={1.5} color={BLUE} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 15, fontWeight: 700, color: TEXT, lineHeight: 1.3,
                      textDecoration: isDone ? 'line-through' : 'none',
                      marginBottom: 2,
                    }}>
                      {tip.title}
                    </div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                      {fmt(savings)} € / Jahr
                    </div>
                  </div>

                  {/* Priority badge */}
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6,
                    background: pri.bg, color: pri.text,
                    flexShrink: 0, whiteSpace: 'nowrap',
                  }}>
                    {pri.label}
                  </span>

                  {/* Check — right side */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleDone(tip.id); }}
                    style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      border: isDone ? 'none' : `2px solid ${BORDER}`,
                      background: isDone ? GREEN : 'transparent',
                      color: isDone ? '#fff' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <IconCheck size={16} stroke={2} />
                  </button>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '0 16px 16px',
                        borderTop: `1px solid ${BORDER}`,
                        marginTop: 0, paddingTop: 14,
                      }}>
                        {tip.description && (
                          <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 14 }}>{tip.description}</p>
                        )}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, background: GREEN_LT, borderRadius: 8, padding: '6px 12px', color: GREEN, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                            💰 {fmt(savings)} € / Jahr
                          </span>
                        </div>
                        {tip.partnerLinks && tip.partnerLinks.length > 0 && (
                          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                            {tip.partnerLinks.map(pl => (
                              <a key={pl.name} href={pl.url} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10,
                                padding: '6px 12px', textDecoration: 'none',
                                transition: 'all 0.15s',
                              }}>
                                <img src={pl.logo} alt={pl.name} height={20} style={{ objectFit: 'contain' }} />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {/* Delete X — outside card, right of container */}
              <button
                className="mvp-tip-delete"
                onClick={() => removeTip(tip.id)}
                style={{
                  position: 'absolute', top: '50%', right: -34, transform: 'translateY(-50%)',
                  width: 28, height: 28, borderRadius: 8,
                  border: 'none', background: 'transparent',
                  color: TEXT_MUTED, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.15s',
                }}
              >
                <IconX size={16} stroke={1.5} />
              </button>
              </div>
            );
          })}
        </div>

        {/* ── Gelöschte Empfehlungen ──────────────────── */}
        {removedTips.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <button
              onClick={() => setShowRemoved(!showRemoved)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none', cursor: 'pointer',
                color: TEXT_MUTED, fontSize: 13, fontWeight: 600,
                padding: '8px 0', width: '100%',
              }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 20, height: 20, borderRadius: 6, background: ORANGE_LT,
                fontSize: 11, fontWeight: 700, color: '#92400e',
              }}>{removedTips.length}</span>
              Gelöschte Empfehlungen
              <span style={{
                display: 'inline-block',
                transform: showRemoved ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                fontSize: 14,
              }}>▾</span>
            </button>

            {showRemoved && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
                  {removedTips.map(tip => {
                    const TipIcon = tip.icon;
                    const savings = getSavings(tip);
                    const pri = PRIORITY_COLORS[tip.priority];
                    return (
                      <div key={tip.id} style={{
                        background: WHITE, borderRadius: 12,
                        border: `1px dashed ${BORDER}`, padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: 10,
                        opacity: 0.7,
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10, background: BLUE_LT,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <TipIcon size={18} stroke={1.5} color={BLUE} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{tip.title}</div>
                          <div style={{ fontSize: 11, color: TEXT_MUTED }}>{fmt(savings)} € / Jahr</div>
                        </div>
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '3px 6px', borderRadius: 5,
                          background: pri.bg, color: pri.text, flexShrink: 0,
                        }}>{pri.label}</span>
                        <button
                          onClick={() => restoreTip(tip.id)}
                          style={{
                            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8,
                            border: `1px solid ${GREEN}`, background: GREEN_LT,
                            color: GREEN, cursor: 'pointer', whiteSpace: 'nowrap',
                          }}
                        >
                          ↩ Zurück
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ── Footer ────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 12, color: TEXT_MUTED }}>
            {tips.length} Empfehlungen · {fmt(total)} € Potenzial · <a href="/apps/wpilot-home/mvp.html" style={{ color: BLUE, textDecoration: 'none', fontWeight: 500 }}>Profil ändern</a>
          </p>
        </div>
      </div>
    </div>
  );
}
