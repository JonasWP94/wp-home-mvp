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
  IconTemperature,
  IconBolt,
  IconReceipt,
  IconSun,
  IconLeaf,
  IconBatteryCharging,
  IconShield,
  IconArrowRight,
  IconArrowLeft,
  IconCircle,
  IconPig,
  IconPlug,
  IconX,
  IconBike,
  IconKey,
  IconDroplet,
  IconChevronDown,
  IconPencil,
  IconTrendingDown,
  IconRocket,
  IconClock,
  IconTool,
  IconMinus,
  IconCpu,
  IconBuildingCommunity,
  IconCreditCard,
  IconDeviceMobile,
  IconWifi,
  IconTarget,
  IconHourglass,
  IconCoins,
} from '@tabler/icons-react';
import logoWp from '../../assets/logo-wp.png';

// ── Types ────────────────────────────────────────────────────────
interface MvpProfile {
  tenure: 'miete' | 'eigentum' | '';
  propertyType: 'wohnung' | 'haus' | '';
  heatingType: 'gas' | 'oel' | 'strom' | 'waermepumpe' | '';
  autoType: 'verbrenner' | 'eauto' | 'hybrid' | 'keins' | 'has-vehicles' | '';
  vehicles?: { verbrenner: number; eauto: number; hybrid: number };
  hasChildren: boolean | null;
  // Spar-Präferenzen
  sparziel?: string;
  zeitaufwand?: string;
  investitionen?: string;
  // Basics
  steuererklaerung?: boolean;
  girokonto?: boolean;
  mobilfunk?: boolean;
  internet?: boolean;
}

interface MvpTip {
  id: string;
  title: string;
  description?: string;
  partner: string;
  partnerLinks?: { name: string; url: string; logo: string }[];
  actionLabel?: string;
  actionUrl?: string;
  priority: 3 | 2 | 1;
  category: string;
  icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
  savingsHg2: number;
  savingsHg3: number;
  condition: (p: MvpProfile) => boolean;
}

// ── Profile Field Definitions ────────────────────────────────────
const PROFILE_FIELDS = [
  {
    key: 'propertyType' as const,
    label: 'Wohnungstyp',
    icon: IconBuilding,
    options: [
      { value: 'wohnung', label: 'Wohnung',    icon: IconBuilding },
      { value: 'haus',    label: 'Haus / EFH', icon: IconHome },
    ],
  },
  {
    key: 'tenure' as const,
    label: 'Eigentumsstatus',
    icon: IconKey,
    options: [
      { value: 'miete',    label: 'Zur Miete',   icon: IconKey },
      { value: 'eigentum', label: 'Im Eigentum', icon: IconHome },
    ],
  },
  {
    key: 'heatingType' as const,
    label: 'Heizungsart',
    icon: IconFlame,
    options: [
      { value: 'gas',         label: 'Gas',        icon: IconFlame },
      { value: 'oel',         label: 'Öl',         icon: IconDroplet },
      { value: 'strom',       label: 'Strom',      icon: IconBolt },
      { value: 'waermepumpe', label: 'Wärmepumpe', icon: IconLeaf },
    ],
  },
  {
    key: 'autoType' as const,
    label: 'Fahrzeug',
    icon: IconCar,
    options: [
      { value: 'verbrenner', label: 'Verbrenner', icon: IconCar },
      { value: 'eauto',      label: 'E-Auto',     icon: IconBatteryCharging },
      { value: 'hybrid',     label: 'Hybrid',     icon: IconPlug },
      { value: 'keins',      label: 'Kein Auto',  icon: IconBike },
    ],
  },
  {
    key: 'hasChildren' as const,
    label: 'Kinder im Haushalt',
    icon: IconUsers,
    options: [
      { value: 'true',  label: 'Ja',   icon: IconUsers },
      { value: 'false', label: 'Nein', icon: IconUser },
    ],
  },
  // ── Basics ──────────────────────────────────────────────────
  {
    key: 'steuererklaerung' as const,
    label: 'Steuererklärung',
    icon: IconReceipt,
    options: [
      { value: 'true',  label: 'Erledigt',   icon: IconCheck },
      { value: 'false', label: 'Noch offen', icon: IconX },
    ],
  },
  {
    key: 'girokonto' as const,
    label: 'Kostenloses Girokonto',
    icon: IconCreditCard,
    options: [
      { value: 'true',  label: 'Vorhanden',     icon: IconCheck },
      { value: 'false', label: 'Nicht vorhanden', icon: IconX },
    ],
  },
  {
    key: 'internet' as const,
    label: 'Internet-Vertrag',
    icon: IconWifi,
    options: [
      { value: 'true',  label: 'Aktuell',        icon: IconCheck },
      { value: 'false', label: 'Nicht aktuell',  icon: IconX },
    ],
  },
  {
    key: 'mobilfunk' as const,
    label: 'Mobilfunk-Vertrag',
    icon: IconDeviceMobile,
    options: [
      { value: 'true',  label: 'Aktuell',        icon: IconCheck },
      { value: 'false', label: 'Nicht aktuell',  icon: IconX },
    ],
  },
];

// ── Tips ─────────────────────────────────────────────────────────
const ALL_TIPS: MvpTip[] = [
  {
    id: 'strom-wechsel',
    title: 'Stromtarif wechseln',
    description: 'Mit Wechselpilot übernehmen wir den Wechsel komplett für Sie — automatisch zum besten Tarif, Jahr für Jahr. Sie zahlen nichts, profitieren aber dauerhaft von der günstigsten Stromrechnung.',
    partner: 'Octopus, Tibber, Lichtblick',
    priority: 3, category: 'energie', icon: IconBolt,
    savingsHg2: 475, savingsHg3: 475,
    condition: () => true,
  },
  {
    id: 'gas-wechsel',
    title: 'Gastarif wechseln',
    description: 'Wechselpilot prüft Ihren Gastarif automatisch jedes Jahr und wechselt für Sie zum günstigsten Anbieter — ohne dass Sie selbst aktiv werden müssen. Komplett kostenlos und ohne Aufwand.',
    actionLabel: 'Jetzt Zähler anlegen',
    actionUrl: 'https://konto.wechselpilot.com/neuer-zähler',
    partner: 'Vattenfall, E.ON, EnBW',
    priority: 3, category: 'energie', icon: IconFlame,
    savingsHg2: 361, savingsHg3: 361,
    condition: () => true,
  },
  {
    id: 'thermostate',
    title: 'Smarte Thermostate',
    description: 'Smarte Thermostate heizen automatisch nur, wenn Sie zuhause sind. Das reduziert Ihre Heizkosten um bis zu 30 % — ohne dass Sie an Komfort verlieren.',
    partner: 'tado°, Homematic IP',
    priority: 3, category: 'heizung', icon: IconTemperature,
    savingsHg2: 180, savingsHg3: 220,
    condition: () => true,
  },
  {
    id: 'waermepumpe',
    title: 'Wärmepumpe',
    description: 'Eine Wärmepumpe nutzt Umweltwärme statt Gas oder Öl und ist langfristig deutlich günstiger. Bis zu 70 % Förderung vom Staat machen die Umstellung attraktiv.',
    partner: 'Thermondo, 1KOMMA5°',
    priority: 2, category: 'heizung', icon: IconLeaf,
    savingsHg2: 700, savingsHg3: 700,
    condition: (p) => p.tenure === 'eigentum' && p.propertyType === 'haus' && p.heatingType !== 'waermepumpe',
  },
  {
    id: 'solaranlage',
    title: 'Solaranlage',
    description: 'Eigener Solarstrom vom Dach senkt die Stromrechnung dauerhaft. Mit Speicher decken Sie bis zu 80 % Ihres Bedarfs selbst — und produzieren wetterunabhängig den günstigsten Strom.',
    partner: 'Enpal, Zolar',
    priority: 2, category: 'solar', icon: IconSun,
    savingsHg2: 300, savingsHg3: 300,
    condition: (p) => p.tenure === 'eigentum' && p.propertyType === 'haus',
  },
  {
    id: 'balkonkraftwerk',
    title: 'Balkonkraftwerk',
    description: 'Eine Mini-Solaranlage am Balkon kostet wenig, ist einfach zu installieren und produziert kostenlosen Strom für Ihren Haushalt — auch in Mietwohnungen erlaubt.',
    partner: 'Yuma, Priwatt',
    priority: 2, category: 'solar', icon: IconSun,
    savingsHg2: 180, savingsHg3: 200,
    condition: (p) => !(p.tenure === 'eigentum' && p.propertyType === 'haus'),
  },
  {
    id: 'kfz-versicherung',
    title: 'KFZ-Versicherung wechseln',
    description: 'KFZ-Tarife unterscheiden sich oft um mehrere hundert Euro. Ein Vergleich dauert nur Minuten und der Wechsel zum 1. Januar ist unkompliziert.',
    partner: 'Clark, Tarifcheck, HUK24',
    priority: 3, category: 'mobilitaet', icon: IconCar,
    savingsHg2: 800, savingsHg3: 800,
    condition: (p) => p.autoType !== 'keins' && p.autoType !== '',
  },
  {
    id: 'thg-praemie',
    title: 'THG-Prämie',
    description: 'Als E-Auto-Fahrer haben Sie Anspruch auf die staatliche THG-Prämie — einfach online beantragen und das Geld jährlich kassieren.',
    partner: 'Geld für eAuto',
    priority: 1, category: 'mobilitaet', icon: IconBatteryCharging,
    savingsHg2: 630, savingsHg3: 630,
    condition: (p) => (p.vehicles?.eauto ?? 0) > 0 || p.autoType === 'eauto',
  },
  {
    id: 'wallbox',
    title: 'Wallbox / Laden zuhause',
    description: 'Mit einer Wallbox laden Sie zuhause deutlich günstiger und schneller als an öffentlichen Säulen. In Kombination mit Solarstrom maximieren Sie die Ersparnis.',
    partner: 'Enpal, charge.cloud',
    priority: 1, category: 'mobilitaet', icon: IconBatteryCharging,
    savingsHg2: 280, savingsHg3: 280,
    condition: (p) => (p.vehicles?.hybrid ?? 0) > 0 || (p.vehicles?.eauto ?? 0) > 0 || p.autoType === 'hybrid',
  },
  {
    id: 'hausrat-haftpflicht',
    title: 'Hausrat-/Haftpflicht',
    description: 'Veraltete Versicherungstarife kosten unnötig Geld. Ein Vergleich zeigt schnell, ob Sie bei gleicher Leistung günstigere Anbieter finden.',
    partner: 'Clark',
    priority: 2, category: 'versicherung', icon: IconShield,
    savingsHg2: 160, savingsHg3: 160,
    condition: () => true,
  },
  {
    id: 'internet-wechsel',
    title: 'Internet-Anbieter wechseln',
    description: 'Stammkunden zahlen oft deutlich mehr als Neukunden. Mit einem Anbieterwechsel oder einem Anruf beim aktuellen Anbieter senken Sie monatlich Ihre Internetkosten.',
    partner: 'Verivox, Check24',
    priority: 2, category: 'kommunikation', icon: IconWifi,
    savingsHg2: 240, savingsHg3: 240,
    condition: () => true,
  },
  {
    id: 'mobilfunk-wechsel',
    title: 'Mobilfunk-Tarif optimieren',
    description: 'Mobilfunkanbieter bieten Neukunden meist deutlich günstigere Konditionen. Tarifvergleich oder Nachverhandeln reduziert Ihre Handykosten spürbar.',
    partner: 'Check24, Verivox',
    priority: 2, category: 'kommunikation', icon: IconDeviceMobile,
    savingsHg2: 180, savingsHg3: 180,
    condition: () => true,
  },
  {
    id: 'steuererklaerung',
    title: 'Steuererklärung einreichen',
    description: 'Mit einer Steuer-App geht es ganz einfach — auch ohne Steuerwissen. Antworten auf Fragen geben, fertig. Durchschnittliche Rückerstattung: über 1.000 €.',
    partner: 'Taxfix, WISO, Zasta',
    partnerLinks: [
      { name: 'Taxfix', url: 'https://taxfix.de',           logo: '/apps/wpilot-home/assets/partners/taxfix.png' },
      { name: 'WISO',   url: 'https://www.wiso-steuer.de',  logo: '/apps/wpilot-home/assets/partners/wiso.png' },
      { name: 'Zasta',  url: 'https://www.zasta.de',        logo: '/apps/wpilot-home/assets/partners/zasta.png' },
    ],
    priority: 3, category: 'finanzen', icon: IconReceipt,
    savingsHg2: 1095, savingsHg3: 1095,
    condition: () => true,
  },
  {
    id: 'kostenloses-girokonto',
    title: 'Kostenloses Girokonto',
    description: 'Viele Banken berechnen 5–10 € Kontoführungsgebühren pro Monat. Ein kostenloses Girokonto bei einer Direktbank spart diese Gebühren komplett — bei gleicher Funktionalität.',
    partner: 'ING, DKB',
    priority: 1, category: 'finanzen', icon: IconPig,
    savingsHg2: 120, savingsHg3: 120,
    condition: () => true,
  },
];

// ── Cluster definitions ──────────────────────────────────────────
function buildClusters(profile: MvpProfile, tips: MvpTip[]): { title: string; tips: MvpTip[] }[] {
  const byCategory: Record<string, MvpTip[]> = {};
  for (const t of tips) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  }

  const heizungLabel: Record<string, string> = {
    gas:         'Spartipps für Ihre Gasheizung',
    oel:         'Spartipps für Ihre Ölheizung',
    strom:       'Spartipps für Ihre Stromheizung',
    waermepumpe: 'Ihre Wärmepumpe optimieren',
  };

  const clusterDefs: { key: string; title: string }[] = [
    {
      key: 'energie',
      title: 'Energie & Tarife',
    },
    {
      key: 'versicherung',
      title: profile.hasChildren ? 'Versicherung & Schutz für Ihre Familie' : 'Versicherung & Schutz',
    },
    {
      key: 'heizung',
      title: heizungLabel[profile.heatingType] ?? (
        profile.tenure === 'eigentum' && profile.propertyType === 'haus'
          ? 'Heizung & Modernisierung'
          : 'Heizung optimieren'
      ),
    },
    {
      key: 'finanzen',
      title: 'Steuern & Finanzen',
    },
    {
      key: 'kommunikation',
      title: 'Internet & Mobilfunk',
    },
    {
      key: 'mobilitaet',
      title:
        profile.autoType === 'eauto'      ? 'Spartipps für Ihr E-Auto' :
        profile.autoType === 'hybrid'     ? 'Spartipps für Ihr Hybrid-Fahrzeug' :
        profile.autoType === 'verbrenner' ? 'Spartipps für Ihr Auto' :
        'Mobilität',
    },
    {
      key: 'solar',
      title:
        profile.propertyType === 'haus' && profile.tenure === 'eigentum'
          ? 'Solar für Ihr Haus'
          : profile.tenure === 'eigentum'
          ? 'Solar für Ihre Eigentumswohnung'
          : 'Solar für Ihre Mietwohnung',
    },
  ];

  return clusterDefs
    .map(c => ({ title: c.title, tips: (byCategory[c.key] || []).sort((a, b) => b.priority - a.priority) }))
    .filter(c => c.tips.length > 0);
}

// ── Design Tokens ────────────────────────────────────────────────
const BLUE      = '#5782B0';
const BLUE_LT   = '#EDF2F9';
const BLUE_DK   = '#3D5A80';
const GREEN     = '#0C663B';
const GREEN_LT  = '#E8F5EF';
const ORANGE    = '#F9AA00';
const ORANGE_LT = '#FEF3C7';
const DARK      = '#2C3E50';
const BG        = '#F5F6F8';
const WHITE     = '#FFFFFF';
const BORDER    = '#E2E8F0';
const TEXT      = DARK;
const TEXT_MUTED  = '#7A8C9A';
const TEXT_DIM    = '#A0AEBB';

const PRIORITY_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  3: { bg: GREEN_LT,  text: GREEN,      label: 'Top' },
  2: { bg: ORANGE_LT, text: '#92400e',  label: 'Empfohlen' },
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
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);
  return <>{fmt(display)}{suffix}</>;
}

// ── Profile Edit View ────────────────────────────────────────────
function ProfileEditView({
  profile, onSave, onBack,
}: {
  profile: MvpProfile;
  onSave: (p: MvpProfile) => void;
  onBack: () => void;
}) {
  const [local, setLocal] = useState<MvpProfile>(profile);
  const [openField, setOpenField] = useState<string | null>(null);

  function getStrVal(field: typeof PROFILE_FIELDS[0]) {
    const v = local[field.key];
    return v === true ? 'true' : v === false ? 'false' : String(v ?? '');
  }

  function selectOption(fieldKey: string, value: string) {
    const coerced: any = value === 'true' ? true : value === 'false' ? false : value;
    const updated = { ...local, [fieldKey]: coerced };
    setLocal(updated);
    localStorage.setItem('wpilot_mvp_profile', JSON.stringify(updated));
    onSave(updated);
    setOpenField(null);
  }

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(243,243,245,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`, padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: `1.5px solid ${BORDER}`, borderRadius: 10,
          padding: '7px 14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600, color: TEXT,
        }}>
          <IconArrowLeft size={16} stroke={1.5} /> Zurück
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Ihre Angaben</span>
        </div>
        <div style={{ width: 80 }} />
      </div>

      <div className="mvp-profile-container" style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px', width: '100%' }}>
        <style>{`
          @media(min-width:900px){
            .mvp-profile-container{max-width:980px !important;padding:24px 24px 40px !important;}
            .mvp-profile-grid{display:grid !important;grid-template-columns:repeat(2, 1fr) !important;gap:10px 14px !important;}
          }
        `}</style>
        <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 20, lineHeight: 1.5 }}>
          Tippen Sie auf ein Feld, um Ihre Angabe direkt zu ändern. Die Empfehlungen werden sofort aktualisiert.
        </p>

        <div className="mvp-profile-grid" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROFILE_FIELDS.map(field => {
            const isOpen = openField === field.key;
            const FieldIcon = field.icon;
            const strVal = getStrVal(field);
            const currentOpt = field.options.find(o => o.value === strVal);
            const CurrentIcon = currentOpt?.icon ?? IconCircle;

            return (
              // plain div — no motion.div/layout so border-radius stays smooth
              <div
                key={field.key}
                style={{
                  background: WHITE,
                  border: isOpen ? `2px solid ${BLUE}` : `1.5px solid ${BORDER}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Row: static label left, interactive dropdown right */}
                <div
                  style={{
                    padding: '12px 14px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    userSelect: 'none',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: BLUE_LT,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FieldIcon size={19} stroke={1.5} color={BLUE} />
                  </div>
                  <div style={{
                    flex: 1, minWidth: 0,
                    fontSize: 13, fontWeight: 600, color: TEXT,
                    letterSpacing: '0.01em',
                  }}>
                    {field.label}
                  </div>
                  <button
                    onClick={() => setOpenField(isOpen ? null : field.key)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: isOpen ? BLUE : BLUE_LT,
                      color: isOpen ? WHITE : BLUE_DK,
                      border: 'none',
                      borderRadius: 999,
                      padding: '7px 12px 7px 12px',
                      fontSize: 13, fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                      flexShrink: 0,
                      maxWidth: '60%',
                    }}
                  >
                    <CurrentIcon size={14} stroke={1.8} color={isOpen ? WHITE : BLUE} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentOpt?.label ?? '– wählen'}
                    </span>
                    <IconChevronDown
                      size={15} stroke={2}
                      style={{
                        transition: 'transform 0.25s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>
                </div>

                {/* Options — AnimatePresence on the wrapper only, no layout */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="options"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '12px 12px 12px',
                        borderTop: `1px solid ${BORDER}`,
                        display: 'flex', flexDirection: 'column', gap: 7,
                      }}>
                        {field.options.map(opt => {
                          const isSelected = strVal === opt.value;
                          const OptIcon = opt.icon;
                          return (
                            <motion.button
                              key={opt.value}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => selectOption(field.key, opt.value)}
                              style={{
                                width: '100%',
                                background: isSelected ? BLUE_LT : '#f9fafb',
                                border: isSelected ? `2px solid ${BLUE}` : `1.5px solid ${BORDER}`,
                                borderRadius: 10, padding: '11px 14px',
                                display: 'flex', alignItems: 'center', gap: 12,
                                cursor: 'pointer', transition: 'all 0.12s',
                                textAlign: 'left' as const,
                              }}
                            >
                              <div style={{
                                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                                background: isSelected ? BLUE : WHITE,
                                border: isSelected ? 'none' : `1px solid ${BORDER}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.12s',
                              }}>
                                <OptIcon size={18} stroke={1.5} color={isSelected ? WHITE : TEXT_MUTED} />
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 600, color: isSelected ? BLUE_DK : TEXT, flex: 1 }}>
                                {opt.label}
                              </span>
                              {isSelected && (
                                <div style={{
                                  width: 22, height: 22, borderRadius: 11, background: BLUE, flexShrink: 0,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  <IconCheck size={14} stroke={2.5} color={WHITE} />
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button onClick={onBack} style={{
            background: BLUE, border: 'none', borderRadius: 12,
            padding: '12px 28px', fontSize: 14, fontWeight: 600,
            color: WHITE, cursor: 'pointer',
            boxShadow: `0 2px 8px rgba(87,130,176,0.35)`,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Empfehlungen ansehen <IconArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Profile Pill Icon ────────────────────────────────────────────
function ProfilePillIcon({ type, value }: { type: string; value: string }) {
  const p = { size: 16, stroke: 1.5, color: BLUE_DK };
  switch (type) {
    case 'tenure':   return <IconHome {...p} />;
    case 'property': return value === 'haus' ? <IconHome {...p} /> : <IconBuilding {...p} />;
    case 'heating':  return <IconFlame {...p} />;
    case 'auto':     return value === 'eauto' ? <IconBatteryCharging {...p} /> : value === 'hybrid' ? <IconPlug {...p} /> : value === 'verbrenner' ? <IconCar {...p} /> : <IconBike {...p} />;
    case 'children': return value === 'mit' ? <IconUsers {...p} /> : <IconUser {...p} />;
    default:         return <IconCircle {...p} />;
  }
}

// ── Main Component ───────────────────────────────────────────────
interface DashboardProps {
  initialProfile?: MvpProfile;
}

export default function MvpDashboard({ initialProfile }: DashboardProps = {}) {
  const [profile, setProfile] = useState<MvpProfile | null>(initialProfile ?? null);
  const [view, setView] = useState<'dashboard' | 'profile'>('dashboard');
  const [done, setDone] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wpilot_mvp_done') || '[]')); } catch { return new Set(); }
  });
  const [removed, setRemoved] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wpilot_mvp_removed') || '[]')); } catch { return new Set(); }
  });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showRemoved, setShowRemoved] = useState(false);

  useEffect(() => {
    if (initialProfile) return;
    try {
      const raw = localStorage.getItem('wpilot_mvp_profile');
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem('wpilot_mvp_done',    JSON.stringify([...done]));    }, [done]);
  useEffect(() => { localStorage.setItem('wpilot_mvp_removed', JSON.stringify([...removed])); }, [removed]);

  const hg = profile?.hasChildren ? 3 : 2;
  const getSavings = (tip: MvpTip) => hg === 3 ? tip.savingsHg3 : tip.savingsHg2;

  const tips = useMemo(() => {
    if (!profile) return [];
    const base = ALL_TIPS.filter(t => {
      if (!t.condition(profile)) return false;
      // Hide tips that user already completed in Basics steps
      if (t.id === 'steuererklaerung' && profile.steuererklaerung) return false;
      if (t.id === 'kostenloses-girokonto' && profile.girokonto) return false;
      if (t.id === 'internet-wechsel' && profile.internet) return false;
      if (t.id === 'mobilfunk-wechsel' && profile.mobilfunk) return false;
      return true;
    });

    // Expand per-vehicle tips (KfZ-Versicherung per car, THG-Prämie per E-Auto)
    const v = profile.vehicles ?? { verbrenner: 0, eauto: 0, hybrid: 0 };
    const vehicleCount = v.verbrenner + v.eauto + v.hybrid;
    // Legacy fallback: if no vehicles object but autoType set, treat as 1 vehicle
    const legacyVehicle = vehicleCount === 0 && profile.autoType && profile.autoType !== 'keins' && profile.autoType !== '' ? 1 : 0;
    const totalVehicles = vehicleCount || legacyVehicle;

    const expanded: MvpTip[] = [];
    for (const t of base) {
      if (t.id === 'kfz-versicherung' && totalVehicles > 1) {
        for (let i = 1; i <= totalVehicles; i++) {
          expanded.push({ ...t, id: `${t.id}-${i}`, title: `${t.title} (Fahrzeug ${i})` });
        }
      } else if (t.id === 'thg-praemie' && v.eauto > 1) {
        for (let i = 1; i <= v.eauto; i++) {
          expanded.push({ ...t, id: `${t.id}-${i}`, title: `${t.title} (E-Auto ${i})` });
        }
      } else {
        expanded.push(t);
      }
    }

    return expanded.filter(t => !removed.has(t.id));
  }, [profile, removed]);

  const removedTips = useMemo(() => {
    if (!profile) return [];
    return ALL_TIPS.filter(t => t.condition(profile) && removed.has(t.id));
  }, [profile, removed]);

  const clusters = useMemo(() => profile ? buildClusters(profile, tips) : [], [profile, tips]);
  const total     = useMemo(() => tips.reduce((s, t) => s + getSavings(t), 0), [tips, hg]);
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

  if (view === 'profile') {
    return (
      <ProfileEditView
        profile={profile}
        onSave={updated => setProfile(updated)}
        onBack={() => setView('dashboard')}
      />
    );
  }

  function toggleDone(id: string) {
    setDone(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }
  function removeTip(id: string) {
    setRemoved(prev => { const n = new Set(prev); n.add(id); return n; });
    setDone(prev => { const n = new Set(prev); n.delete(id); return n; });
  }
  function restoreTip(id: string) {
    setRemoved(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  const profilePills = [
    { type: 'property', label: profile.propertyType === 'haus' ? 'Haus' : 'Wohnung',                                                          value: profile.propertyType },
    { type: 'tenure',   label: profile.tenure === 'eigentum' ? 'Eigentum' : 'Miete',                                                          value: profile.tenure },
    { type: 'heating',  label: ({ gas: 'Gas', oel: 'Öl', strom: 'Strom', waermepumpe: 'Wärmepumpe', weiss_nicht: 'Heizung unklar' } as any)[profile.heatingType] || 'Keine Angabe', value: profile.heatingType },
    { type: 'auto',     label: (() => {
        if (profile.autoType === 'keins') return 'Kein Auto';
        const v = profile.vehicles;
        if (v && (v.verbrenner + v.eauto + v.hybrid) > 0) {
          const parts: string[] = [];
          if (v.verbrenner > 0) parts.push(`${v.verbrenner}× Verbrenner`);
          if (v.eauto > 0)      parts.push(`${v.eauto}× E-Auto`);
          if (v.hybrid > 0)     parts.push(`${v.hybrid}× Hybrid`);
          return parts.join(', ');
        }
        return ({ verbrenner: 'Verbrenner', eauto: 'E-Auto', hybrid: 'Hybrid' } as any)[profile.autoType] || 'Fahrzeug';
      })(), value: profile.autoType },
    { type: 'children', label: profile.hasChildren ? 'Mit Kindern' : 'Ohne Kinder',                                                            value: profile.hasChildren ? 'mit' : 'ohne' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: BG }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(243,243,245,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`, padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <img src={logoWp} alt="Wechselpilot" height={28} style={{ objectFit: 'contain', flexShrink: 0 }} />
        <span style={{
          background: '#f9aa00', borderRadius: 999,
          padding: '4px 10px',
          fontFamily: "'Poppins', sans-serif",
          display: 'inline-flex', alignItems: 'center', lineHeight: 1,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#243c47', letterSpacing: '0.06em' }}>HOME</span>
        </span>
        <div style={{ flex: 1 }} />
      </div>

      <div className="mvp-dash-container" style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 40px' }}>
        <style>{`
          @media(min-width:900px){
            .mvp-dash-container{max-width:1180px !important;padding:24px 24px 40px !important;}
            .mvp-clusters{display:grid !important;grid-template-columns:repeat(2, 1fr) !important;gap:20px 28px !important;}
            .mvp-clusters > div{margin-bottom:0 !important;}
          }
        `}</style>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)',
            borderRadius: 18, padding: '24px 20px', color: WHITE,
            position: 'relative', overflow: 'hidden',
            marginBottom: 14,
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 8, letterSpacing: '0.05em' }}>Ihr Sparpotenzial pro Jahr</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}><AnimatedCounter value={total} /></span>
              <span style={{ fontSize: 20, fontWeight: 700, opacity: 0.8 }}>€</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16 }}>{tips.length} Empfehlungen basierend auf Ihren Antworten</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px', flex: '1 1 0' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}><AnimatedCounter value={doneTotal} suffix=" €" /></div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>Erledigt</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px', flex: '1 1 0' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{doneCount}/{tips.length}</div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>Tipps erledigt</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile pills */}
        <div
          onClick={() => setView('profile')}
          style={{
            background: WHITE, borderRadius: 14, padding: '12px 16px', marginBottom: 24,
            border: `1px solid ${BORDER}`, display: 'flex', gap: 8, flexWrap: 'wrap',
            cursor: 'pointer', alignItems: 'center',
          }}
        >
          {profilePills.map(p => (
            <span key={p.type} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: BLUE_LT, borderRadius: 8, padding: '5px 10px',
              fontSize: 12, fontWeight: 500, color: BLUE_DK,
            }}>
              <ProfilePillIcon type={p.type} value={p.value} />
              {p.label}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: TEXT_MUTED, fontWeight: 600 }}>
            <IconPencil size={13} stroke={1.5} /> Angaben ändern
          </span>
        </div>

        {/* Clustered tips */}
        <div className="mvp-clusters" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {clusters.map((cluster, ci) => (
            <div key={cluster.title}>
              {/* Cluster heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{cluster.title}</span>
                <div style={{ flex: 1, height: 1, background: BORDER }} />
                <span style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 500 }}>
                  {fmt(cluster.tips.reduce((s, t) => s + getSavings(t), 0))} €
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cluster.tips.map((tip, i) => {
                  const isDone = done.has(tip.id);
                  const isExpanded = expanded === tip.id;
                  const TipIcon = tip.icon;
                  const savings = getSavings(tip);
                  return (
                    <div key={tip.id} style={{ position: 'relative' }}>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                        style={{
                          background: WHITE, borderRadius: 14,
                          border: isDone ? `2px solid ${GREEN}` : `1px solid ${BORDER}`,
                          overflow: 'hidden', opacity: isDone ? 0.6 : 1, transition: 'opacity 0.15s',
                        }}
                      >
                        <div
                          onClick={() => setExpanded(isExpanded ? null : tip.id)}
                          style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                        >
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: BLUE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <TipIcon size={22} stroke={1.5} color={BLUE} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, lineHeight: 1.3, textDecoration: isDone ? 'line-through' : 'none', marginBottom: 2 }}>
                              {tip.title}
                            </div>
                            <div style={{ fontSize: 12, color: TEXT_MUTED }}>{fmt(savings)} € / Jahr</div>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); toggleDone(tip.id); }}
                            style={{
                              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                              border: isDone ? 'none' : `2px solid ${BORDER}`,
                              background: isDone ? GREEN : 'transparent',
                              color: isDone ? WHITE : 'transparent',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                            }}
                          >
                            <IconCheck size={16} stroke={2} />
                          </button>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ padding: '14px 16px 16px', borderTop: `1px solid ${BORDER}` }}>
                                {tip.description && (
                                  <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.6, marginBottom: 12, fontWeight: 400 }}>{tip.description}</p>
                                )}
                                {tip.actionLabel && tip.actionUrl && (
                                  <a
                                    href={tip.actionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                      display: 'inline-flex', alignItems: 'center', gap: 6,
                                      background: DARK, color: WHITE,
                                      borderRadius: 999, padding: '10px 18px',
                                      fontSize: 13, fontWeight: 700, textDecoration: 'none',
                                      marginBottom: 12,
                                    }}
                                  >
                                    {tip.actionLabel}
                                    <IconArrowRight size={14} stroke={2.5} />
                                  </a>
                                )}
                                {!tip.actionLabel && tip.partner && (
                                  <p style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 12, fontWeight: 500 }}>
                                    Empfohlene Partner: {tip.partner}
                                  </p>
                                )}
                                {tip.partnerLinks && tip.partnerLinks.length > 0 && (
                                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {tip.partnerLinks.map(pl => (
                                      <a key={pl.name} href={pl.url} target="_blank" rel="noopener noreferrer" style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10,
                                        padding: '6px 12px', textDecoration: 'none',
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

                      <button
                        onClick={() => removeTip(tip.id)}
                        style={{
                          position: 'absolute', top: '50%', right: -34, transform: 'translateY(-50%)',
                          width: 28, height: 28, borderRadius: 8, border: 'none',
                          background: 'transparent', color: TEXT_MUTED, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.15s',
                        }}
                        className="mvp-tip-delete"
                      >
                        <IconX size={16} stroke={1.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Deleted tips */}
        {removedTips.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <button onClick={() => setShowRemoved(!showRemoved)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              color: TEXT_MUTED, fontSize: 13, fontWeight: 600, padding: '8px 0', width: '100%',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 6, background: ORANGE_LT, fontSize: 11, fontWeight: 700, color: '#92400e' }}>
                {removedTips.length}
              </span>
              Gelöschte Empfehlungen
              <span style={{ display: 'inline-block', transform: showRemoved ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: 14 }}>▾</span>
            </button>
            {showRemoved && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
                  {removedTips.map(tip => {
                    const TipIcon = tip.icon;
                    const savings = getSavings(tip);
                    const pri = PRIORITY_COLORS[tip.priority];
                    return (
                      <div key={tip.id} style={{ background: WHITE, borderRadius: 12, border: `1px dashed ${BORDER}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.7 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: BLUE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <TipIcon size={18} stroke={1.5} color={BLUE} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{tip.title}</div>
                          <div style={{ fontSize: 11, color: TEXT_MUTED }}>{fmt(savings)} € / Jahr</div>
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 6px', borderRadius: 5, background: pri.bg, color: pri.text, flexShrink: 0 }}>{pri.label}</span>
                        <button onClick={() => restoreTip(tip.id)} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8, border: `1px solid ${GREEN}`, background: GREEN_LT, color: GREEN, cursor: 'pointer', whiteSpace: 'nowrap' }}>
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

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 12, color: TEXT_MUTED }}>
            {tips.length} Empfehlungen · {fmt(total)} € Potenzial ·{' '}
            <button onClick={() => setView('profile')} style={{ background: 'none', border: 'none', color: BLUE, fontSize: 12, fontWeight: 500, cursor: 'pointer', padding: 0 }}>
              Angaben ändern
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
