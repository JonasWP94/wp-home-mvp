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
  IconPlus,
  IconMinus,
  IconX,
  IconReceipt,
  IconCreditCard,
  IconWifi,
  IconDeviceMobile,
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
import MvpEssentials, { EssentialsData } from '../MvpEssentials';
import MvpKommunikation, { KommunikationData } from '../MvpKommunikation';
import MvpVersicherungen, { VersicherungenData } from '../MvpVersicherungen';

// ── Types ────────────────────────────────────────────────────────
interface MvpProfile {
  tenure: 'miete' | 'eigentum' | '';
  propertyType: 'wohnung' | 'haus' | '';
  heatingType: 'gas' | 'oel' | 'strom' | 'waermepumpe' | 'weiss_nicht' | '';
  autoType: 'verbrenner' | 'eauto' | 'hybrid' | 'keins' | 'has-vehicles' | '';
  vehicles: { verbrenner: number; eauto: number; hybrid: number };
  hasChildren: boolean | null;
  investitionen: 'keine' | 'gadgets' | 'projekte' | '';
  sparziel: string;
  zeitaufwand: string;
  steuererklaerung: boolean | null;
  girokonto: boolean | null;
  mobilfunk: boolean | null;
  internet: boolean | null;
  haftpflicht: boolean | null;
  hausrat: boolean | null;
  berufsunfaehigkeit: boolean | null;
  gebaeude: boolean | null;
  kfzVersicherung: boolean | null;
}

const INITIAL: MvpProfile = {
  tenure: '', propertyType: '', heatingType: '', autoType: '', hasChildren: null,
  vehicles: { verbrenner: 0, eauto: 0, hybrid: 0 },
  investitionen: '', sparziel: '', zeitaufwand: '',
  steuererklaerung: null, girokonto: null,
  mobilfunk: null, internet: null,
  haftpflicht: null, hausrat: null, berufsunfaehigkeit: null,
  gebaeude: null, kfzVersicherung: null,
};

// ── Step Definitions ─────────────────────────────────────────────
const STEPS = [
  {
    key: 'propertyType' as const,
    icon: IconBuilding,
    title: 'Wohnen Sie in einem Haus oder in einer Wohnung?',
    sub: 'Damit empfehlen wir Ihnen die passenden Spar-Optionen für Ihre Wohnsituation.',
    options: [
      { value: 'haus',    label: 'Haus',    icon: IconHome },
      { value: 'wohnung', label: 'Wohnung', icon: IconBuilding },
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
    skipIf: (p: any) => p.tenure === 'miete',
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
    title: 'Welche/s Fahrzeug/e nutzen Sie?',
    sub: 'Je nach Fahrzeug zeigen wir Ihnen, wie Sie bei Kraftstoff, Versicherung oder Ladestrom sparen.',
    options: [
      { value: 'verbrenner', label: 'Verbrenner', icon: IconCar },
      { value: 'eauto',      label: 'E-Auto',     icon: IconBatteryCharging },
      { value: 'hybrid',     label: 'Hybrid',     icon: IconPlug },
      { value: 'keins',      label: 'Kein Auto',  icon: IconBike },
    ],
  },
];

const TOTAL = STEPS.length;

type View = 'intro' | 'landing' | 'essentials' | 'kommunikation' | 'versicherungen' | 'quiz' | 'loading' | 'results';

// ── Radar Animation ───────────────────────────────────────────────
const BLIPS = [
  { top: '28%', left: '62%', delay: 0.6 },
  { top: '58%', left: '38%', delay: 1.4 },
  { top: '40%', left: '25%', delay: 2.1 },
];

function RadarAnimation() {
  const SIZE = 80;
  const rings = [1, 0.67, 0.34];
  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE, marginBottom: 36 }}>
      {/* Rings */}
      {rings.map((scale, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${((1 - scale) / 2) * 100}%`,
          left: `${((1 - scale) / 2) * 100}%`,
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          borderRadius: '50%',
          border: `1px solid rgba(42,111,166,${0.12 + i * 0.08})`,
        }} />
      ))}

      {/* Sweep */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'conic-gradient(from 0deg, rgba(42,111,166,0.22) 0deg, transparent 70deg)',
        }}
      />

      {/* Blips */}
      {BLIPS.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ delay: b.delay, duration: 0.6, repeat: Infinity, repeatDelay: 2.2 - 0.6 }}
          style={{
            position: 'absolute', top: b.top, left: b.left,
            width: 4, height: 4, borderRadius: 2,
            background: ACCENT,
            boxShadow: `0 0 6px ${ACCENT}`,
          }}
        />
      ))}

      {/* Center dot */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 4, height: 4, borderRadius: 2,
        background: ACCENT, opacity: 0.7,
      }} />
    </div>
  );
}

// ── Loading Screen ────────────────────────────────────────────────
const LOADING_STEPS = [
  'Antworten werden ausgewertet …',
  'Sparmaßnahmen werden gesucht …',
  'Ihr Spar-Dashboard wird erstellt …',
];

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = React.useState(0);
  const [barPct, setBarPct] = React.useState(0);

  React.useEffect(() => {
    const duration = 4000;
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
      <style>{`
        @keyframes wp-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
      `}</style>

      {/* Radar */}
      <RadarAnimation />

      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          style={{
            fontSize: TEXT_MD, fontWeight: FW_SEMIBOLD,
            color: PRIMARY, marginBottom: 28, textAlign: 'center',
          }}
        >
          {LOADING_STEPS[idx]}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar with shimmer */}
      <div style={{
        width: '100%', maxWidth: 280, height: 5,
        background: BORDER, borderRadius: 3, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: `linear-gradient(90deg, ${ACCENT} 0%, #4b9fd4 100%)`,
          borderRadius: 3,
          width: `${barPct * 100}%`,
          transition: 'width 0.05s linear',
          position: 'relative', overflow: 'hidden',
          boxShadow: `0 0 8px rgba(42,111,166,0.5)`,
        }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            width: '30%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
            animation: 'wp-shimmer 1.4s infinite',
          }} />
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
  const isVehicleStep = current.key === 'autoType';
  const vehicleTotal = profile.vehicles.verbrenner + profile.vehicles.eauto + profile.vehicles.hybrid;
  const canNext = isVehicleStep
    ? (profile.autoType === 'keins' || vehicleTotal > 0)
    : (currentValue !== '' && currentValue !== null && currentValue !== undefined);

  // Compute effective step list & navigation considering skipIf
  function isStepActive(s: any, p: MvpProfile) {
    return !(s as any).skipIf || !(s as any).skipIf(p);
  }
  function findNextStep(from: number, p: MvpProfile) {
    for (let i = from + 1; i < STEPS.length; i++) if (isStepActive(STEPS[i], p)) return i;
    return -1;
  }
  function findPrevStep(from: number, p: MvpProfile) {
    for (let i = from - 1; i >= 0; i--) if (isStepActive(STEPS[i], p)) return i;
    return -1;
  }
  const nextIdx = findNextStep(step, profile);
  const isLast = nextIdx === -1;
  const StepIcon = current.icon;

  function setVehicleCount(type: 'verbrenner' | 'eauto' | 'hybrid', delta: number) {
    setProfile(p => {
      const newVehicles = { ...p.vehicles, [type]: Math.max(0, p.vehicles[type] + delta) };
      const total = newVehicles.verbrenner + newVehicles.eauto + newVehicles.hybrid;
      return { ...p, vehicles: newVehicles, autoType: total > 0 ? 'has-vehicles' : '' };
    });
  }

  function setNoVehicle() {
    setProfile(p => ({ ...p, autoType: 'keins', vehicles: { verbrenner: 0, eauto: 0, hybrid: 0 } }));
  }

  function select(val: any) {
    setProfile(p => ({ ...p, [current.key]: val }));
  }

  function quizDone(fp: MvpProfile) {
    setProfile(fp);
    setView('essentials');
  }

  function goNext() {
    if (!canNext) return;
    if (isLast) { quizDone(profile); return; }
    setDir(1);
    setStep(nextIdx);
  }

  function skip() {
    if (isLast) { quizDone(profile); return; }
    setDir(1);
    setStep(nextIdx);
  }

  function goBack() {
    const prev = findPrevStep(step, profile);
    if (prev === -1) { setView('landing'); return; }
    setDir(-1);
    setStep(prev);
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
  if (view === 'landing') return <MvpHomeLanding onStart={() => setView('quiz')} onBack={() => setView('intro')} />;
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
      onBack={() => setView('quiz')}
    />
  );
  if (view === 'kommunikation') return (
    <MvpKommunikation
      onDone={(data: KommunikationData) => {
        setProfile(p => ({ ...p, mobilfunk: data.mobilfunk, internet: data.internet }));
        setView('versicherungen');
      }}
      onBack={() => setView('essentials')}
    />
  );
  if (view === 'versicherungen') {
    const hasVehicle = profile.autoType !== 'keins' && (
      profile.vehicles.verbrenner + profile.vehicles.eauto + profile.vehicles.hybrid > 0
      || (profile.autoType !== '' && profile.autoType !== 'keins')
    );
    return (
      <MvpVersicherungen
        showGebaeude={profile.propertyType === 'haus' && profile.tenure === 'eigentum'}
        showKfz={hasVehicle}
        onDone={(data: VersicherungenData) => {
          const fp = {
            ...profile,
            haftpflicht: data.haftpflicht,
            hausrat: data.hausrat,
            berufsunfaehigkeit: data.berufsunfaehigkeit,
            gebaeude: data.gebaeude ?? null,
            kfzVersicherung: data.kfzVersicherung ?? null,
          };
          localStorage.setItem('wpilot_mvp_profile', JSON.stringify(fp));
          setProfile(fp);
          setFinalProfile(fp);
          setView('loading');
        }}
        onBack={() => setView('kommunikation')}
      />
    );
  }
  if (view === 'loading') return <LoadingScreen onDone={() => setView('results')} />;
  if (view === 'results' && finalProfile) return <MvpDashboard initialProfile={finalProfile} />;

  const slideVariants = {
    enter:  (d: number) => ({ x: d > 0 ?  80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -80 :  80, opacity: 0 }),
  };

  // Effective step counts skipping inactive (e.g. heating for Mieter)
  const activeSteps = STEPS.filter(s => isStepActive(s, profile));
  const activeIdx = activeSteps.findIndex(s => s.key === current.key);
  const effectiveTotal = activeSteps.length;
  const effectiveStep = activeIdx >= 0 ? activeIdx + 1 : step + 1;
  const progressPct = 10 + (effectiveStep / effectiveTotal) * 85;

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader showProgress progressPct={progressPct} />

      <div className="wp-page-quiz" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 120px' }}>
        <style>{`@media(min-width:640px){.wp-page-quiz{padding:32px 24px 120px !important;}}`}</style>
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
                FRAGE {effectiveStep} VON {effectiveTotal}
              </div>
              <h1 style={{
                fontSize: TEXT_LG + 4, fontWeight: FW_SEMIBOLD,
                color: PRIMARY, lineHeight: 1.25, marginBottom: 8,
                letterSpacing: '-0.01em',
              }}>
                {current.title}
              </h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {isVehicleStep ? (
                <VehicleSelector
                  vehicles={profile.vehicles}
                  noVehicle={profile.autoType === 'keins'}
                  onIncrement={(t) => setVehicleCount(t, +1)}
                  onDecrement={(t) => setVehicleCount(t, -1)}
                  onNoVehicle={setNoVehicle}
                />
              ) : current.options.map(opt => {
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
                        const updatedProfile = { ...profile, [current.key]: val };
                        const nIdx = findNextStep(step, updatedProfile);
                        if (nIdx === -1) {
                          quizDone(updatedProfile);
                        } else {
                          setDir(1);
                          setStep(nIdx);
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
            {effectiveStep} / {effectiveTotal}
          </div>
        }
      />
    </div>
  );
}

// ── Vehicle Selector (multi-select with counts) ──────────────────
type VehicleType = 'verbrenner' | 'eauto' | 'hybrid';

const VEHICLE_OPTS: { type: VehicleType; label: string; icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }> }[] = [
  { type: 'verbrenner', label: 'Verbrenner', icon: IconCar },
  { type: 'eauto',      label: 'E-Auto',     icon: IconBatteryCharging },
  { type: 'hybrid',     label: 'Hybrid',     icon: IconPlug },
];

function VehicleSelector({
  vehicles, noVehicle, onIncrement, onDecrement, onNoVehicle,
}: {
  vehicles: { verbrenner: number; eauto: number; hybrid: number };
  noVehicle: boolean;
  onIncrement: (t: VehicleType) => void;
  onDecrement: (t: VehicleType) => void;
  onNoVehicle: () => void;
}) {
  return (
    <>
      {VEHICLE_OPTS.map(opt => {
        const count = vehicles[opt.type];
        const isSelected = count > 0;
        const OptIcon = opt.icon;
        return (
          <div
            key={opt.type}
            onClick={() => { if (!isSelected) onIncrement(opt.type); }}
            style={{
              width: '100%',
              background: isSelected ? BLUE_VERY_BRIGHT : WHITE,
              border: `1.5px solid ${isSelected ? ACCENT : BORDER}`,
              borderRadius: RADIUS_MD, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
              cursor: isSelected ? 'default' : 'pointer', transition: 'all 0.15s',
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
              flex: 1,
              fontSize: TEXT_MD - 1, fontWeight: FW_SEMIBOLD,
              color: isSelected ? BLUE_DARK : PRIMARY,
            }}>
              {opt.label}
            </span>
            {isSelected ? (
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: WHITE, borderRadius: 999, padding: '4px',
                  border: `1px solid ${ACCENT}`,
                }}
              >
                <button
                  onClick={() => onDecrement(opt.type)}
                  style={{
                    width: 28, height: 28, borderRadius: 14, border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: ACCENT,
                  }}
                >
                  <IconMinus size={16} stroke={2.5} />
                </button>
                <span style={{
                  minWidth: 20, textAlign: 'center',
                  fontSize: 15, fontWeight: FW_BOLD, color: BLUE_DARK,
                }}>
                  {count}
                </span>
                <button
                  onClick={() => onIncrement(opt.type)}
                  style={{
                    width: 28, height: 28, borderRadius: 14, border: 'none',
                    background: ACCENT, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: WHITE,
                  }}
                >
                  <IconPlus size={16} stroke={2.5} />
                </button>
              </div>
            ) : (
              <span style={{ fontSize: 12, color: GREY_700, fontWeight: FW_MEDIUM }}>
                Hinzufügen
              </span>
            )}
          </div>
        );
      })}

      {/* Kein Auto - mutually exclusive */}
      <div
        onClick={onNoVehicle}
        style={{
          width: '100%',
          background: noVehicle ? BLUE_VERY_BRIGHT : WHITE,
          border: `1.5px solid ${noVehicle ? ACCENT : BORDER}`,
          borderRadius: RADIUS_MD, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 14,
          cursor: 'pointer', transition: 'all 0.15s',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: RADIUS_SM,
          background: noVehicle ? ACCENT : GREY_200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <IconBike size={20} stroke={1.8} color={noVehicle ? WHITE : GREY_800} />
        </div>
        <span style={{
          flex: 1,
          fontSize: TEXT_MD - 1, fontWeight: FW_SEMIBOLD,
          color: noVehicle ? BLUE_DARK : PRIMARY,
        }}>
          Kein Auto
        </span>
        {noVehicle && (
          <div style={{
            flexShrink: 0,
            width: 22, height: 22, borderRadius: 11,
            background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconCheck size={14} stroke={2.5} color={WHITE} />
          </div>
        )}
      </div>
    </>
  );
}
