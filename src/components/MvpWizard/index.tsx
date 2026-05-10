import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconHome,
  IconBuilding,
  IconFlame,
  IconCar,
  IconUsers,
  IconUser,
  IconArrowRight,
  IconCheck,
  IconBolt,
  IconKey,
  IconDroplet,
  IconLeaf,
  IconBatteryCharging,
  IconBike,
  IconPlug,
} from '@tabler/icons-react';
import {
  ACCENT, BLUE_VERY_BRIGHT, BLUE_DARK,
  PRIMARY, BG, WHITE, BORDER, GREY_200, GREY_700, GREY_800,
  RADIUS_MD, RADIUS_SM, RADIUS_LG,
  TEXT_XS, TEXT_SM, TEXT_MD, TEXT_LG,
  FW_REGULAR, FW_MEDIUM, FW_SEMIBOLD, FW_BOLD,
} from '../_tokens';
import WpHeader from '../_WpHeader';
import WpBottomNav from '../_WpBottomNav';
import MvpDashboard from '../MvpDashboard';
import MvpThankYou from '../MvpThankYou';
import MvpHomeLanding from '../MvpHomeLanding';
import MvpSparZiel, { SparZielData } from '../MvpSparZiel';
import MvpEssentials, { EssentialsData } from '../MvpEssentials';
import MvpKommunikation, { KommunikationData } from '../MvpKommunikation';

// ── Types ────────────────────────────────────────────────────────
interface MvpProfile {
  tenure: 'miete' | 'eigentum' | '';
  propertyType: 'wohnung' | 'haus' | '';
  heatingType: 'gas' | 'oel' | 'strom' | 'waermepumpe' | 'weiss_nicht' | '';
  autoType: 'verbrenner' | 'eauto' | 'hybrid' | 'keins' | '';
  hasChildren: boolean | null;
  investitionen: 'keine' | 'gadgets' | 'projekte' | '';
  sparziel: string;
  zeitaufwand: string;
  steuererklaerung: boolean;
  girokonto: boolean;
  mobilfunk: boolean;
  internet: boolean;
}

const INITIAL: MvpProfile = {
  tenure: '', propertyType: '', heatingType: '', autoType: '', hasChildren: null,
  investitionen: '', sparziel: '', zeitaufwand: '',
  steuererklaerung: false, girokonto: false,
  mobilfunk: false, internet: false,
};

// ── Step Definitions ─────────────────────────────────────────────
const STEPS = [
  {
    key: 'propertyType' as const,
    icon: IconBuilding,
    title: 'Wohnen Sie in einer Wohnung oder einem Haus?',
    sub: 'Damit empfehlen wir Ihnen die passenden Energiespar-Optionen für Ihre Wohnsituation.',
    options: [
      { value: 'wohnung', label: 'Wohnung', icon: IconBuilding },
      { value: 'haus',    label: 'Haus',    icon: IconHome },
    ],
  },
  {
    key: 'tenure' as const,
    icon: IconKey,
    title: 'Wohnen Sie zur Miete oder im Eigentum?',
    sub: 'Mieter und Eigentümer haben unterschiedliche Möglichkeiten – wir zeigen Ihnen die passenden.',
    options: [
      { value: 'miete',    label: 'Zur Miete',   icon: IconKey },
      { value: 'eigentum', label: 'Im Eigentum', icon: IconHome },
    ],
  },
  {
    key: 'heatingType' as const,
    icon: IconFlame,
    title: 'Wie heizen Sie aktuell?',
    sub: 'Wir prüfen, ob Sie beim Heizen sparen oder von einem günstigeren System profitieren können.',
    options: [
      { value: 'gas',          label: 'Gas',            icon: IconFlame },
      { value: 'oel',          label: 'Öl',             icon: IconDroplet },
      { value: 'strom',        label: 'Strom',          icon: IconBolt },
      { value: 'waermepumpe',  label: 'Wärmepumpe',     icon: IconLeaf },
      { value: 'weiss_nicht',  label: 'Weiß ich nicht', icon: IconUser },
    ],
  },
  {
    key: 'autoType' as const,
    icon: IconCar,
    title: 'Welches Fahrzeug nutzen Sie?',
    sub: 'Je nach Fahrzeug zeigen wir Ihnen, wie Sie bei Kraftstoff, Versicherung oder Ladestrom sparen.',
    options: [
      { value: 'verbrenner', label: 'Verbrenner', icon: IconCar },
      { value: 'eauto',      label: 'E-Auto',     icon: IconBatteryCharging },
      { value: 'hybrid',     label: 'Hybrid',     icon: IconPlug },
      { value: 'keins',      label: 'Kein Auto',  icon: IconBike },
    ],
  },
  {
    key: 'hasChildren' as const,
    icon: IconUsers,
    title: 'Leben Kinder in Ihrem Haushalt?',
    sub: 'Familien profitieren von zusätzlichen Spar-Angeboten bei Versicherungen und Energietarifen.',
    options: [
      { value: 'true',  label: 'Ja',   icon: IconUsers },
      { value: 'false', label: 'Nein', icon: IconUser },
    ],
  },
];

const TOTAL = STEPS.length;

type View = 'intro' | 'landing' | 'sparziel' | 'essentials' | 'kommunikation' | 'quiz' | 'loading' | 'results';

// ── Loading Screen ────────────────────────────────────────────────
const LOADING_STEPS = [
  'Antworten werden ausgewertet …',
  'Spartipps werden personalisiert …',
  'Ihr Spar-Dashboard wird erstellt …',
];

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = React.useState(0);
  const [barPct, setBarPct] = React.useState(0);

  React.useEffect(() => {
    const duration = 2400;
    const start = performance.now();
    let rafId: number;

    function tick(now: number) {
      const pct = Math.min((now - start) / duration, 1);
      setBarPct(pct);
      const stepIdx = Math.min(Math.floor(pct * LOADING_STEPS.length), LOADING_STEPS.length - 1);
      setIdx(stepIdx);
      if (pct < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(onDone, 120);
      }
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div style={{
      minHeight: '100dvh', background: BG,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', fontFamily: "'Poppins', sans-serif",
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{
          width: 56, height: 56, borderRadius: 28,
          border: `3px solid ${BLUE_VERY_BRIGHT}`,
          borderTopColor: ACCENT,
          marginBottom: 28,
        }}
      />

      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          style={{
            fontSize: TEXT_MD, fontWeight: FW_SEMIBOLD,
            color: PRIMARY, marginBottom: 24, textAlign: 'center',
          }}
        >
          {LOADING_STEPS[idx]}
        </motion.p>
      </AnimatePresence>

      <div style={{ width: '100%', maxWidth: 280, height: 4, background: BORDER, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: ACCENT, borderRadius: 2,
          width: `${barPct * 100}%`, transition: 'width 0.05s linear',
        }} />
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
    setView('loading');
  }

  function goNext() {
    if (!canNext) return;
    if (isLast) { finish(profile); return; }
    setDir(1);
    setStep(s => s + 1);
  }

  function skip() {
    if (isLast) { finish(profile); return; }
    setDir(1);
    setStep(s => s + 1);
  }

  function goBack() {
    if (step === 0) { setView('kommunikation'); return; }
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

  if (view === 'intro') return <MvpThankYou onStart={() => setView('landing')} />;
  if (view === 'landing') return <MvpHomeLanding onStart={() => setView('sparziel')} onBack={() => setView('intro')} />;
  if (view === 'sparziel') return (
    <MvpSparZiel
      onDone={(data: SparZielData) => {
        setProfile(p => ({ ...p, sparziel: data.sparziel, zeitaufwand: data.zeitaufwand, investitionen: data.investitionen as MvpProfile['investitionen'] }));
        setView('essentials');
      }}
      onBack={() => setView('landing')}
    />
  );
  if (view === 'essentials') return (
    <MvpEssentials
      onDone={(data: EssentialsData) => {
        setProfile(p => ({
          ...p,
          steuererklaerung: data.steuererklaerung,
          girokonto: data.girokonto,
        }));
        setView('kommunikation');
      }}
      onBack={() => setView('sparziel')}
    />
  );
  if (view === 'kommunikation') return (
    <MvpKommunikation
      onDone={(data: KommunikationData) => {
        setProfile(p => ({
          ...p,
          mobilfunk: data.mobilfunk,
          internet: data.internet,
        }));
        setView('quiz');
      }}
      onBack={() => setView('essentials')}
    />
  );
  if (view === 'loading') return <LoadingScreen onDone={() => setView('results')} />;
  if (view === 'results' && finalProfile) return <MvpDashboard initialProfile={finalProfile} />;

  const slideVariants = {
    enter:  (d: number) => ({ x: d > 0 ?  80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -80 :  80, opacity: 0 }),
  };

  const progressPct = 50 + ((step + 1) / TOTAL) * 50;

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader showProgress progressPct={progressPct} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px 120px' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            style={{ width: '100%', maxWidth: 560 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 60, height: 60, borderRadius: RADIUS_LG,
                background: BLUE_VERY_BRIGHT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <StepIcon size={30} stroke={1.6} color={ACCENT} />
              </div>
              <div style={{
                fontSize: 11, fontWeight: FW_BOLD, color: ACCENT,
                letterSpacing: '0.1em', marginBottom: 8,
              }}>
                FRAGE {step + 1} VON {TOTAL}
              </div>
              <h1 style={{
                fontSize: TEXT_LG + 4, fontWeight: FW_SEMIBOLD,
                color: PRIMARY, lineHeight: 1.25, marginBottom: 8,
                letterSpacing: '-0.01em',
              }}>
                {current.title}
              </h1>
              <p style={{ fontSize: TEXT_SM, color: GREY_800, lineHeight: 1.55, fontWeight: FW_REGULAR }}>
                {current.sub}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {current.options.map(opt => {
                const isSelected = String(currentValue) === String(opt.value);
                const OptIcon = opt.icon;
                return (
                  <motion.button
                    key={String(opt.value)}
                    whileTap={{ scale: 0.98 }}
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
                      background: isSelected ? BLUE_VERY_BRIGHT : WHITE,
                      border: `1.5px solid ${isSelected ? ACCENT : BORDER}`,
                      borderRadius: RADIUS_MD, padding: '14px 16px',
                      display: 'flex', alignItems: 'center', gap: 14,
                      cursor: 'pointer', transition: 'all 0.15s',
                      textAlign: 'left' as const,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: RADIUS_SM,
                      background: isSelected ? ACCENT : GREY_200,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}>
                      <OptIcon size={20} stroke={1.8} color={isSelected ? WHITE : GREY_800} />
                    </div>
                    <span style={{
                      fontSize: TEXT_MD - 1, fontWeight: FW_SEMIBOLD,
                      color: isSelected ? BLUE_DARK : PRIMARY,
                    }}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <div style={{
                        marginLeft: 'auto', flexShrink: 0,
                        width: 22, height: 22, borderRadius: 11,
                        background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IconCheck size={14} stroke={2.5} color={WHITE} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
              {isLast && (
                <button
                  onClick={skip}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: TEXT_XS + 1, color: GREY_700, fontWeight: FW_MEDIUM,
                    padding: '12px 0 4px', textAlign: 'center' as const,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    width: '100%', fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Überspringen <IconArrowRight size={13} stroke={1.5} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <WpBottomNav
        onBack={goBack}
        onNext={goNext}
        nextDisabled={!canNext}
        nextLabel={isLast ? 'Ergebnis anzeigen' : 'Weiter'}
        middle={
          <div style={{ fontSize: 12, color: GREY_800, fontWeight: FW_MEDIUM }}>
            {step + 1} / {TOTAL}
          </div>
        }
      />
    </div>
  );
}
