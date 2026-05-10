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
  energievertraege: boolean;
  girokonto: boolean;
}

const INITIAL: MvpProfile = {
  tenure: '', propertyType: '', heatingType: '', autoType: '', hasChildren: null,
  investitionen: '', sparziel: '', zeitaufwand: '',
  steuererklaerung: false, energievertraege: false, girokonto: false,
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

type View = 'intro' | 'landing' | 'sparziel' | 'essentials' | 'quiz' | 'loading' | 'results';

// Paper plane icon (custom SVG)
function PaperPlaneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 9-18 9 4-9-4-9z" fill="white" />
    </svg>
  );
}

// ── Loading Screen (Plane collecting coins) ──────────────────────
const LOADING_STEPS = [
  'Antworten werden ausgewertet …',
  'Ihr Einsparpotenzial wird berechnet …',
  'Spartipps werden personalisiert …',
  'Ihr Spar-Dashboard wird erstellt …',
];

const COIN_COUNT = 6;
const COIN_VALUE = 50; // € per coin
const LOADING_DURATION = 6200; // ms
const PLANE_RADIUS = 86;
const TRACK_SIZE = 220;

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = React.useState(0);
  const [barPct, setBarPct] = React.useState(0);
  const [angle, setAngle] = React.useState(0); // 0..360 (deg)
  const [collected, setCollected] = React.useState<boolean[]>(() => Array(COIN_COUNT).fill(false));
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    const start = performance.now();
    let rafId: number;
    let lastCollected = Array(COIN_COUNT).fill(false);

    function tick(now: number) {
      const pct = Math.min((now - start) / LOADING_DURATION, 1);
      setBarPct(pct);

      // 1 full lap over the entire duration
      const a = pct * 360;
      setAngle(a);

      // Update collected coins (coin i is at angle (i * 360 / N))
      let changed = false;
      const next = [...lastCollected];
      let s = 0;
      for (let i = 0; i < COIN_COUNT; i++) {
        const coinAngle = (i * 360) / COIN_COUNT;
        if (a >= coinAngle && !next[i]) {
          next[i] = true; changed = true;
        }
        if (next[i]) s += COIN_VALUE;
      }
      if (changed) {
        lastCollected = next;
        setCollected(next);
        setScore(s);
      }

      const stepIdx = Math.min(Math.floor(pct * LOADING_STEPS.length), LOADING_STEPS.length - 1);
      setIdx(stepIdx);

      if (pct < 1) rafId = requestAnimationFrame(tick);
      else setTimeout(onDone, 350);
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
      {/* Track + plane + coins */}
      <div style={{
        position: 'relative',
        width: TRACK_SIZE, height: TRACK_SIZE,
        marginBottom: 24,
      }}>
        {/* Dashed track circle */}
        <svg
          viewBox={`0 0 ${TRACK_SIZE} ${TRACK_SIZE}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <circle
            cx={TRACK_SIZE / 2} cy={TRACK_SIZE / 2} r={PLANE_RADIUS}
            stroke={BLUE_VERY_BRIGHT} strokeWidth="2" strokeDasharray="3 6" fill="none"
          />
        </svg>

        {/* Coins around the circle */}
        {Array.from({ length: COIN_COUNT }).map((_, i) => {
          // angle 0 = top (we use -90 offset because cos/sin start at right)
          const a = ((i * 360) / COIN_COUNT) - 90;
          const rad = (a * Math.PI) / 180;
          const cx = TRACK_SIZE / 2 + PLANE_RADIUS * Math.cos(rad);
          const cy = TRACK_SIZE / 2 + PLANE_RADIUS * Math.sin(rad);
          const isCollected = collected[i];
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                opacity: isCollected ? 0 : 1,
                scale: isCollected ? 1.6 : 1,
                y: isCollected ? -12 : 0,
              }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: cx - 14, top: cy - 14,
                width: 28, height: 28, borderRadius: 14,
                background: 'linear-gradient(135deg, #FFC93C 0%, #F9AA00 100%)',
                color: PRIMARY,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, letterSpacing: '-0.02em',
                boxShadow: '0 2px 6px rgba(249,170,0,0.45), inset 0 -2px 0 rgba(0,0,0,0.06)',
                border: '1.5px solid #ffd75c',
              }}
            >
              €
            </motion.div>
          );
        })}

        {/* Plane wrapper — rotates around centre */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'center',
        }}>
          {/* Plane positioned at top of circle, pointing right (along tangent direction = clockwise) */}
          <div style={{
            position: 'absolute',
            left: TRACK_SIZE / 2,
            top: TRACK_SIZE / 2 - PLANE_RADIUS,
            width: 0, height: 0,
          }}>
            <div style={{
              transform: 'translate(-50%, -50%) rotate(45deg)',
              width: 38, height: 38,
              borderRadius: 19,
              background: PRIMARY,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(36,60,71,0.35)',
            }}>
              <PaperPlaneIcon />
            </div>
          </div>
        </div>

        {/* Collected total in centre */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <motion.div
            key={score}
            initial={{ scale: 1.25, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{
              fontSize: 26, fontWeight: 800, color: PRIMARY,
              letterSpacing: '-0.02em', lineHeight: 1,
            }}
          >
            {score} €
          </motion.div>
          <div style={{
            fontSize: 10, fontWeight: 700, color: GREY_800,
            letterSpacing: '0.08em', marginTop: 6,
          }}>
            EINGESAMMELT
          </div>
        </div>
      </div>

      {/* Step label */}
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
            minHeight: 22,
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
    if (step === 0) { setView('essentials'); return; }
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
          energievertraege: data.energievertraege,
          girokonto: data.girokonto,
        }));
        setView('quiz');
      }}
      onBack={() => setView('sparziel')}
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
