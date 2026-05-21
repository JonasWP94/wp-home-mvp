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
  IconArrowLeft,
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
import MvpBasics, { BasicsData } from '../MvpBasics';
import MvpFriendInvite from '../MvpFriendInvite';
import { useReducedMotion } from '../_useReducedMotion';
import type { MvpProfile } from '../_types';
import { INITIAL_PROFILE as INITIAL } from '../_types';

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

type View = 'intro' | 'landing' | 'basics' | 'quiz' | 'loading' | 'results' | 'invite';

// ── Radar Animation ───────────────────────────────────────────────
const BLIPS = [
  { top: '28%', left: '62%', delay: 0.6 },
  { top: '58%', left: '38%', delay: 1.4 },
  { top: '40%', left: '25%', delay: 2.1 },
];

function RadarAnimation() {
  const SIZE = 140;
  const reduced = useReducedMotion();
  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
      {/* Outer pulse rings (skipped when reduced motion) */}
      {!reduced && [0, 1, 2].map(i => (
        <motion.div
          key={`pulse-${i}`}
          initial={{ scale: 0.4, opacity: 0.6 }}
          animate={{ scale: 1.05, opacity: 0 }}
          transition={{
            repeat: Infinity,
            duration: 2.4,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `1.5px solid ${ACCENT}`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Static faint inner rings */}
      {[0.62, 0.38].map((scale, i) => (
        <div key={`ring-${i}`} style={{
          position: 'absolute',
          top: `${((1 - scale) / 2) * 100}%`,
          left: `${((1 - scale) / 2) * 100}%`,
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          borderRadius: '50%',
          border: `1px dashed rgba(42,111,166,0.18)`,
        }} />
      ))}

      {/* Conic gradient sweep */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2.6, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `conic-gradient(from 0deg,
            rgba(42,111,166,0.35) 0deg,
            rgba(42,111,166,0.16) 30deg,
            transparent 80deg,
            transparent 360deg)`,
          maskImage: 'radial-gradient(circle, black 30%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle, black 30%, black 100%)',
        }}
      />

      {/* Blips */}
      {[
        { top: '24%', left: '64%', delay: 0.4 },
        { top: '58%', left: '38%', delay: 1.2 },
        { top: '42%', left: '24%', delay: 2.0 },
      ].map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0] }}
          transition={{ delay: b.delay, duration: 0.8, repeat: Infinity, repeatDelay: 1.8 }}
          style={{
            position: 'absolute', top: b.top, left: b.left,
            width: 6, height: 6, borderRadius: 3,
            background: ACCENT,
            boxShadow: `0 0 12px ${ACCENT}, 0 0 4px ${ACCENT}`,
          }}
        />
      ))}

      {/* Center disc with pulse */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          marginTop: -6, marginLeft: -6,
          width: 12, height: 12, borderRadius: 6,
          background: ACCENT,
          boxShadow: `0 0 16px rgba(42,111,166,0.55)`,
        }}
      />
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
  const [exiting, setExiting] = React.useState(false);

  React.useEffect(() => {
    const duration = 2800;
    const start = performance.now();
    let rafId: number;

    function tick(now: number) {
      const pct = Math.min((now - start) / duration, 1);
      setBarPct(pct);
      const stepIdx = Math.max(0, Math.min(Math.floor(pct * LOADING_STEPS.length), LOADING_STEPS.length - 1));
      setIdx(stepIdx);
      if (pct < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Brief hold, then fade out, then unmount
        setTimeout(() => setExiting(true), 150);
        setTimeout(onDone, 460);
      }
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <motion.div
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
      minHeight: '100dvh',
      background: `radial-gradient(ellipse at top, rgba(42,111,166,0.06) 0%, ${BG} 60%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', fontFamily: "'Poppins', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes wp-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
      `}</style>

      {/* Decorative grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(42,111,166,0.08) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        opacity: 0.5,
        maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 32, width: '100%', maxWidth: 420,
      }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: 11, fontWeight: FW_BOLD, color: ACCENT,
            letterSpacing: '0.16em',
          }}
        >
          IHR PERSÖNLICHER SPARPLAN
        </motion.div>

        {/* Radar */}
        <RadarAnimation />

        {/* Step text */}
        <div style={{ minHeight: 56, textAlign: 'center', position: 'relative', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%' }}
            >
              <div style={{
                fontSize: 19, fontWeight: FW_BOLD,
                color: PRIMARY, letterSpacing: '-0.01em', lineHeight: 1.3,
                marginBottom: 6,
              }}>
                {(LOADING_STEPS[idx] ?? LOADING_STEPS[0]).replace(/ …$/, '')}
              </div>
              <div style={{
                fontSize: 12, fontWeight: FW_MEDIUM,
                color: GREY_800, opacity: 0.7,
              }}>
                Schritt {idx + 1} von {LOADING_STEPS.length}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Segmented progress bar — each segment fills progressively during its step */}
        <div style={{ width: '100%', maxWidth: 320, display: 'flex', gap: 6 }}>
          {LOADING_STEPS.map((_, i) => {
            // Each segment's fill (0..1) — based on overall barPct sliced into N parts
            const segPct = Math.max(0, Math.min(1, barPct * LOADING_STEPS.length - i));
            const isActive = i === idx;
            return (
              <div
                key={i}
                style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: 'rgba(42,111,166,0.18)',
                  overflow: 'hidden', position: 'relative',
                  boxShadow: isActive && segPct < 1 ? '0 0 12px rgba(42,111,166,0.55)' : 'none',
                  transition: 'box-shadow 0.3s',
                }}
              >
                {/* Filling part */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, left: 0,
                  width: `${segPct * 100}%`,
                  background: ACCENT,
                  borderRadius: 3,
                  transition: 'width 0.05s linear',
                  overflow: 'hidden',
                }}>
                  {isActive && segPct < 1 && (
                    <div style={{
                      position: 'absolute', top: 0, bottom: 0,
                      width: '50%', right: '-10%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                      animation: 'wp-shimmer 1.2s infinite',
                    }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ── Dev Navigation Bar (DEV only) ────────────────────────────────
const DEV_VIEWS = [
  { label: 'ThankYou',  view: 'intro'    as View, step: -1 },
  { label: 'Invite',    view: 'invite'   as View, step: -1 },
  { label: 'Landing',   view: 'landing'  as View, step: -1 },
  { label: 'Q1 Haus?',  view: 'quiz'     as View, step: 0  },
  { label: 'Q2 Miete?', view: 'quiz'     as View, step: 1  },
  { label: 'Q3 Heizung',view: 'quiz'     as View, step: 2  },
  { label: 'Q4 Auto',   view: 'quiz'     as View, step: 3  },
  { label: 'Basics',    view: 'basics'   as View, step: -1 },
  { label: 'Loading',   view: 'loading'  as View, step: -1 },
  { label: 'Results',   view: 'results'  as View, step: -1 },
];

function DevNav({
  currentView, currentStep, jump,
}: {
  currentView: View;
  currentStep: number;
  jump: (v: View, s: number) => void;
}) {
  const [open, setOpen] = React.useState(true);
  if (!import.meta.env.DEV) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      fontFamily: 'monospace',
    }}>
      <div style={{
        background: '#111827',
        display: 'flex', alignItems: 'center',
        padding: '0 8px', gap: 4,
        height: open ? 34 : 22,
        transition: 'height 0.15s',
        overflow: 'hidden',
      }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            background: '#374151', border: 'none', color: '#9ca3af',
            borderRadius: 4, padding: '2px 7px', fontSize: 10,
            cursor: 'pointer', fontFamily: 'monospace', flexShrink: 0,
            lineHeight: 1.6,
          }}
        >
          {open ? '▲ DEV' : '▼ DEV'}
        </button>
        {open && DEV_VIEWS.map(({ label, view, step }) => {
          const isActive = currentView === view && (view !== 'quiz' || currentStep === step);
          return (
            <button
              key={`${view}-${step}`}
              onClick={() => jump(view, step)}
              style={{
                background: isActive ? '#2563eb' : '#1f2937',
                border: `1px solid ${isActive ? '#3b82f6' : '#374151'}`,
                color: isActive ? '#fff' : '#9ca3af',
                borderRadius: 4, padding: '2px 8px', fontSize: 11,
                cursor: 'pointer', fontFamily: 'monospace',
                whiteSpace: 'nowrap', lineHeight: 1.6,
              }}
            >
              {label}
            </button>
          );
        })}
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

  function devJump(v: View, s: number) {
    if (v === 'results') setFinalProfile(profile);
    if (s >= 0) setStep(s);
    setView(v);
  }
  const devNav = <DevNav currentView={view} currentStep={step} jump={devJump} />;

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
    setView('basics');
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

  if (view === 'intro') return <>{devNav}<MvpThankYou onStart={() => setView('landing')} onInviteFriends={() => setView('invite')} /></>;
  if (view === 'invite') return <>{devNav}<MvpFriendInvite onBack={() => setView('intro')} /></>;
  if (view === 'landing') return <>{devNav}<MvpHomeLanding onStart={() => setView('quiz')} onBack={() => setView('intro')} /></>;
  if (view === 'basics') {
    return (
      <>{devNav}<MvpBasics
        initial={{
          steuererklaerung: profile.steuererklaerung ?? false,
          girokonto:        profile.girokonto        ?? false,
          internet:         profile.internet         ?? false,
          mobilfunk:        profile.mobilfunk        ?? false,
        }}
        onDone={(data: BasicsData) => {
          const fp = {
            ...profile,
            steuererklaerung: data.steuererklaerung,
            girokonto:        data.girokonto,
            internet:         data.internet,
            mobilfunk:        data.mobilfunk,
          };
          localStorage.setItem('wpilot_mvp_profile', JSON.stringify(fp));
          setProfile(fp);
          setFinalProfile(fp);
          setView('loading');
        }}
        onBack={() => setView('quiz')}
      /></>
    );
  }
  if (view === 'loading') return <>{devNav}<LoadingScreen onDone={() => setView('results')} /></>;
  if (view === 'results' && finalProfile) return <>{devNav}<MvpDashboard initialProfile={finalProfile} /></>;

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
    <>{devNav}
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader showProgress progressPct={progressPct} />

      <div className="wp-page-quiz" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 96px' }}>
        <style>{`@media(min-width:640px){.wp-page-quiz{padding:32px 24px 56px !important;}}`}</style>
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
              ) : (
                <div
                  className={current.key === 'heatingType' ? 'wp-opts-grid' : undefined}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <style>{`@media(min-width:520px){.wp-opts-grid{display:grid !important;grid-template-columns:repeat(2,1fr) !important;gap:8px !important;}}`}</style>
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
                      gridColumn: opt.value === 'weiss_nicht' ? '1 / -1' : undefined,
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
                </div>
              )}
              {/* Navigation row — inline on desktop, sticky bottom bar on mobile */}
              <style>{`
                .wp-quiz-nav{
                  position:fixed;left:0;right:0;bottom:0;z-index:50;
                  background:rgba(244,246,250,0.96);
                  backdrop-filter:blur(10px);
                  -webkit-backdrop-filter:blur(10px);
                  border-top:1px solid ${BORDER};
                  padding:10px 16px calc(10px + env(safe-area-inset-bottom));
                  margin-top:0 !important;
                }
                @media(min-width:640px){
                  .wp-quiz-nav{
                    position:static;left:auto;right:auto;bottom:auto;
                    background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none;
                    border-top:none;
                    padding:0;
                    margin-top:14px !important;
                  }
                }
              `}</style>
              <div className="wp-quiz-nav" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginTop: 14,
              }}>
                <button
                  onClick={goBack}
                  aria-label="Zurück"
                  style={{
                    flex: '0 0 auto',
                    width: 44, height: 44,
                    background: WHITE, color: PRIMARY,
                    border: `1.5px solid ${BORDER}`,
                    borderRadius: 999,
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <IconArrowLeft size={16} stroke={2.4} />
                </button>
                <div style={{ flex: 1 }} />
                <button
                  onClick={skip}
                  style={{
                    flex: '0 0 auto',
                    background: 'transparent', color: GREY_700,
                    border: 'none',
                    borderRadius: 999, padding: '11px 14px',
                    fontSize: 13, fontWeight: FW_MEDIUM,
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}
                >
                  Überspringen <IconArrowRight size={13} stroke={1.8} />
                </button>
                <button
                  onClick={goNext}
                  disabled={!canNext}
                  style={{
                    flex: '0 0 auto',
                    background: canNext ? PRIMARY : GREY_200,
                    color: canNext ? WHITE : GREY_700,
                    border: 'none',
                    borderRadius: 999, padding: '11px 22px',
                    fontSize: 13, fontWeight: FW_BOLD,
                    cursor: canNext ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    boxShadow: canNext ? '0 2px 8px rgba(36,60,71,0.25)' : 'none',
                    transition: 'background 0.15s',
                  }}
                >
                  Weiter <IconArrowRight size={14} stroke={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    </>
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
