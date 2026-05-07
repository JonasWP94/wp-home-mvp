import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconHome,
  IconBuilding,
  IconFlame,
  IconCar,
  IconUsers,
  IconUser,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconBolt,
  IconGift,
} from '@tabler/icons-react';
import MvpDashboard from '../MvpDashboard';

// ── Types ────────────────────────────────────────────────────────
interface MvpProfile {
  tenure: 'miete' | 'eigentum' | '';
  propertyType: 'wohnung' | 'haus' | '';
  heatingType: 'gas' | 'oel' | 'strom' | 'waermepumpe' | '';
  autoType: 'verbrenner' | 'eauto' | 'hybrid' | 'keins' | '';
  hasChildren: boolean | null;
}

const INITIAL: MvpProfile = {
  tenure: '', propertyType: '', heatingType: '', autoType: '', hasChildren: null,
};

// ── Design Tokens ────────────────────────────────────────────────
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

// ── Step Definitions ─────────────────────────────────────────────
const STEPS = [
  {
    key: 'propertyType' as const,
    icon: IconBuilding,
    title: 'Wohnung oder Haus?',
    sub: 'EFH = Wärmepumpe & Solar, Wohnung = Balkonkraftwerk & dynamischer Strom',
    options: [
      { value: 'wohnung', label: 'Wohnung', icon: IconBuilding },
      { value: 'haus', label: 'Haus / EFH', icon: IconHome },
    ],
  },
  {
    key: 'tenure' as const,
    icon: IconHome,
    title: 'Wohnen Sie zur Miete oder im Eigentum?',
    sub: 'Bestimmt, welche Energie-Invest-Empfehlungen für Sie relevant sind',
    options: [
      { value: 'miete', label: 'Zur Miete', icon: IconKey },
      { value: 'eigentum', label: 'Im Eigentum', icon: IconHome },
    ],
  },
  {
    key: 'heatingType' as const,
    icon: IconFlame,
    title: 'Wie heizen Sie aktuell?',
    sub: 'Bestimmt Wechsel- und Modernisierungsempfehlungen',
    options: [
      { value: 'gas', label: 'Gas', icon: IconFlame },
      { value: 'oel', label: 'Öl', icon: IconDroplet },
      { value: 'strom', label: 'Strom', icon: IconBolt },
      { value: 'waermepumpe', label: 'Wärmepumpe', icon: IconLeaf },
    ],
  },
  {
    key: 'autoType' as const,
    icon: IconCar,
    title: 'Haben Sie ein Auto?',
    sub: 'E-Auto → THG-Prämie & Wallbox. Verbrenner → Sprit & Versicherung',
    options: [
      { value: 'verbrenner', label: 'Verbrenner', icon: IconCar },
      { value: 'eauto', label: 'E-Auto', icon: IconBatteryCharging },
      { value: 'hybrid', label: 'Hybrid', icon: IconPlug },
      { value: 'keins', label: 'Kein Auto', icon: IconBike },
    ],
  },
  {
    key: 'hasChildren' as const,
    icon: IconUsers,
    title: 'Haben Sie Kinder?',
    sub: 'Kinderzuschlag, Familycard, Secondhand-Tipps',
    options: [
      { value: 'true', label: 'Ja', icon: IconUsers },
      { value: 'false', label: 'Nein', icon: IconUser },
    ],
  },
];

import {
  IconKey,
  IconDroplet,
  IconLeaf,
  IconBatteryCharging,
  IconBike,
  IconPlug,
} from '@tabler/icons-react';

const TOTAL = STEPS.length;

type View = 'intro' | 'quiz' | 'results';

// ── Intro Screen (adapted from MvpThankYou) ──────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(245,246,248,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        padding: '10px 20px',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/apps/wpilot-home/assets/logo-wp.png" alt="WP" height={20} style={{ objectFit: 'contain' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: "'Poppins', sans-serif", letterSpacing: '0.05em' }}>HOME</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 24px' }}>
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
              Willkommen bei Wechselpilot HOME
            </h1>
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.4, marginBottom: 2 }}>
              5 kurze Fragen – Ihr persönliches Sparpotenzial in Sekunden.
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: GREEN, lineHeight: 1.3 }}>
              Unsere Nutzer sparen durchschnittlich <span style={{ fontSize: 18 }}>3.800 €</span> pro Jahr
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
              WAS ERWARTET SIE?
            </p>
          </motion.div>

          {/* Teaser Cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}
          >
            <div style={{
              background: WHITE, border: `2px solid ${BORDER}`, borderRadius: 14,
              padding: '16px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: BLUE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconBolt size={22} stroke={1.5} color={BLUE} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>Energie & Heizung</div>
                <div style={{ fontSize: 11, color: TEXT_MUTED }}>Strom, Gas, Solar & Wärmepumpe</div>
              </div>
            </div>

            <div style={{
              background: WHITE, border: `2px solid ${BORDER}`, borderRadius: 14,
              padding: '16px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: ORANGE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCar size={22} stroke={1.5} color={ORANGE} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>Mobilität</div>
                <div style={{ fontSize: 11, color: TEXT_MUTED }}>THG-Prämie, KFZ & Wallbox</div>
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${GREEN_LT} 0%, #f0faf4 100%)`,
              border: `2px solid ${GREEN}33`, borderRadius: 14,
              padding: '16px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: GREEN_LT, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <IconGift size={22} stroke={1.5} color={GREEN} />
                <div style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: 8, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${WHITE}` }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: WHITE }}>1</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>Versicherung & Familie</div>
                <div style={{ fontSize: 11, color: TEXT_MUTED }}>Hausrat, Haftpflicht & Steuern</div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{ textAlign: 'center' }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              style={{
                background: `linear-gradient(135deg, ${GREEN} 0%, #0d8045 100%)`,
                border: 'none', borderRadius: 14,
                padding: '14px 32px',
                fontSize: 15, fontWeight: 700, color: WHITE,
                cursor: 'pointer',
                boxShadow: `0 4px 16px rgba(12,102,59,0.3)`,
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              Sparpotenzial berechnen <IconArrowRight size={18} />
            </motion.button>
            <p style={{ fontSize: 12, color: TEXT_DIM, marginTop: 8 }}>5 Fragen · unter 1 Minute · kostenlos</p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function MvpWizard() {
  const [view, setView] = useState<View>('intro');
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<MvpProfile>(INITIAL);
  const [dir, setDir] = useState(1);
  const [finalProfile, setFinalProfile] = useState<MvpProfile | null>(null);

  const current = STEPS[step];
  const currentValue = profile[current.key];
  const canNext = currentValue !== '' && currentValue !== null;
  const isLast = step === TOTAL - 1;
  const StepIcon = current.icon;

  function select(val: any) {
    setProfile(p => ({ ...p, [current.key]: val }));
  }

  function finish(fp: MvpProfile) {
    localStorage.setItem('wpilot_mvp_profile', JSON.stringify(fp));
    setFinalProfile(fp);
    setView('results');
  }

  function goNext() {
    if (!canNext) return;
    if (isLast) {
      finish(profile);
      return;
    }
    setDir(1);
    setStep(s => s + 1);
  }

  function goBack() {
    if (step === 0) {
      setView('intro');
      return;
    }
    setDir(-1);
    setStep(s => s - 1);
  }

  React.useEffect(() => {
    if (view !== 'quiz') return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && canNext) goNext();
      if (e.key === 'Backspace') goBack();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canNext, step, view]);

  if (view === 'intro') return <IntroScreen onStart={() => setView('quiz')} />;
  if (view === 'results' && finalProfile) return <MvpDashboard initialProfile={finalProfile} />;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column' }}>
      {/* ── Header ────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(245,246,248,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <img src="/apps/wpilot-home/assets/logo-wp.png" alt="WP" height={22} style={{ objectFit: 'contain' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: "'Poppins', sans-serif", letterSpacing: '0.05em' }}>HOME</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'center' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 4,
              background: i === step ? BLUE : i < step ? BLUE : BORDER,
              transition: 'all 0.3s', flexShrink: 0,
            }} />
          ))}
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────────── */}
      <div style={{ height: 3, background: BORDER }}>
        <motion.div
          initial={false}
          animate={{ width: `${((step + 1) / TOTAL) * 100}%` }}
          transition={{ duration: 0.3 }}
          style={{ height: '100%', background: BLUE }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px 120px' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            style={{ width: '100%', maxWidth: 420 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: BLUE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <StepIcon size={30} stroke={1.5} color={BLUE} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: BLUE, letterSpacing: '0.08em', marginBottom: 6 }}>
                FRAGE {step + 1} VON {TOTAL}
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: TEXT, lineHeight: 1.3, marginBottom: 8 }}>
                {current.title}
              </h1>
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5 }}>
                {current.sub}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {current.options.map(opt => {
                const isSelected = String(currentValue) === String(opt.value);
                const OptIcon = opt.icon;
                return (
                  <motion.button
                    key={String(opt.value)}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const val = opt.value === 'true' ? true : opt.value === 'false' ? false : opt.value;
                      select(val);
                      setTimeout(() => {
                        if (isLast) {
                          finish({ ...profile, [current.key]: val });
                        } else {
                          setDir(1);
                          setStep(s => s + 1);
                        }
                      }, 250);
                    }}
                    style={{
                      width: '100%',
                      background: isSelected ? BLUE_LT : WHITE,
                      border: isSelected ? `2px solid ${BLUE}` : `2px solid ${BORDER}`,
                      borderRadius: 14,
                      padding: '16px 18px',
                      display: 'flex', alignItems: 'center', gap: 14,
                      cursor: 'pointer', transition: 'all 0.15s',
                      textAlign: 'left' as const,
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: isSelected ? BLUE : '#f3f4f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}>
                      <OptIcon size={22} stroke={1.5} color={isSelected ? WHITE : TEXT_MUTED} />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 600, color: isSelected ? BLUE_DK : TEXT }}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <div style={{ marginLeft: 'auto', flexShrink: 0, width: 24, height: 24, borderRadius: 12, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconCheck size={16} stroke={2} color={WHITE} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom nav ────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${BORDER}`,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button
          onClick={goBack}
          style={{
            background: 'transparent', border: `1.5px solid ${BORDER}`,
            borderRadius: 12, padding: '10px 16px',
            fontSize: 14, fontWeight: 600, color: TEXT,
            cursor: 'pointer', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <IconArrowLeft size={16} /> Zurück
        </button>
        <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 500 }}>
          {step + 1} / {TOTAL}
        </div>
        <button
          onClick={goNext}
          disabled={!canNext}
          style={{
            background: canNext ? BLUE : BORDER,
            border: 'none', borderRadius: 12,
            padding: '10px 20px',
            fontSize: 14, fontWeight: 600, color: canNext ? WHITE : TEXT_DIM,
            cursor: canNext ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
            boxShadow: canNext ? `0 2px 8px rgba(87,130,176,0.35)` : 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {isLast ? 'Ergebnis anzeigen' : 'Weiter'} <IconArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
