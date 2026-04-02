# Smart Onboarding Quiz — React Component Spezifikation

**Projekt:** Wechselpilot Home  
**Erstellt:** 2026-04-02  
**Für:** Integration in WP Home (React + Vite + Framer Motion)  

---

## 1. Komponenten-Architektur

```
src/
├── components/
│   └── OnboardingQuiz/
│       ├── index.tsx              ← Haupt-Export, Quiz-Container mit State
│       ├── QuizFlow.tsx           ← 5-Step-Flow mit Navigation
│       ├── ResultPage.tsx         ← Ergebnisseite mit Animationen
│       ├── steps/
│       │   ├── StepHousehold.tsx  ← Frage 1: Haushaltsgröße
│       │   ├── StepAnbieter.tsx   ← Frage 2: Aktueller Anbieter
│       │   ├── StepVerbrauch.tsx  ← Frage 3: Verbrauch (Slider)
│       │   ├── StepPLZ.tsx        ← Frage 4: Postleitzahl
│       │   └── StepWohnung.tsx    ← Frage 5: Wohnsituation
│       ├── SparBadge.tsx          ← Stern-Badge-Komponente
│       ├── ConfettiExplosion.tsx   ← Confetti (bereits vorhanden in Wizard)
│       ├── quizCalculation.ts     ← Berechnungslogik (pure functions)
│       └── quizTypes.ts           ← TypeScript Interfaces
```

---

## 2. TypeScript Interfaces

```typescript
// quizTypes.ts

export type HouseholdSize = 1 | 2 | 3 | 4;

export type Anbieter = 
  | 'vattenfall' | 'eon' | 'enbw' | 'edis' 
  | 'stadtwerke' | 'rwe' | 'ewe' | 'swm' | 'sonstige';

export type Wohnform = 'wohnung' | 'haus';
export type Eigentum = 'miete' | 'eigentum';

export interface QuizData {
  household: HouseholdSize;
  anbieter: Anbieter;
  kwh: number;
  plz: string;
  wohnform: Wohnform;
  eigentum: Eigentum;
}

export interface QuizResult {
  stromSparen: number;
  gasSparen: number;
  bonus: number;
  gesamt: number;
  stars: 1 | 2 | 3 | 4 | 5;
  badgeLabel: { text: string; sub: string };
  region: string;
  hasGas: boolean;
}

export interface QuizStep {
  title: string;
  icon: string;
  validate: (data: Partial<QuizData>) => boolean;
}
```

---

## 3. Berechnungsmodul

```typescript
// quizCalculation.ts

import { QuizData, QuizResult, Anbieter } from './quizTypes';

// ── Öffentliche Tarifdaten (Q1 2026, Verivox/BDEW) ─────
const TARIFF = {
  strom: {
    grundversorgung: 0.382,  // €/kWh
    guenstigster: 0.275,     // €/kWh
    wp_target: 0.289,        // €/kWh – WP Zielpreis
  },
  gas: {
    grundversorgung: 0.125,  // €/kWh
    wp_target: 0.103,        // €/kWh
  },
  wechselbonus: 20,
} as const;

const ANBIETER_FAKTOR: Record<Anbieter, number> = {
  vattenfall: 1.08,
  eon: 0.98,
  enbw: 0.95,
  edis: 1.10,
  stadtwerke: 1.05,
  rwe: 0.97,
  ewe: 1.03,
  swm: 1.02,
  sonstige: 1.00,
};

const PLZ_FAKTOR: Record<string, number> = {
  '0': 1.08, '1': 1.06, '2': 1.03, '3': 1.00, '4': 0.98,
  '5': 0.98, '6': 0.99, '7': 0.97, '8': 0.95, '9': 0.96,
};

const PLZ_REGION: Record<string, string> = {
  '0': 'Sachsen/Thüringen', '1': 'Berlin/Brandenburg',
  '2': 'Hamburg/Schleswig-Holstein', '3': 'Niedersachsen/Hessen',
  '4': 'NRW', '5': 'Rheinland', '6': 'Hessen/Saarland',
  '7': 'Baden-Württemberg', '8': 'Bayern (Süd)', '9': 'Franken',
};

const DEFAULT_KWH: Record<number, number> = {
  1: 1500, 2: 2500, 3: 3500, 4: 4500,
};

const GAS_KWH: Record<string, number> = {
  wohnung_miete: 0,
  wohnung_eigentum: 0,
  haus_miete: 0,
  haus_eigentum: 18000,
};

export function getDefaultKwh(household: number): number {
  return DEFAULT_KWH[household] || 2500;
}

export function calculateSavings(data: QuizData): QuizResult {
  const af = ANBIETER_FAKTOR[data.anbieter] || 1.0;
  const pf = PLZ_FAKTOR[data.plz.charAt(0)] || 1.0;
  const region = PLZ_REGION[data.plz.charAt(0)] || 'Deutschland';

  // Strom
  const aktuellerStrom = data.kwh * TARIFF.strom.grundversorgung * af * pf;
  const optimalerStrom = data.kwh * TARIFF.strom.wp_target;
  const stromSparen = Math.max(0, Math.round(aktuellerStrom - optimalerStrom));

  // Gas
  const gasKey = `${data.wohnform}_${data.eigentum}`;
  const gasKwh = GAS_KWH[gasKey] || 0;
  let gasSparen = 0;
  if (gasKwh > 0) {
    const aktuellerGas = gasKwh * TARIFF.gas.grundversorgung * pf;
    const optimalerGas = gasKwh * TARIFF.gas.wp_target;
    gasSparen = Math.max(0, Math.round(aktuellerGas - optimalerGas));
  }

  const bonus = TARIFF.wechselbonus;
  const gesamt = stromSparen + gasSparen + bonus;

  // Badge
  let stars: 1 | 2 | 3 | 4 | 5 = 1;
  if (gesamt >= 100) stars = 2;
  if (gesamt >= 200) stars = 3;
  if (gesamt >= 350) stars = 4;
  if (gesamt >= 500) stars = 5;

  const badgeLabels: Record<number, { text: string; sub: string }> = {
    1: { text: 'Geringes Sparpotenzial', sub: 'Dein Tarif ist schon recht günstig' },
    2: { text: 'Moderates Sparpotenzial', sub: 'Da geht noch was!' },
    3: { text: 'Gutes Sparpotenzial', sub: 'Du lässt Geld auf dem Tisch liegen' },
    4: { text: 'Überdurchschnittliches Sparpotenzial', sub: 'Dein Tarif ist deutlich zu teuer!' },
    5: { text: 'Herausragendes Sparpotenzial!', sub: 'Du zahlst viel zu viel — jetzt wechseln!' },
  };

  return {
    stromSparen,
    gasSparen,
    bonus,
    gesamt,
    stars,
    badgeLabel: badgeLabels[stars],
    region,
    hasGas: gasKwh > 0,
  };
}

/**
 * Encode quiz data for shareable/bookmarkable URL
 */
export function encodeQuizResult(data: QuizData, result: QuizResult): string {
  return btoa(JSON.stringify({
    ...data,
    result: result.gesamt,
    stars: result.stars,
  }));
}

/**
 * Decode quiz data from URL parameter
 */
export function decodeQuizResult(encoded: string): QuizData | null {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

/**
 * Build pre-fill params for signup flow
 */
export function buildSignupParams(data: QuizData, result: QuizResult): URLSearchParams {
  return new URLSearchParams({
    quiz: '1',
    hg: String(data.household),
    anbieter: data.anbieter,
    kwh: String(data.kwh),
    plz: data.plz,
    wohn: `${data.wohnform}_${data.eigentum}`,
    prognose: String(result.gesamt),
  });
}
```

---

## 4. Haupt-Komponente

```typescript
// OnboardingQuiz/index.tsx

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { QuizData, QuizResult, HouseholdSize, Anbieter, Wohnform, Eigentum } from './quizTypes';
import { calculateSavings, decodeQuizResult, getDefaultKwh } from './quizCalculation';
import QuizFlow from './QuizFlow';
import ResultPage from './ResultPage';

interface OnboardingQuizProps {
  /** Called when user clicks signup CTA */
  onSignup?: (data: QuizData, result: QuizResult) => void;
  /** Called when quiz completes (for analytics) */
  onComplete?: (data: QuizData, result: QuizResult) => void;
  /** Pre-fill from WP Home store */
  initialData?: Partial<QuizData>;
  /** Embed mode (hide branding, compact) */
  embedded?: boolean;
}

type QuizView = 'quiz' | 'result';

export default function OnboardingQuiz({
  onSignup,
  onComplete,
  initialData,
  embedded = false,
}: OnboardingQuizProps) {
  const [view, setView] = useState<QuizView>('quiz');
  const [data, setData] = useState<Partial<QuizData>>({
    kwh: 2500,
    ...initialData,
  });
  const [result, setResult] = useState<QuizResult | null>(null);

  // Check for bookmark in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('r');
    if (r) {
      const decoded = decodeQuizResult(r);
      if (decoded) {
        setData(decoded);
        const res = calculateSavings(decoded as QuizData);
        setResult(res);
        setView('result');
      }
    }
  }, []);

  const handleQuizComplete = useCallback((quizData: QuizData) => {
    const res = calculateSavings(quizData);
    setData(quizData);
    setResult(res);
    setView('result');
    onComplete?.(quizData, res);
  }, [onComplete]);

  const handleSignup = useCallback(() => {
    if (data && result) {
      onSignup?.(data as QuizData, result);
    }
  }, [data, result, onSignup]);

  const handleRestart = useCallback(() => {
    setView('quiz');
    setData({ kwh: 2500 });
    setResult(null);
  }, []);

  return (
    <div style={{
      width: '100%',
      maxWidth: 520,
      margin: '0 auto',
      fontFamily: 'Poppins, -apple-system, sans-serif',
    }}>
      <AnimatePresence mode="wait">
        {view === 'quiz' ? (
          <QuizFlow
            key="quiz"
            initialData={data}
            onComplete={handleQuizComplete}
            embedded={embedded}
          />
        ) : (
          <ResultPage
            key="result"
            data={data as QuizData}
            result={result!}
            onSignup={handleSignup}
            onRestart={handleRestart}
            embedded={embedded}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## 5. QuizFlow Komponente

```typescript
// QuizFlow.tsx

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizData, HouseholdSize, Anbieter, Wohnform, Eigentum } from './quizTypes';
import { getDefaultKwh } from './quizCalculation';
import StepHousehold from './steps/StepHousehold';
import StepAnbieter from './steps/StepAnbieter';
import StepVerbrauch from './steps/StepVerbrauch';
import StepPLZ from './steps/StepPLZ';
import StepWohnung from './steps/StepWohnung';

const STEPS = [
  { title: 'Haushaltsgröße', icon: '👥' },
  { title: 'Stromanbieter', icon: '⚡' },
  { title: 'Verbrauch', icon: '📊' },
  { title: 'Postleitzahl', icon: '📍' },
  { title: 'Wohnsituation', icon: '🏠' },
];

interface QuizFlowProps {
  initialData: Partial<QuizData>;
  onComplete: (data: QuizData) => void;
  embedded?: boolean;
}

export default function QuizFlow({ initialData, onComplete, embedded }: QuizFlowProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [data, setData] = useState<Partial<QuizData>>(initialData);

  const update = useCallback((patch: Partial<QuizData>) => {
    setData(prev => ({ ...prev, ...patch }));
  }, []);

  const isValid = useCallback((): boolean => {
    switch (step) {
      case 0: return !!data.household;
      case 1: return !!data.anbieter;
      case 2: return (data.kwh || 0) > 0;
      case 3: return /^\d{5}$/.test(data.plz || '');
      case 4: return !!data.wohnform && !!data.eigentum;
      default: return false;
    }
  }, [step, data]);

  const next = useCallback(() => {
    if (!isValid()) return;
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      onComplete(data as QuizData);
    }
  }, [step, data, isValid, onComplete]);

  const back = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  }, [step]);

  const pct = (step / (STEPS.length - 1)) * 100;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 580,
      }}
    >
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)',
        padding: '20px 24px 16px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.06)' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative', zIndex: 1 }}>
          {!embedded && <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, letterSpacing: '0.05em' }}>⚡ Wechselpilot</div>}
          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>⏱ ~60 Sekunden</div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, marginBottom: 2 }}>
            Schritt {step + 1} von {STEPS.length}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            {STEPS[step].icon} {STEPS[step].title}
          </div>
        </div>

        {/* Progress */}
        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)', marginTop: 14, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <motion.div
            style={{ height: '100%', borderRadius: 3, background: 'white' }}
            animate={{ width: pct + '%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              style={{ width: 8, height: 8, borderRadius: 4 }}
              animate={{
                scale: i === step ? 1.3 : 1,
                background: i < step ? '#fff' : i === step ? '#fff' : 'rgba(255,255,255,0.3)',
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* ── Body (step content) ── */}
      <div style={{ flex: 1, padding: 24, overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {step === 0 && (
              <StepHousehold
                value={data.household}
                onChange={(v) => {
                  update({ household: v, kwh: getDefaultKwh(v) });
                }}
              />
            )}
            {step === 1 && (
              <StepAnbieter
                value={data.anbieter}
                onChange={(v) => update({ anbieter: v })}
              />
            )}
            {step === 2 && (
              <StepVerbrauch
                value={data.kwh || 2500}
                household={data.household || 2}
                onChange={(v) => update({ kwh: v })}
              />
            )}
            {step === 3 && (
              <StepPLZ
                value={data.plz || ''}
                onChange={(v) => update({ plz: v })}
              />
            )}
            {step === 4 && (
              <StepWohnung
                wohnform={data.wohnform}
                eigentum={data.eigentum}
                onWohnform={(v) => update({ wohnform: v })}
                onEigentum={(v) => update({ eigentum: v })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '16px 24px 20px',
        display: 'flex',
        gap: 10,
        borderTop: '1px solid #f3f3f5',
      }}>
        {step > 0 && (
          <motion.button
            onClick={back}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              padding: '14px 20px', borderRadius: 12,
              border: '1px solid #d4d4d7', background: '#fff',
              color: '#6b6b7b', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            ← Zurück
          </motion.button>
        )}
        <motion.button
          onClick={next}
          disabled={!isValid()}
          whileTap={{ scale: 0.97 }}
          style={{
            flex: 1, padding: '14px 24px', borderRadius: 12,
            border: 'none',
            background: isValid()
              ? 'linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)'
              : '#d4d4d7',
            color: 'white', fontSize: 15, fontWeight: 700,
            cursor: isValid() ? 'pointer' : 'not-allowed',
            boxShadow: isValid() ? '0 4px 14px rgba(36,164,125,0.3)' : 'none',
            fontFamily: 'inherit',
            opacity: isValid() ? 1 : 0.5,
          }}
        >
          {step < STEPS.length - 1 ? 'Weiter →' : 'Ergebnis berechnen 🚀'}
        </motion.button>
      </div>
    </motion.div>
  );
}
```

---

## 6. Step-Komponenten (Beispiele)

### StepHousehold.tsx

```typescript
import { HouseholdSize } from '../quizTypes';

const OPTIONS = [
  { value: 1, icon: '👤', label: '1', sub: 'Person' },
  { value: 2, icon: '👥', label: '2', sub: 'Personen' },
  { value: 3, icon: '👨‍👩‍👧', label: '3', sub: 'Personen' },
  { value: 4, icon: '👨‍👩‍👧‍👦', label: '4+', sub: 'Personen' },
] as const;

interface Props {
  value?: HouseholdSize;
  onChange: (v: HouseholdSize) => void;
}

export default function StepHousehold({ value, onChange }: Props) {
  return (
    <>
      <p style={{ fontSize: 13, color: '#6b6b7b', marginBottom: 20, lineHeight: 1.6 }}>
        Wie viele Personen leben in deinem Haushalt? Das hilft uns, deinen
        Energieverbrauch einzuschätzen.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value as HouseholdSize)}
            style={{
              padding: '16px 14px',
              borderRadius: 12,
              border: `2px solid ${value === opt.value ? '#24a47d' : '#e3e3e6'}`,
              background: value === opt.value ? '#d3ede5' : '#fff',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              minHeight: 64,
            }}
          >
            <span style={{ fontSize: 24 }}>{opt.icon}</span>
            <span style={{
              fontSize: 13, fontWeight: 600,
              color: value === opt.value ? '#167a52' : '#243c47',
            }}>{opt.label}</span>
            <span style={{ fontSize: 10, color: '#8b8b95' }}>{opt.sub}</span>
          </button>
        ))}
      </div>
    </>
  );
}
```

### StepVerbrauch.tsx

```typescript
interface Props {
  value: number;
  household: number;
  onChange: (v: number) => void;
}

const HH_LABELS: Record<number, string> = {
  1: '1 Person', 2: '2 Personen', 3: '3 Personen', 4: '4+ Personen',
};

export default function StepVerbrauch({ value, household, onChange }: Props) {
  const pct = ((value - 500) / (10000 - 500)) * 100;

  return (
    <>
      <p style={{ fontSize: 13, color: '#6b6b7b', marginBottom: 20, lineHeight: 1.6 }}>
        Wie hoch ist dein geschätzter Stromverbrauch pro Jahr?
      </p>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: '#243c47', letterSpacing: -1 }}>
          {value.toLocaleString('de-DE')}
        </span>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#8b8b95', marginLeft: 4 }}>
          kWh/Jahr
        </span>
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#8b8b95', marginBottom: 16 }}>
        Ø für {HH_LABELS[household] || '2 Personen'}
      </div>
      <input
        type="range"
        min={500}
        max={10000}
        step={100}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        style={{
          width: '100%', height: 8,
          appearance: 'none', WebkitAppearance: 'none',
          borderRadius: 4,
          background: `linear-gradient(to right, #24a47d ${pct}%, #e3e3e6 ${pct}%)`,
          outline: 'none', cursor: 'pointer',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8b8b95', marginTop: 6 }}>
        <span>500 kWh</span>
        <span>10.000 kWh</span>
      </div>
    </>
  );
}
```

---

## 7. ResultPage Komponente

```typescript
// ResultPage.tsx

import { motion } from 'framer-motion';
import { QuizData, QuizResult } from './quizTypes';
import { encodeQuizResult, buildSignupParams } from './quizCalculation';
import SparBadge from './SparBadge';
import ConfettiExplosion from './ConfettiExplosion'; // reuse from Wizard

interface Props {
  data: QuizData;
  result: QuizResult;
  onSignup: () => void;
  onRestart: () => void;
  embedded?: boolean;
}

function AnimatedCounter({ value, duration = 1.2 }: { value: number; duration?: number }) {
  // ... (same as existing AnimatedCounter in App.tsx)
}

export default function ResultPage({ data, result, onSignup, onRestart, embedded }: Props) {
  const handleShare = () => {
    const text = `Ich könnte ${result.gesamt.toLocaleString('de-DE')}€/Jahr bei Strom & Gas sparen! 💡\nFinde dein Sparpotenzial: https://wechselpilot.com/quiz`;
    if (navigator.share) {
      navigator.share({ title: 'Mein Wechselpilot Sparpotenzial', text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const handleBookmark = () => {
    const encoded = encodeQuizResult(data, result);
    const url = `${window.location.origin}${window.location.pathname}?r=${encoded}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      {result.stars >= 3 && <ConfettiExplosion />}

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)',
        padding: '32px 24px 28px',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.85, marginBottom: 12 }}>
          Haushalte wie deiner sparen durchschnittlich
        </div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', damping: 12 }}
          style={{ fontSize: 56, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}
        >
          <AnimatedCounter value={result.gesamt} />
          <span style={{ fontSize: 28, fontWeight: 700, marginLeft: 2 }}>€</span>
        </motion.div>
        <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.75, marginTop: 4 }}>pro Jahr</div>
        <div style={{ fontSize: 12, opacity: 0.65, marginTop: 8 }}>
          mit dem automatischen Wechselservice von Wechselpilot
        </div>
      </div>

      {/* Badge */}
      <SparBadge stars={result.stars} label={result.badgeLabel} />

      {/* Breakdown */}
      <div style={{ padding: '20px 24px', background: '#f8f9fa' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#243c47', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          💡 Deine Analyse
        </div>
        <BreakdownRow color="#f9aa00" label="Strom" value={`${result.stromSparen.toLocaleString('de-DE')} €`} />
        {result.hasGas && <BreakdownRow color="#e93a3a" label="Gas" value={`${result.gasSparen.toLocaleString('de-DE')} €`} />}
        <BreakdownRow color="#24a47d" label="Wechselbonus" value={`${result.bonus} €`} />
        <BreakdownRow color="#2a6fa6" label="Region" value={result.region} last />
      </div>

      {/* CTA */}
      <div style={{ padding: '20px 24px 24px' }}>
        <motion.button
          onClick={onSignup}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', padding: '18px 24px', borderRadius: 16,
            border: 'none',
            background: 'linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)',
            color: 'white', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 6px 24px rgba(36,164,125,0.35)',
            fontFamily: 'inherit', marginBottom: 12,
          }}
        >
          Willst du das wirklich sparen?
          <span style={{ display: 'block', fontSize: 11, fontWeight: 500, opacity: 0.8, marginTop: 2 }}>
            In 2 Minuten einrichten →
          </span>
        </motion.button>

        <div style={{ display: 'flex', gap: 10 }}>
          <SecondaryBtn icon="🔗" label="Teilen" onClick={handleShare} />
          <SecondaryBtn icon="🔖" label="Bookmark" onClick={handleBookmark} />
          <SecondaryBtn icon="🔄" label="Nochmal" onClick={onRestart} />
        </div>
      </div>
    </motion.div>
  );
}

function BreakdownRow({ color, label, value, last }: {
  color: string; label: string; value: string; last?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: last ? 'none' : '1px solid #f3f3f5',
    }}>
      <span style={{ fontSize: 13, color: '#6b6b7b', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />
        {label}
      </span>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#167a52' }}>{value}</span>
    </div>
  );
}

function SecondaryBtn({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '12px 16px', borderRadius: 12,
      border: '1px solid #d4d4d7', background: '#fff',
      color: '#6b6b7b', fontSize: 13, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    }}>
      {icon} {label}
    </button>
  );
}
```

---

## 8. SparBadge Komponente

```typescript
// SparBadge.tsx

import { motion } from 'framer-motion';

interface Props {
  stars: number;
  label: { text: string; sub: string };
}

export default function SparBadge({ stars, label }: Props) {
  return (
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f3f5' }}>
      <div style={{
        fontSize: 12, fontWeight: 700, color: '#8b8b95',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: 10,
      }}>
        Dein Sparpotenzial
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.8 + i * 0.15,
              type: 'spring',
              damping: 10,
            }}
            style={{
              fontSize: 24,
              filter: i > stars ? 'grayscale(1)' : 'none',
              opacity: i > stars ? 0.3 : 1,
            }}
          >
            ⭐
          </motion.span>
        ))}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#243c47' }}>{label.text}</div>
      <div style={{ fontSize: 12, color: '#6b6b7b' }}>{label.sub}</div>
    </div>
  );
}
```

---

## 9. Integration in WP Home

### 9.1 Als eigenständige Route

```typescript
// src/quiz-main.tsx — eigener Entrypoint für /apps/wpilot-home/quiz.html

import { createRoot } from 'react-dom/client';
import OnboardingQuiz from './components/OnboardingQuiz';
import { WpHomeProvider, useWpHome } from './store/wpHomeStore';

function QuizApp() {
  const { data, updateHousehold, updateElectricity, finishWizard } = useWpHome();

  const handleSignup = (quizData, result) => {
    // Pre-fill WP Home store
    updateHousehold({
      plz: quizData.plz,
      persons: quizData.household,
      propertyType: quizData.wohnform === 'haus' ? 'house' : 'apartment',
    });
    updateElectricity({
      provider: quizData.anbieter,
      kwh: quizData.kwh,
      monthlyCost: 0,
      tariffType: 'grundversorgung',
      contractEnd: '',
    });
    // Redirect to wizard (pre-filled)
    window.location.href = '/apps/wpilot-home/wizard.html';
  };

  return <OnboardingQuiz onSignup={handleSignup} />;
}

createRoot(document.getElementById('root')!).render(
  <WpHomeProvider>
    <QuizApp />
  </WpHomeProvider>
);
```

### 9.2 Vite Config Addition

```typescript
// vite.config.ts — add quiz entry
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        wizard: 'wizard.html',
        quiz: 'quiz.html',     // ← NEU
      },
    },
  },
});
```

### 9.3 Als Web Component (für externe Einbettung)

```typescript
// src/quiz-widget.ts — Web Component wrapper

import { createRoot } from 'react-dom/client';
import OnboardingQuiz from './components/OnboardingQuiz';

class WpSavingsQuiz extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    shadow.appendChild(container);

    // Inject Poppins font
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
    shadow.appendChild(link);

    const root = createRoot(container);
    root.render(
      <OnboardingQuiz
        embedded={this.hasAttribute('embedded')}
        onSignup={(data, result) => {
          this.dispatchEvent(new CustomEvent('wp-quiz-signup', {
            detail: { data, result },
            bubbles: true,
          }));
        }}
        onComplete={(data, result) => {
          this.dispatchEvent(new CustomEvent('wp-quiz-complete', {
            detail: { data, result },
            bubbles: true,
          }));
        }}
      />
    );
  }
}

customElements.define('wp-savings-quiz', WpSavingsQuiz);
```

**Nutzung auf wechselpilot.com:**
```html
<script src="https://home.wechselpilot.com/quiz-widget.js"></script>
<wp-savings-quiz></wp-savings-quiz>

<script>
  document.querySelector('wp-savings-quiz')
    .addEventListener('wp-quiz-signup', (e) => {
      // Redirect to signup with pre-filled data
      const { data, result } = e.detail;
      window.location.href = `/signup?quiz=1&hg=${data.household}&plz=${data.plz}`;
    });
</script>
```

---

## 10. Styling & Design-System

### Farben (konsistent mit WP Home)
| Token | Wert | Verwendung |
|-------|------|------------|
| `--wp-primary` | `#243c47` | Text, Headlines |
| `--wp-accent` | `#24a47d` | CTA, aktive States |
| `--wp-accent-dark` | `#167a52` | Hover, Badge-Werte |
| `--wp-accent-light` | `#d3ede5` | Aktive Hintergründe |
| `--wp-gradient` | `linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)` | Hero, Header |
| `--wp-gray-300` | `#e3e3e6` | Borders |
| `--wp-gray-700` | `#6b6b7b` | Sekundärtext |

### Animationen
- **Slide-Transition:** 300ms easeInOut für Step-Wechsel
- **Result-Reveal:** 800ms cubic-bezier(0.34, 1.56, 0.64, 1) — spring-ähnlich
- **Star-Pop:** 400ms pro Stern, gestaffelt um 150ms
- **Count-Up:** 1200ms easeOutCubic für die Hauptzahl
- **Confetti:** Ab 3+ Sternen, 50 Partikel, 4s Dauer

### Responsive Breakpoints
| Breakpoint | Anpassung |
|-----------|-----------|
| < 400px | 2-spaltige Buttons statt 4-spaltig, kleinere Fonts |
| 400–520px | Standard-Layout |
| > 520px | Max-width 520px, zentriert |

---

## 11. Implementierungsreihenfolge

1. **`quizTypes.ts` + `quizCalculation.ts`** — Typen und Berechnungslogik (rein, testbar)
2. **Step-Komponenten** — 5 einfache Formular-Steps
3. **`QuizFlow.tsx`** — Navigation + State
4. **`SparBadge.tsx`** — Badge-Anzeige
5. **`ResultPage.tsx`** — Ergebnis mit Animationen
6. **`index.tsx`** — Container + Bookmark-Restore
7. **`quiz.html` + `quiz-main.tsx`** — Eigene Route
8. **Web Component Wrapper** — Für externe Einbettung
9. **Analytics-Integration** — Tracking Events
10. **Tarifdaten-Update-Prozess** — Monatliche Aktualisierung

---

*React-Spezifikation erstellt von Brainstormer Unit. Bereit für Builder-Implementierung.*
