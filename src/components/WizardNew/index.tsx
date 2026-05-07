import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  IconHome, IconBuilding, IconBuildingSkyscraper, IconElevator, IconPackages,
  IconTree, IconCar, IconLeaf, IconUser, IconUsers, IconWallet, IconFile,
  IconSchool, IconBriefcase, IconTool, IconCoin, IconCurrencyDollar, IconFlame,
  IconBolt, IconPlug, IconPlugConnected, IconBattery, IconBike, IconBus,
  IconRocket, IconSearch, IconChartBar, IconCreditCard, IconWind,
  IconCheck, IconX, IconQuestionMark, IconGift, IconTag, IconDiscount,
  IconFireHydrant, IconGasStation, IconThermometer, IconDroplet, IconSun,
  IconSunElectricity, IconHammer, IconPlant, IconUsersGroup, IconHomeLink,
  IconHomeStats, IconOilKettle, IconEngine, IconAccessible, IconSofa,
  IconBed, IconBath, IconMicrowave, IconFridge, IconSnowflake,
  IconFileDescription, IconReceipt, IconPercentage, IconCalculator,
  IconShieldCheck, IconUserCheck, IconMapPin, IconDeviceDesktopAnalytics,
  IconPlant2, IconDeviceMobile, IconLock, IconBell, IconAlertCircle,
  IconMail, IconPhone, IconClipboardList, IconTarget, IconMessages,
  IconNews,
} from '@tabler/icons-react';

// ── Emoji → Tabler icon mapping ─────────────────────────────────────
const T: Record<string, React.ComponentType<{ size?: number; color?: string; stroke?: number }>> = {
  '🏠': IconHome,          '🏡': IconHome,       '🏢': IconBuildingSkyscraper,
  '🏘': IconHome,          '👥': IconUsers,      '👤': IconUser,
  '🛎': IconBell,          '⚡': IconBolt,        '🔥': IconFlame,
  '🪵': IconPlant,         '🛢': IconFlame,  '🏭': IconBuilding, '🛁': IconBath,
  '🔌': IconPlug,          '🔋': IconBattery,    '🔄': IconPlugConnected,
  '⚙️': IconTool,          '💡': IconSunElectricity,
  '🔧': IconTool,          '🔍': IconSearch,     '✅': IconCheck,
  '❌': IconX,             '❓': IconQuestionMark,'⚠️': IconAlertCircle,
  '💰': IconCoin,          '💸': IconCurrencyDollar,'💳': IconCreditCard,
  '💼': IconBriefcase,      '📄': IconFileDescription,'🏦': IconBuilding,
  '💨': IconWind,          '🚗': IconCar,        '🚫': IconX,
  '🚌': IconBus,           '🚶': IconUser,       '🚲': IconBike,
  '🚀': IconRocket,        '📦': IconPackages,   '🗄': IconPackages,
  '🌳': IconTree,          '🌿': IconLeaf,       '🌱': IconPlant2,
  '🛗': IconElevator,      '🏗': IconBuilding,   '📊': IconChartBar,
  '📉': IconChartBar,      '🔑': IconHomeLink,   '👨👩👧': IconUsersGroup,
  '🎓': IconSchool,        '💥': IconBolt,       '🎁': IconGift,
  '🏆': IconRocket,        '📈': IconChartBar,   '🛡': IconShieldCheck,
  '🛡': IconShieldCheck,   '🤝': IconUsers,  '🧓': IconAccessible,
  '🎯': IconTarget,        '📌': IconMapPin,     '💬': IconMessages,
  '📰': IconNews,          '🌡': IconThermometer,'📞': IconPhone,
  '✉️': IconMail,          '📋': IconClipboardList,'🔔': IconBell,
  '☀️': IconSun,          '🌍': IconLeaf,       '📱': IconDeviceMobile,
  '🖥️': IconDeviceDesktopAnalytics,'🔒': IconLock,
  '🌲': IconTree,          '⛽': IconGasStation,
  '👨‍👩‍👦': IconUsersGroup,   '👨‍👩‍👧‍👦': IconUsersGroup,
} as Record<string, React.ComponentType<{ size?: number; color?: string; stroke?: number }>>;

// ── Icon wrapper: renders Tabler icon from emoji key ─────────────────
function Icon({ name, size = 20, color = BLUE }: { name: string; size?: number; color?: string }) {
  const Comp = T[name];
  if (!Comp) return null;
  return <Comp size={size} color={color} stroke={1.5} />;
}

// ── Minimal local storage for wizard only (no circular deps) ───
const WIZARD_STORAGE_KEY = 'wpilot_home_wizard_profile';
function saveWizardProfile(profile: any) {
  try { localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(profile)); } catch {}
}
function loadWizardProfile(): any {
  try {
    const s = localStorage.getItem(WIZARD_STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}
interface WizardProfile { [key: string]: any }

// ── Landing Page Component ──────────────────────────────────────
// ── Wizard State ────────────────────────────────────────────────
interface WizardState {
  immobilientyp: string | null;
  wohnflaeche: number;
  zimmeranzahl: number;
  baujahr_range: string | null;
  besitzverhaeltnis: string | null;
  wohnform: string | null;
  mitbewohner: number;
  eigentuemer_art: string | null;
  etage: string | null;
  aufzug: boolean;
  keller: boolean;
  dachboden: boolean;
  garten: boolean;
  garage: boolean;
  balkon_terrasse: boolean;
  heizungsart: string | null;
  warmwasser: string | null;
  heizkosten_inklusive: boolean;
  nebenkosten_inklusive: boolean;
  strom_eigenverbrauch: number;
  gas_verbrauch: number;
  haushalt_personen: string | null;
  altersgruppe: string | null;
  // Mobilität
  auto_vorhanden: boolean;
  auto_art: string | null;       // Benzin | Diesel | Hybrid | Elektro | Keins
  km_pro_jahr: number;
  oepnv_nutzung: string | null; // Nie | Gelegentlich | Täglich
  Fahrradtyp: string | null;    // Normal | E-Bike | Keins
  // ---
  kinder: boolean;
  kinder_anzahl: number;
  haustiere: boolean;
  homeoffice: boolean;
  e_auto: boolean;
  pv_anlage: boolean;
  balkonkraftwerk: boolean;
  smart_home: boolean;
  geraete: string[];
  vertraege_aktiv: string[];
  versicherungen: string[];
  plz: string;
  monatliche_ausgaben: string | null;
  sparziel: string | null;
  zeitaufwand: string | null;
  strom_status: string | null;
}

const INITIAL: WizardState = {
  immobilientyp: null, wohnflaeche: 80, zimmeranzahl: 3, baujahr_range: null,
  besitzverhaeltnis: null, wohnform: null, mitbewohner: 2, eigentuemer_art: null,
  etage: null, aufzug: false, keller: false, dachboden: false, garten: false,
  garage: false, balkon_terrasse: false, heizungsart: null, warmwasser: null,
  heizkosten_inklusive: false, nebenkosten_inklusive: false,
  strom_eigenverbrauch: 2000, gas_verbrauch: 0,
  haushalt_personen: null, altersgruppe: null,
  auto_vorhanden: false, auto_art: null, km_pro_jahr: 0, oepnv_nutzung: null, Fahrradtyp: null,
  kinder: false, kinder_anzahl: 1,
  haustiere: false, homeoffice: false, e_auto: false, pv_anlage: false,
  balkonkraftwerk: false, smart_home: false,
  geraete: [], vertraege_aktiv: [], versicherungen: [],
  plz: '', monatliche_ausgaben: null, sparziel: null, zeitaufwand: null, strom_status: null,
};

const TOTAL_STEPS = 12; // 1 landing + 11 wizard steps

// ── Colors (from Jonas's palette) ──────────────────────────────────
const ORANGE  = '#F9AA00';   // warm orange accent
const ORANGE_LT = '#FEF3C7'; // light orange bg
const BLUE    = '#5782B0';   // PRIMARY — blue (primary action)
const BLUE_LT = '#EDF2F9';   // light blue bg
const BLUE_DK = '#3D5A80';   // darker blue
const GREEN   = '#0C663B';   // green (secondary / success)
const GREEN_LT = '#E8F5EF';  // light green bg
const DARK    = '#2C3E50';   // dark text
const BG      = '#F5F6F8';   // page background
const WHITE   = '#FFFFFF';
const BORDER = '#E2E8F0';
const TEXT    = DARK;
const TEXT_MUTED = '#7A8C9A';
const TEXT_DIM = '#A0AEBB';
const ACCENT  = ORANGE;

// ── Required fields ──────────────────────────────────────────────
// Steps: 2=Sparziel, 3=Basics, 4=Immobilientyp, 5=Besitz, 6=Haushalt, 7=Energie
const REQUIRED: Record<number, keyof WizardState> = {
  2: 'sparziel',       // Sparziel
  3: null,            // Basisdaten: PLZ optional, Personen obligatorisch
  4: 'immobilientyp',  // Immobilienart
};

// ── Step Meta ──────────────────────────────────────────────────
const STEP_META = [
  // [0] Landing (handled separately)
  ['Start · Willkommen', '', ''],
  // Wizard steps (index +1 = actual step number)
  ['Schritt 1 · Ziel & Präferenzen', 'Was ist Ihr Sparziel?', 'So sortieren wir die Tipps nach Priorität.'],
  ['Schritt 2 · Basisdaten', 'Ihre Eckdaten', 'Damit wir Ihre Spartipps regional und passend berechnen können.'],
  ['Schritt 3 · Immobilienart', 'Was für eine Immobilie bewohnen Sie?', 'Die Art der Immobilie bestimmt, welche Spartipps relevant sind.'],
  ['Schritt 4 · Besitz & Mietverhältnis', 'Wie ist Ihr Verhältnis zur Immobilie?', 'Ob Sie Eigentümer, Mieter oder in einer WG sind, schließt viele Tipps ein oder aus.'],
  ['Schritt 5 · Haushalt & Personen', 'Wer wohnt bei Ihnen?', 'Haushaltsgröße und Altersstruktur bestimmen Spar- und Förderpotenziale.'],
  ['Schritt 6 · Energie & Verbrauch', 'Wie ist Ihre Energiesituation?', 'Strom, Gas, Heizung — hier liegt das größte Sparpotenzial.'],
  ['Schritt 7 · Geräte & Ausstattung', 'Welche Geräte nutzen Sie regelmäßig?', 'Energiefresser im Haushalt identifizieren.'],
  ['Schritt 8 · Verträge & Abonnements', 'Welche laufenden Verträge haben Sie?', 'Hier schlummert oft das größte Optimierungspotenzial.'],
  ['Schritt 9 · Versicherungen', 'Welche Versicherungen haben Sie?', 'Doppelversicherungen und Deckungslücken aufdecken.'],
  ['Schritt 10 · Mobilität', 'Wie sind Sie unterwegs?', 'Auto, ÖPNV, Fahrrad — Mobilität hat großes Sparpotenzial.'],
  ['Schritt 11 · Zusammenfassung', 'Ihr Haushaltsprofil', 'Überprüfen Sie Ihre Angaben — dann erstellen wir Ihren Plan.'],
];

// ─────────────────────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────────

function L({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>{children}</div>;
}

function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  unit: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: TEXT_MUTED }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{value.toLocaleString('de-DE')} {unit}</span>
      </div>
      <div style={{ position: 'relative', height: 4, background: BORDER, borderRadius: 2 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: BLUE, borderRadius: 2, transition: 'width 0.1s' }} />
        <input type="range" min={min} max={max} step={step} value={value} accentColor={BLUE}
          onChange={e => onChange(parseInt(e.target.value))}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', margin: 0 }} />
      </div>
    </div>
  );
}

function NumberStepper({ label, value, min, max, unit, onChange }: {
  label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void;
}) {
  const [inputVal, setInputVal] = useState(String(value));
  // Keep input in sync when value changes externally (e.g. step navigation)
  useEffect(() => { setInputVal(String(value)); }, [value]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setInputVal(raw);
  };
  const handleInputBlur = () => {
    const num = parseInt(inputVal) || min;
    const clamped = Math.max(min, Math.min(max, num));
    setInputVal(String(clamped));
    onChange(clamped);
  };
  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); }
  };
  const clamped = Math.max(min, Math.min(max, parseInt(inputVal) || min));
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: TEXT_MUTED }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => { const v = Math.max(min, value - 1); onChange(v); setInputVal(String(v)); }}
            disabled={value <= min}
            style={{
              width: 28, height: 28, borderRadius: 8, border: '1.5px solid #E2E8F0',
              background: value <= min ? '#F5F6F8' : '#FFFFFF', cursor: value <= min ? 'not-allowed' : 'pointer',
              fontSize: 16, color: value <= min ? '#C0CCD4' : BLUE, display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s',
            }}
          >−</button>
          <input
            type="text"
            inputMode="numeric"
            value={inputVal}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKey}
            style={{
              width: 48, textAlign: 'center', border: '1.5px solid #E2E8F0',
              borderRadius: 8, padding: '4px 6px', fontSize: 14, fontWeight: 700,
              color: TEXT, fontFamily: 'inherit', outline: 'none',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_MUTED, minWidth: 30 }}>{unit}</span>
          <button
            onClick={() => { const v = Math.min(max, value + 1); onChange(v); setInputVal(String(v)); }}
            disabled={value >= max}
            style={{
              width: 28, height: 28, borderRadius: 8, border: '1.5px solid #E2E8F0',
              background: value >= max ? '#F5F6F8' : '#FFFFFF', cursor: value >= max ? 'not-allowed' : 'pointer',
              fontSize: 16, color: value >= max ? '#C0CCD4' : BLUE, display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s',
            }}
          >+</button>
        </div>
      </div>
      {/* Step indicator dots */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(n => (
          <div key={n} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: n <= value ? BLUE : '#E2E8F0',
            transition: 'background 0.1s',
            flexShrink: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

function OptGrid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>{children}</div>;
}
function OptGrid3({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>{children}</div>;
}

function OptBtn({ val, icon, sub, selected, onClick }: {
  val: string; icon: string; sub?: string; selected: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: selected ? BLUE_LT : WHITE,
        border: `1.5px solid ${selected ? BLUE : BORDER}`,
        borderRadius: 12, padding: '14px 12px', cursor: 'pointer',
        textAlign: 'left' as const, transition: 'all 0.15s',
        boxShadow: selected ? '0 0 0 3px rgba(29,158,117,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: sub ? 4 : 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', fontSize: 20 }}><Icon name={icon} size={22} color={selected ? BLUE : TEXT_MUTED} /></span>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{val}</span>
      </div>
      {sub && <div style={{ fontSize: 11, color: TEXT_MUTED, paddingLeft: 28, lineHeight: 1.4 }}>{sub}</div>}
    </motion.button>
  );
}

function OptChip({ val, icon, selected, onClick }: {
  val: string; icon: string; selected: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: selected ? BLUE_LT : WHITE,
        border: `1.5px solid ${selected ? BLUE : BORDER}`,
        borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        transition: 'all 0.15s',
        boxShadow: selected ? '0 0 0 2px rgba(29,158,117,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}><Icon name={icon} size={18} color={selected ? BLUE : TEXT_MUTED} /></span>
      <span style={{ fontSize: 12, fontWeight: 500, color: selected ? BLUE_DK : TEXT }}>{val}</span>
    </motion.button>
  );
}

function CheckRow({ label, icon, checked, onToggle }: {
  label: string; icon: string; checked: boolean; onToggle: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      style={{
        background: checked ? BLUE_LT : WHITE,
        border: `1.5px solid ${checked ? BLUE : BORDER}`,
        borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        transition: 'all 0.15s',
        width: '100%', textAlign: 'left' as const,
        boxShadow: checked ? '0 0 0 2px rgba(29,158,117,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 5,
        background: checked ? BLUE : BORDER,
        border: `1.5px solid ${checked ? BLUE : BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.15s',
      }}>
        {checked && <IconCheck size={12} color="white" stroke={2} />}
      </div>
      <span style={{ display: 'flex', alignItems: 'center' }}><Icon name={icon} size={20} color={checked ? BLUE : TEXT_MUTED} /></span>
      <span style={{ fontSize: 13, color: checked ? BLUE_DK : TEXT, fontWeight: checked ? 600 : 400 }}>{label}</span>
    </motion.button>
  );
}

function ToggleRow({ label, sub, checked, onToggle }: {
  label: string; sub?: string; checked: boolean; onToggle: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${BORDER}` }}>
      <div>
        <div style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{sub}</div>}
      </div>
      <button
        onClick={onToggle}
        style={{
          width: 44, height: 26, borderRadius: 13, padding: 3,
          background: checked ? BLUE : BORDER, border: 'none',
          cursor: 'pointer', position: 'relative', flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute', width: 20, height: 20, background: 'white',
          borderRadius: '50%', top: 3, left: checked ? 22 : 3,
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          display: 'block',
        }} />
      </button>
    </div>
  );
}

function InfoChip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: BLUE_LT, color: BLUE_DK, fontSize: 12, fontWeight: 500,
      padding: '5px 12px', borderRadius: 20, display: 'inline-block',
      marginBottom: 16,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STEP CONTENTS
// ─────────────────────────────────────────────────────────────────

// StepBasics — PLZ + Personenzahl (step 3)
function StepBasics({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  return (
    <div>
      <L>Postleitzahl</L>
      <input
        type="text"
        inputMode="numeric"
        placeholder="z.B. 22301"
        maxLength={5}
        value={state.plz}
        onChange={e => update({ plz: e.target.value.replace(/\D/g, '').slice(0, 5) })}
        style={{
          width: '100%', border: `1.5px solid ${BORDER}`, borderRadius: 12,
          padding: '14px 16px', fontSize: 18, fontWeight: 700, color: TEXT,
          background: WHITE, fontFamily: 'inherit', marginBottom: 24,
          boxSizing: 'border-box', outline: 'none', letterSpacing: '0.1em',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = BLUE)}
        onBlur={e => (e.target.style.borderColor = BORDER)}
      />

      <L>Personen im Haushalt</L>
      <OptGrid3 style={{ marginBottom: 0 }}>
        {[
          ['1', '👤', 'Alleinlebend'], ['2', '👫', 'Paar oder WG'],
          ['3', '👨‍👩‍👦', 'Kleine Familie'], ['4', '👨‍👩‍👧‍👦', 'Familie'],
          ['5+', '👨‍👩‍👧‍👦+', 'Große Familie'],
        ].map(([v, icon, sub]) => (
          <OptBtn key={v} val={v} icon={icon} sub={sub}
            selected={state.haushalt_personen === v}
            onClick={() => update({ haushalt_personen: v })} />
        ))}
      </OptGrid3>
    </div>
  );
}

// Step1 — Immobilienart (step 4) mit Ausstattung
function Step1({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  const [wohnflaecheInput, setWohnflaecheInput] = useState(String(state.wohnflaeche));
  useEffect(() => { setWohnflaecheInput(String(state.wohnflaeche)); }, [state.wohnflaeche]);

  // Slider percentage for visual track
  const wfMin = 10, wfMax = 500, wfStep = 5;
  const wfPct = ((state.wohnflaeche - wfMin) / (wfMax - wfMin)) * 100;

  return (
    <div>
      <L>Immobilienart</L>
      <OptGrid2 style={{ marginBottom: 20 }}>
        <OptBtn val="Einfamilienhaus" icon="🏡" sub="Freistehend, mit Garten" selected={state.immobilientyp === 'Einfamilienhaus'} onClick={() => update({ immobilientyp: 'Einfamilienhaus' })} />
        <OptBtn val="Doppelhaushälfte" icon="🏠" sub="Reihenmittelhaus" selected={state.immobilientyp === 'Doppelhaushälfte'} onClick={() => update({ immobilientyp: 'Doppelhaushälfte' })} />
        <OptBtn val="Wohnung" icon="🏢" sub="Mehrfamilienhaus" selected={state.immobilientyp === 'Wohnung'} onClick={() => update({ immobilientyp: 'Wohnung' })} />
        <OptBtn val="WG-Zimmer" icon="👥" sub="Geteilte Wohnung" selected={state.immobilientyp === 'WG-Zimmer'} onClick={() => update({ immobilientyp: 'WG-Zimmer' })} />
        <OptBtn val="Serviced Apartment" icon="🛎" sub="Möblierte Kurzzeitmiete" selected={state.immobilientyp === 'Serviced Apartment'} onClick={() => update({ immobilientyp: 'Serviced Apartment' })} />
        <OptBtn val="Sonstiges" icon="🏠" sub="Andere Wohnform" selected={state.immobilientyp === 'Sonstiges'} onClick={() => update({ immobilientyp: 'Sonstiges' })} />
      </OptGrid2>

      {/* ── Wohnfläche + Zimmer kombinierte Zeile ── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap' as const }}>
        {/* Wohnfläche: Slider + Zahleneingabe */}
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <L>Wohnfläche</L>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ position: 'relative', flex: 1, height: 6, background: BORDER, borderRadius: 3 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${wfPct}%`, background: BLUE, borderRadius: 3, transition: 'width 0.1s' }} />
              <input type="range" min={wfMin} max={wfMax} step={wfStep} value={state.wohnflaeche}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  update({ wohnflaeche: v });
                  setWohnflaecheInput(String(v));
                }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', margin: 0 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <input
                type="text"
                inputMode="numeric"
                value={wohnflaecheInput}
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setWohnflaecheInput(raw);
                }}
                onBlur={() => {
                  const num = parseInt(wohnflaecheInput) || 80;
                  const clamped = Math.max(wfMin, Math.min(wfMax, num));
                  setWohnflaecheInput(String(clamped));
                  update({ wohnflaeche: clamped });
                }}
                onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                style={{
                  width: 56, textAlign: 'center' as const, border: `1.5px solid ${BORDER}`,
                  borderRadius: 8, padding: '6px 4px', fontSize: 15, fontWeight: 700,
                  color: TEXT, fontFamily: 'inherit', outline: 'none',
                }}
              />
              <span style={{ fontSize: 13, color: TEXT_MUTED, fontWeight: 500 }}>m²</span>
            </div>
          </div>
        </div>

        {/* Zimmer: Kompakter Klick-Stepper */}
        <div style={{ flex: '0 0 auto', minWidth: 130 }}>
          <L>Zimmer</L>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: WHITE, border: `1.5px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden', height: 38 }}>
            <button
              onClick={() => update({ zimmeranzahl: Math.max(1, state.zimmeranzahl - 1) })}
              disabled={state.zimmeranzahl <= 1}
              style={{
                width: 36, height: '100%', border: 'none', background: state.zimmeranzahl <= 1 ? '#F5F6F8' : WHITE,
                cursor: state.zimmeranzahl <= 1 ? 'not-allowed' : 'pointer', fontSize: 18, fontWeight: 600,
                color: state.zimmeranzahl <= 1 ? '#C0CCD4' : BLUE, display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s',
              }}
            >−</button>
            <input
              type="text"
              inputMode="numeric"
              value={state.zimmeranzahl}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9]/g, '');
                if (raw === '') return;
                const v = Math.max(1, Math.min(12, parseInt(raw) || 1));
                update({ zimmeranzahl: v });
              }}
              onBlur={() => {
                // ensure valid on blur
                update({ zimmeranzahl: Math.max(1, Math.min(12, state.zimmeranzahl)) });
              }}
              style={{
                width: 36, textAlign: 'center' as const, border: 'none', borderLeft: `1px solid ${BORDER}`,
                borderRight: `1px solid ${BORDER}`, padding: 0, fontSize: 15, fontWeight: 700,
                color: TEXT, fontFamily: 'inherit', outline: 'none', background: WHITE,
                height: '100%',
              }}
            />
            <button
              onClick={() => update({ zimmeranzahl: Math.min(12, state.zimmeranzahl + 1) })}
              disabled={state.zimmeranzahl >= 12}
              style={{
                width: 36, height: '100%', border: 'none', background: state.zimmeranzahl >= 12 ? '#F5F6F8' : WHITE,
                cursor: state.zimmeranzahl >= 12 ? 'not-allowed' : 'pointer', fontSize: 18, fontWeight: 600,
                color: state.zimmeranzahl >= 12 ? '#C0CCD4' : BLUE, display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s',
              }}
            >+</button>
          </div>
        </div>
      </div>

      <L>Ausstattung</L>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <CheckRow label="Aufzug" icon="🛗" checked={state.aufzug} onToggle={() => update({ aufzug: !state.aufzug })} />
        <CheckRow label="Keller" icon="🗄" checked={state.keller} onToggle={() => update({ keller: !state.keller })} />
        <CheckRow label="Dachboden" icon="📦" checked={state.dachboden} onToggle={() => update({ dachboden: !state.dachboden })} />
        <CheckRow label="Garten" icon="🌳" checked={state.garten} onToggle={() => update({ garten: !state.garten })} />
        <CheckRow label="Garage" icon="🚗" checked={state.garage} onToggle={() => update({ garage: !state.garage })} />
        <CheckRow label="Balkon/Terrasse" icon="🌿" checked={state.balkon_terrasse} onToggle={() => update({ balkon_terrasse: !state.balkon_terrasse })} />
      </div>
    </div>
  );
}

function Step2({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  return (
    <div>
      <OptGrid2>
        <OptBtn val="Eigentümer (selbst)" icon="🏠" sub="Eigenes Haus oder Wohnung" selected={state.besitzverhaeltnis === 'Eigentümer (selbst bewohnt)'} onClick={() => update({ besitzverhaeltnis: 'Eigentümer (selbst bewohnt)' })} />
        <OptBtn val="Eigentümer (vermietet)" icon="💰" sub="Du vermietest & wohnst woanders" selected={state.besitzverhaeltnis === 'Eigentümer (vermietet)'} onClick={() => update({ besitzverhaeltnis: 'Eigentümer (vermietet)' })} />
        <OptBtn val="Hauptmieter" icon="📄" sub="Direktvertrag mit Vermieter" selected={state.besitzverhaeltnis === 'Hauptmieter'} onClick={() => update({ besitzverhaeltnis: 'Hauptmieter' })} />
        <OptBtn val="Untermieter" icon="🤝" sub="Mietest von Hauptmieter" selected={state.besitzverhaeltnis === 'Untermieter'} onClick={() => update({ besitzverhaeltnis: 'Untermieter' })} />
        <OptBtn val="WG-Mitglied" icon="👥" sub="Geteilte Wohnung, geteilte Kosten" selected={state.besitzverhaeltnis === 'WG-Mitglied'} onClick={() => update({ besitzverhaeltnis: 'WG-Mitglied' })} />
        <OptBtn val="Zur freien Nutzung" icon="🎁" sub="Z.B. familieneigene Immobilie" selected={state.besitzverhaeltnis === 'Zur freien Nutzung'} onClick={() => update({ besitzverhaeltnis: 'Zur freien Nutzung' })} />
      </OptGrid2>

      {state.besitzverhaeltnis === 'WG-Mitglied' && (
        <div style={{ marginBottom: 16 }}>
          <L>Personen in der WG</L>
          <Slider label="Mitbewohner (inkl. Ihnen)" value={state.mitbewohner} min={2} max={10} step={1} unit="Pers."
            onChange={v => update({ mitbewohner: v })} />
          <L>WG-Art</L>
          <OptGrid2>
            <OptChip val="Studenten-WG" icon="🎓" selected={state.wohnform === 'Studenten-WG'} onClick={() => update({ wohnform: 'Studenten-WG' })} />
            <OptChip val="Berufs-WG" icon="💼" selected={state.wohnform === 'Berufs-WG'} onClick={() => update({ wohnform: 'Berufs-WG' })} />
            <OptChip val="Familien-WG" icon="👨‍👩‍👧" selected={state.wohnform === 'Familien-WG'} onClick={() => update({ wohnform: 'Familien-WG' })} />
            <OptChip val="Senioren-WG" icon="🧓" selected={state.wohnform === 'Senioren-WG'} onClick={() => update({ wohnform: 'Senioren-WG' })} />
          </OptGrid2>
        </div>
      )}
    </div>
  );
}

function Step3({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  return (
    <div>
      <L>Altersgruppe</L>
      <OptGrid3 style={{ marginBottom: 16 }}>
        <OptChip val="18–25" icon="🎓" selected={state.altersgruppe === '18–25'} onClick={() => update({ altersgruppe: '18–25' })} />
        <OptChip val="26–35" icon="💼" selected={state.altersgruppe === '26–35'} onClick={() => update({ altersgruppe: '26–35' })} />
        <OptChip val="36–50" icon="🏡" selected={state.altersgruppe === '36–50'} onClick={() => update({ altersgruppe: '36–50' })} />
        <OptChip val="51–65" icon="🌳" selected={state.altersgruppe === '51–65'} onClick={() => update({ altersgruppe: '51–65' })} />
        <OptChip val="65+" icon="🧓" selected={state.altersgruppe === '65+'} onClick={() => update({ altersgruppe: '65+' })} />
      </OptGrid3>

      <L>Situation</L>
      <ToggleRow label="Kinder im Haushalt (unter 18)" sub="Relevant für Familien-Förderprogramme"
        checked={state.kinder} onToggle={() => update({ kinder: !state.kinder })} />
      {state.kinder && (
        <div style={{ padding: '12px 0 4px' }}>
          <Slider label="Anzahl Kinder" value={state.kinder_anzahl} min={1} max={6} step={1} unit=""
            onChange={v => update({ kinder_anzahl: v })} />
        </div>
      )}
      <ToggleRow label="Haustiere" sub="Beeinflusst Versicherungsempfehlungen"
        checked={state.haustiere} onToggle={() => update({ haustiere: !state.haustiere })} />
      <ToggleRow label="Regelmäßiges Homeoffice" sub="Steuerliche Absetzbarkeit & Verbrauch"
        checked={state.homeoffice} onToggle={() => update({ homeoffice: !state.homeoffice })} />

      <L>Monatliche Gesamtausgaben</L>
      <OptGrid3>
        <OptChip val="< 1.500 €" icon="💸" selected={state.monatliche_ausgaben === '< 1.500 €'} onClick={() => update({ monatliche_ausgaben: '< 1.500 €' })} />
        <OptChip val="1.500–2.500 €" icon="💰" selected={state.monatliche_ausgaben === '1.500–2.500 €'} onClick={() => update({ monatliche_ausgaben: '1.500–2.500 €' })} />
        <OptChip val="2.500–4.000 €" icon="💳" selected={state.monatliche_ausgaben === '2.500–4.000 €'} onClick={() => update({ monatliche_ausgaben: '2.500–4.000 €' })} />
        <OptChip val="4.000–6.000 €" icon="🏦" selected={state.monatliche_ausgaben === '4.000–6.000 €'} onClick={() => update({ monatliche_ausgaben: '4.000–6.000 €' })} />
        <OptChip val="> 6.000 €" icon="🚀" selected={state.monatliche_ausgaben === '> 6.000 €'} onClick={() => update({ monatliche_ausgaben: '> 6.000 €' })} />
        <OptChip val="Weiß nicht" icon="❓" selected={state.monatliche_ausgaben === 'Weiß nicht'} onClick={() => update({ monatliche_ausgaben: 'Weiß nicht' })} />
      </OptGrid3>
    </div>
  );
}

function Step4({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  return (
    <div>
      <L>Heizungsart</L>
      <OptGrid2 style={{ marginBottom: 16 }}>
        <OptBtn val="Gasheizung" icon="🔥" sub="Erdgas-Therme im Keller" selected={state.heizungsart === 'Gasheizung (Zentralheizung)'} onClick={() => update({ heizungsart: 'Gasheizung (Zentralheizung)' })} />
        <OptBtn val="Ölheizung" icon="🛢" sub="Heizöl-Brenner" selected={state.heizungsart === 'Ölheizung'} onClick={() => update({ heizungsart: 'Ölheizung' })} />
        <OptBtn val="Wärmepumpe" icon="⚡" sub="Luft, Sole oder Wasser" selected={state.heizungsart === 'Wärmepumpe'} onClick={() => update({ heizungsart: 'Wärmepumpe' })} />
        <OptBtn val="Fernwärme" icon="🏭" sub="Anschluss ans Netz" selected={state.heizungsart === 'Fernwärme'} onClick={() => update({ heizungsart: 'Fernwärme' })} />
        <OptBtn val="Elektroheizung" icon="🔌" sub="Direktstrom oder Nachtspeicher" selected={state.heizungsart === 'Elektroheizung'} onClick={() => update({ heizungsart: 'Elektroheizung' })} />
        <OptBtn val="Pellets / Holz" icon="🪵" sub="Biomasse-Heizung" selected={state.heizungsart === 'Pellets / Holz'} onClick={() => update({ heizungsart: 'Pellets / Holz' })} />
      </OptGrid2>

      <L>Warmwasser</L>
      <OptGrid3 style={{ marginBottom: 16 }}>
        <OptChip val="Zentralheizung" icon="🏠" selected={state.warmwasser === 'Zentralheizung'} onClick={() => update({ warmwasser: 'Zentralheizung' })} />
        <OptChip val="Durchlauferhitzer" icon="⚡" selected={state.warmwasser === 'Durchlauferhitzer'} onClick={() => update({ warmwasser: 'Durchlauferhitzer' })} />
        <OptChip val="Boiler" icon="🛁" selected={state.warmwasser === 'Boiler / Speicher'} onClick={() => update({ warmwasser: 'Boiler / Speicher' })} />
        <OptChip val="Solar" icon="☀️" selected={state.warmwasser === 'Solar-Thermie'} onClick={() => update({ warmwasser: 'Solar-Thermie' })} />
        <OptChip val="Wärmepumpe" icon="🔄" selected={state.warmwasser === 'Wärmepumpe'} onClick={() => update({ warmwasser: 'Wärmepumpe' })} />
        <OptChip val="Weiß nicht" icon="❓" selected={state.warmwasser === 'Weiß nicht'} onClick={() => update({ warmwasser: 'Weiß nicht' })} />
      </OptGrid3>

      <L>Jährlicher Verbrauch</L>
      <Slider label="Strom (kWh/Jahr)" value={state.strom_eigenverbrauch} min={500} max={12000} step={100} unit="kWh"
        onChange={v => update({ strom_eigenverbrauch: v })} />
      <Slider label="Gas (kWh/Jahr)" value={state.gas_verbrauch} min={0} max={40000} step={500} unit="kWh"
        onChange={v => update({ gas_verbrauch: v })} />

      <L>Energietechnik vorhanden</L>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <CheckRow label="PV-Anlage" icon="☀️" checked={state.pv_anlage} onToggle={() => update({ pv_anlage: !state.pv_anlage })} />
        <CheckRow label="Balkonkraftwerk" icon="🔋" checked={state.balkonkraftwerk} onToggle={() => update({ balkonkraftwerk: !state.balkonkraftwerk })} />
        <CheckRow label="E-Auto" icon="🚗" checked={state.e_auto} onToggle={() => update({ e_auto: !state.e_auto })} />
        <CheckRow label="Smart Home" icon="🏠" checked={state.smart_home} onToggle={() => update({ smart_home: !state.smart_home })} />
      </div>
    </div>
  );
}

function Step5({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  const toggle = (arr: string[], val: string) => {
    update({ geraete: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] });
  };
  const rows: [string, string, [string, string][]][] = [
    ['Küche', '🍽', [
      ['Geschirrspüler','🍽'],['Wäschetrockner','🌀'],['Kühl-Gefrier-Kombi','❄'],
      ['Gefriergerät (separat)','🧊'],['Backofen (Elektro)','🔥'],['Induktionsherd','⚡'],
      ['Gasherd','🔵'],['Kaffeevollautomat','☕'],['Wasserkocher täglich','💧'],['Mikrowelle','📡'],
    ]],
    ['Unterhaltung & Büro', '💻', [
      ['Gaming PC / Konsole','🎮'],['Home Cinema / Beamer','📽'],['Desktop-PC (Arbeit)','💻'],
      ['Drucker / Scanner','🖨'],['NAS / Server','🖥'],['Router / Smart TV','📺'],
    ]],
    ['Heizung & Komfort', '🌡', [
      ['Elektr. Fußbodenheizung','🦶'],['Elektroheizstrahler','🔌'],
      ['Klimaanlage / Monoblock','❄'],['Luftentfeuchter','💨'],
      ['Pool / Whirlpool','🏊'],['Saunaanlage','🧖'],['Wallbox','⚡'],
    ]],
    ['Sonstige', '🔧', [
      ['Aquarium / Terrarium','🐟'],['3D-Drucker / Lasercutter','🖨'],
      ['Werkstatt / Kompressor','🔧'],['Altes Gefriergerät','📦'],
    ]],
  ];
  return (
    <div>
      <InfoChip>Wähle alle zutreffenden Geräte aus</InfoChip>
      {rows.map(([cat, icon, items]) => (
        <div key={cat} style={{ marginBottom: 16 }}>
          <L>{icon} {cat}</L>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {items.map(([v, ic]) => (
              <CheckRow key={v} label={v} icon={ic}
                checked={state.geraete.includes(v)}
                onToggle={() => toggle(state.geraete, v)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Step6({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  const toggle = (arr: string[], val: string) => {
    update({ vertraege_aktiv: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] });
  };
  const cats = [
    { label: '⚡ Energie', items: [['Stromvertrag','⚡'],['Gasvertrag','🔥'],['Fernwärmevertrag','🏭'],['Heizöl-Liefervertrag','🛢']] },
    { label: '📱 Kommunikation', items: [['Handy-/Mobilfunkvertrag','📱'],['Internet / DSL / Glasfaser','🌐'],['Festnetzvertrag','☎'],['Kabel-TV / Satellit','📺']] },
    { label: '🎬 Streaming & Abos', items: [['Netflix / Amazon / Disney+','🎬'],['Musik-Streaming','🎵'],['Software-Abos (Adobe etc.)','💾'],['Cloud-Speicher','☁']] },
    { label: '🏦 Finanzen', items: [['Girokonto mit Gebühren','🏦'],['Kreditkarte (Jahresgebühr)','💳'],['Bausparvertrag','🏗']] },
    { label: '🚗 Mobilität', items: [['KFZ-Versicherung','🚗'],['ÖPNV-Abo / Deutschlandticket','🚌'],['Auto-Abo / Leasing','🔑']] },
    { label: '🏠 Wohnen', items: [['Haushaltsversicherung','🏠'],['Gebäudeversicherung','🏢'],['Wartungsvertrag Heizung','🔧']] },
  ];
  return (
    <div>
      <InfoChip>Wähle alle aktiven Kategorien aus</InfoChip>
      {cats.map(cat => (
        <div key={cat.label} style={{ marginBottom: 16 }}>
          <L>{cat.label}</L>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {cat.items.map(([val, icon]) => (
              <CheckRow key={val} label={val} icon={icon}
                checked={state.vertraege_aktiv.includes(val)}
                onToggle={() => toggle(state.vertraege_aktiv, val)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Step7({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  const toggle = (arr: string[], val: string) => {
    update({ versicherungen: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] });
  };
  const items: [string, string][] = [
    ['Haftpflichtversicherung','🛡'],['Hausratversicherung','🏠'],['Rechtsschutzversicherung','⚖'],
    ['Berufsunfähigkeit (BU)','💼'],['Lebensversicherung (Risiko)','❤'],['Lebensversicherung (Kapital)','💰'],
    ['Pflegezusatzversicherung','🏥'],['Zahnzusatzversicherung','🦷'],['Private Krankenversicherung','🩺'],
    ['Reiseversicherung','✈'],['Unfallversicherung','🩹'],['Tierversicherung','🐾'],
    ['Fahrradversicherung','🚲'],['Handyversicherung','📱'],
  ];
  return (
    <div>
      <InfoChip>Wähle alle vorhandenen Versicherungen aus</InfoChip>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {items.map(([val, icon]) => (
          <CheckRow key={val} label={val} icon={icon}
            checked={state.versicherungen.includes(val)}
            onToggle={() => toggle(state.versicherungen, val)} />
        ))}
      </div>
    </div>
  );
}

// ── Step 8: Mobilität ──────────────────────────────────────────
function Step8({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  return (
    <div>
      <L>Auto</L>
      <ToggleRow
        label="Auto vorhanden"
        sub="PKW, Transporter oder Motorrad"
        checked={state.auto_vorhanden}
        onToggle={() => update({ auto_vorhanden: !state.auto_vorhanden })}
      />
      {state.auto_vorhanden && (
        <div style={{ marginTop: 12, marginBottom: 8 }}>
          <L>Antriebsart</L>
          <OptGrid2>
            <OptBtn val="Benzin" icon="⛽" selected={state.auto_art === 'Benzin'} onClick={() => update({ auto_art: 'Benzin' })} />
            <OptBtn val="Diesel" icon="🛢" selected={state.auto_art === 'Diesel'} onClick={() => update({ auto_art: 'Diesel' })} />
            <OptBtn val="Hybrid" icon="🔄" selected={state.auto_art === 'Hybrid'} onClick={() => update({ auto_art: 'Hybrid' })} />
            <OptBtn val="Elektro" icon="⚡" selected={state.auto_art === 'Elektro'} onClick={() => update({ auto_art: 'Elektro' })} />
            <OptBtn val="Plug-in-Hybrid" icon="🔌" selected={state.auto_art === 'Plug-in-Hybrid'} onClick={() => update({ auto_art: 'Plug-in-Hybrid' })} />
            <OptBtn val="Gas / Autogas" icon="💨" selected={state.auto_art === 'Gas / Autogas'} onClick={() => update({ auto_art: 'Gas / Autogas' })} />
          </OptGrid2>
          <L>Jährliche Fahrleistung</L>
          <Slider label="Kilometer / Jahr" value={state.km_pro_jahr} min={0} max={50000} step={500} unit="km"
            onChange={v => update({ km_pro_jahr: v })} />
        </div>
      )}

      <L>ÖPNV</L>
      <OptGrid3 style={{ marginBottom: 16 }}>
        <OptChip val="Nie" icon="❌" selected={state.oepnv_nutzung === 'Nie'} onClick={() => update({ oepnv_nutzung: 'Nie' })} />
        <OptChip val="Gelegentlich" icon="🚶" selected={state.oepnv_nutzung === 'Gelegentlich'} onClick={() => update({ oepnv_nutzung: 'Gelegentlich' })} />
        <OptChip val="Täglich / Pendler" icon="🚌" selected={state.oepnv_nutzung === 'Täglich / Pendler'} onClick={() => update({ oepnv_nutzung: 'Täglich / Pendler' })} />
      </OptGrid3>

      <L>Fahrrad / E-Bike</L>
      <OptGrid3>
        <OptChip val="Kein Fahrrad" icon="🚫" selected={state.Fahrradtyp === 'Keins'} onClick={() => update({ Fahrradtyp: 'Keins' })} />
        <OptChip val="Normales Fahrrad" icon="🚲" selected={state.Fahrradtyp === 'Normal'} onClick={() => update({ Fahrradtyp: 'Normal' })} />
        <OptChip val="E-Bike / S-Pedelec" icon="⚡" selected={state.Fahrradtyp === 'E-Bike'} onClick={() => update({ Fahrradtyp: 'E-Bike' })} />
      </OptGrid3>
    </div>
  );
}

function Step9({ state, update }: { state: WizardState; update: (p: Partial<WizardState>) => void }) {
  return (
    <div>
      <L>Ihr Hauptziel</L>
      <OptGrid2 style={{ marginBottom: 20 }}>
        <OptBtn val="Laufende Kosten senken" icon="📉" sub="Monatliche Ausgaben reduzieren" selected={state.sparziel === 'Laufende Kosten senken'} onClick={() => update({ sparziel: 'Laufende Kosten senken' })} />
        <OptBtn val="Einmalig viel sparen" icon="💥" sub="Größten Hebel identifizieren" selected={state.sparziel === 'Einmalig viel sparen'} onClick={() => update({ sparziel: 'Einmalig viel sparen' })} />
        <OptBtn val="Ökologisch & sparsam" icon="🌿" sub="Nachhaltigkeit & Kostenoptimierung" selected={state.sparziel === 'Ökologisch & sparsam'} onClick={() => update({ sparziel: 'Ökologisch & sparsam' })} />
        <OptBtn val="Altersvorsorge" icon="🏦" sub="Langfristig Kapital aufbauen" selected={state.sparziel === 'Altersvorsorge & Rücklagen'} onClick={() => update({ sparziel: 'Altersvorsorge & Rücklagen' })} />
        <OptBtn val="Wohnsituation verbessern" icon="🏠" sub="Investitionen, die sich auszahlen" selected={state.sparziel === 'Wohnsituation verbessern'} onClick={() => update({ sparziel: 'Wohnsituation verbessern' })} />
        <OptBtn val="Alles überprüfen" icon="🔍" sub="Vollständiger Spartipps-Check" selected={state.sparziel === 'Alles überprüfen'} onClick={() => update({ sparziel: 'Alles überprüfen' })} />
      </OptGrid2>

      <L>Zeitaufwand</L>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          ['Mühelos', '⚡', 'Sofort umsetzbar'],
          ['Moderat', '⏱', 'Paar Stunden/Monat'],
          ['Intensiv', '🔧', 'Maximale Ersparnis'],
        ].map(([v, icon, sub]) => (
          <OptBtn key={v} val={v} icon={icon} sub={sub}
            selected={state.zeitaufwand === v}
            onClick={() => update({ zeitaufwand: v })} />
        ))}
      </div>
    </div>
  );
}

// ── Summary ─────────────────────────────────────────────────────
function Step10({ state }: { state: WizardState }) {
  const Tag = ({ children }: { children: React.ReactNode }) => (
    <span style={{
      display: 'inline-block', background: BLUE_LT, color: BLUE_DK,
      fontSize: 11, padding: '3px 10px', borderRadius: 20, margin: 2, fontWeight: 500,
    }}>{children}</span>
  );
  const Row = ({ k, v }: { k: string; v: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BORDER}`, fontSize: 13 }}>
      <span style={{ color: TEXT_MUTED }}>{k}</span>
      <span style={{ color: TEXT, fontWeight: 600, textAlign: 'right' as const, maxWidth: '55%' }}>{v}</span>
    </div>
  );
  return (
    <div>
      <Row k="Immobilientyp" v={state.immobilientyp || '–'} />
      <Row k="Wohnfläche" v={`${state.wohnflaeche} m² · ${state.zimmeranzahl} Zimmer`} />
      <Row k="Baujahr" v={state.baujahr_range || '–'} />
      <Row k="Besitzverhältnis" v={state.besitzverhaeltnis || '–'} />
      <Row k="Haushalt" v={`${state.haushalt_personen || '–'} Pers. · ${state.altersgruppe || '–'}`} />
      <Row k="PLZ" v={state.plz || '–'} />
      <Row k="Heizung" v={state.heizungsart || '–'} />
      <Row k="Strom" v={`${state.strom_eigenverbrauch.toLocaleString('de-DE')} kWh/Jahr`} />
      <Row k="Sparziel" v={state.sparziel || '–'} />
      <Row k="Zeitaufwand" v={state.zeitaufwand || '–'} />

      {state.geraete.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>
            Geräte ({state.geraete.length})
          </div>
          <div>{state.geraete.map(g => <Tag key={g}>{g}</Tag>)}</div>
        </div>
      )}
      {state.vertraege_aktiv.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>
            Verträge ({state.vertraege_aktiv.length})
          </div>
          <div>{state.vertraege_aktiv.map(v => <Tag key={v}>{v}</Tag>)}</div>
        </div>
      )}
      {state.versicherungen.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>
            Versicherungen ({state.versicherungen.length})
          </div>
          <div>{state.versicherungen.map(v => <Tag key={v}>{v}</Tag>)}</div>
        </div>
      )}
      {(state.auto_vorhanden || state.oepnv_nutzung || state.Fahrradtyp) && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>
            Mobilität
          </div>
          <div>
            {state.auto_vorhanden && state.auto_art && <Tag key="auto">{state.auto_art} · {state.km_pro_jahr.toLocaleString('de-DE')} km/Jahr</Tag>}
            {state.oepnv_nutzung && <Tag key="oepnv">{state.oepnv_nutzung} ÖPNV</Tag>}
            {state.Fahrradtyp && state.Fahrradtyp !== 'Keins' && <Tag key="fahrrad">{state.Fahrradtyp}</Tag>}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, background: BLUE_LT, borderRadius: 12, padding: '14px 16px', fontSize: 13, color: BLUE_DK, lineHeight: 1.6 }}>
        ✓ Profil bereit — klicke „Weiter" für Ihren personalisierten Spartipps-Plan.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN WIZARD COMPONENT
// ─────────────────────────────────────────────────────────────────

export default function WizardNew() {
  // Resume mode: only show skipped steps
  const [resumeMode, setResumeMode] = useState(false);
  const [resumeSteps, setResumeSteps] = useState<number[]>([]);
  const [resumeIdx, setResumeIdx] = useState(0);

  const [step, setStep] = useState(2); // start at 2 (old step 9) — landing page is now a separate HTML file
  const [state, setState] = useState<WizardState>(() => {
    // In resume mode, load existing profile
    try {
      const existing = loadWizardProfile();
      if (existing) {
        return {
          ...INITIAL,
          immobilientyp: existing.immobilientyp || null,
          wohnflaeche: existing.wohnflaeche || 80,
          zimmeranzahl: existing.zimmeranzahl || 3,
          baujahr_range: existing.baujahr_range || null,
          besitzverhaeltnis: existing.besitzverhaeltnis || null,
          haushalt_personen: existing.haushalt_personen ? String(existing.haushalt_personen) : null,
          altersgruppe: existing.altersgruppe || null,
          heizungsart: existing.heizungsart || null,
          warmwasser: existing.warmwasser || null,
          strom_eigenverbrauch: existing.strom_eigenverbrauch || 2000,
          gas_verbrauch: existing.gas_verbrauch || 0,
          pv_anlage: existing.pv_anlage || false,
          balkonkraftwerk: existing.balkonkraftwerk || false,
          e_auto: existing.e_auto || false,
          smart_home: existing.smart_home || false,
          geraete: existing.geraete || [],
          vertraege_aktiv: existing.vertraege_aktiv || [],
          versicherungen: existing.versicherungen || [],
          auto_vorhanden: existing.auto_vorhanden || false,
          auto_art: existing.auto_art || null,
          km_pro_jahr: existing.km_pro_jahr || 0,
          oepnv_nutzung: existing.oepnv_nutzung || null,
          Fahrradtyp: existing.Fahrradtyp || null,
          sparziel: existing.sparziel || null,
          zeitaufwand: existing.zeitaufwand || null,
          aufzug: existing.aufzug || false,
          keller: existing.keller || false,
          dachboden: existing.dachboden || false,
          garten: existing.garten || false,
          garage: existing.garage || false,
          balkon_terrasse: existing.balkon_terrasse || false,
          heizkosten_inklusive: existing.heizkosten_inklusive || false,
          nebenkosten_inklusive: existing.nebenkosten_inklusive || false,
          kinder: existing.kinder || false,
          kinder_anzahl: existing.kinder_anzahl || 1,
          haustiere: existing.haustiere || false,
          homeoffice: existing.homeoffice || false,
          wohnform: existing.wohnform || null,
          mitbewohner: existing.mitbewohner || 2,
          eigentuemer_art: existing.eigentuemer_art || null,
          etage: existing.etage || null,
          monatliche_ausgaben: existing.monatliche_ausgaben || null,
          plz: existing.plz || '',
          strom_status: existing.strom_status || null,
        };
      }
    } catch {}
    return INITIAL;
  });
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  // saveWizardProfile is defined at module level

  // Check for resume mode on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('resume') === '1') {
      const existing = loadWizardProfile();
      const skippedArr: number[] = existing?.skippedSteps || [];
      if (skippedArr.length > 0) {
        setResumeMode(true);
        setResumeSteps(skippedArr);
        setResumeIdx(0);
        setStep(skippedArr[0]);
        setSkipped(new Set()); // clear skipped since we're filling them now
      }
    }
  }, []);

  const update = useCallback((partial: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  const requiredField = REQUIRED[step];
  const canNext = requiredField ? Boolean(state[requiredField]) : true;

  const canNextRef = useRef(canNext);
  canNextRef.current = canNext;

  const goNext = useCallback(() => {
    if (step === TOTAL_STEPS || (resumeMode && resumeIdx >= resumeSteps.length - 1)) {
      const profile: WizardProfile = {
        immobilientyp: state.immobilientyp, wohnflaeche: state.wohnflaeche,
        zimmeranzahl: state.zimmeranzahl, baujahr_range: state.baujahr_range,
        besitzverhaeltnis: state.besitzverhaeltnis,
        haushalt_personen: state.haushalt_personen ? parseInt(state.haushalt_personen) || 5 : null,
        altersgruppe: state.altersgruppe,
        heizungsart: (state.heizungsart || 'Gasheizung (Zentralheizung)') as any,
        warmwasser: state.warmwasser,
        strom_eigenverbrauch: state.strom_eigenverbrauch, gas_verbrauch: state.gas_verbrauch,
        pv_anlage: state.pv_anlage, balkonkraftwerk: state.balkonkraftwerk,
        e_auto: state.e_auto, smart_home: state.smart_home,
        geraete: state.geraete, vertraege_aktiv: state.vertraege_aktiv,
        versicherungen: state.versicherungen,
        auto_vorhanden: state.auto_vorhanden, auto_art: state.auto_art,
        km_pro_jahr: state.km_pro_jahr, oepnv_nutzung: state.oepnv_nutzung,
        Fahrradtyp: state.Fahrradtyp,
        sparziel: state.sparziel,
        zeitaufwand: state.zeitaufwand,
        aufzug: state.aufzug, keller: state.keller, dachboden: state.dachboden,
        garten: state.garten, garage: state.garage, balkon_terrasse: state.balkon_terrasse,
        heizkosten_inklusive: state.heizkosten_inklusive,
        nebenkosten_inklusive: state.nebenkosten_inklusive,
        kinder: state.kinder, kinder_anzahl: state.kinder_anzahl,
        haustiere: state.haustiere, homeoffice: state.homeoffice,
        wohnform: state.wohnform, mitbewohner: state.mitbewohner,
        eigentuemer_art: state.eigentuemer_art, etage: state.etage,
        monatliche_ausgaben: state.monatliche_ausgaben,
        skippedSteps: [], // clear skipped steps on resume completion
      };
      saveWizardProfile(profile);
      window.location.href = '/apps/wpilot-home/';
      return;
    }
    if (resumeMode) {
      const nextIdx = resumeIdx + 1;
      setResumeIdx(nextIdx);
      setStep(resumeSteps[nextIdx]);
    } else {
      setStep(s => s + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, state, skipped, saveWizardProfile]);

  function goTo(n: number) { setStep(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function goBack() {
    if (resumeMode) {
      if (resumeIdx > 0) {
        const prevIdx = resumeIdx - 1;
        setResumeIdx(prevIdx);
        setStep(resumeSteps[prevIdx]);
      } else {
        window.location.href = '/apps/wpilot-home/';
      }
    } else if (step > 2) {
      setStep(s => s - 1);
    } else {
      window.location.href = '/apps/wpilot-home/landing/';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function skip() {
    if (resumeMode) return; // can't skip in resume mode
    setSkipped(prev => new Set([...prev, step]));
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Enter key support — advance wizard (but not when focused on text inputs)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter' && canNextRef.current) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;
        goNext();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext]);

  const [stepLabel, stepTitle, stepSub] = STEP_META[step - 1];
  const pct = resumeMode
    ? Math.round((resumeIdx / Math.max(resumeSteps.length, 1)) * 100)
    : Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  // Map wizard step numbers to content
  // 2=Sparziel, 3=Basics, 4=Immobilie, 5=Besitz, 6=Haushalt, 7=Energie, 8=Geräte, 9=Verträge, 10=Versicherung, 11=Mobilität, 12=Summary
  function renderStep() {
    const props = { state, update };
    switch (step) {
      case 2:  return <Step9 {...props} />;     // Sparziel
      case 3:  return <StepBasics {...props} />; // Basisdaten
      case 4:  return <Step1 {...props} />;     // Immobilienart
      case 5:  return <Step2 {...props} />;     // Besitzverhältnis
      case 6:  return <Step3 {...props} />;     // Haushalt & Personen
      case 7:  return <Step4 {...props} />;     // Energie
      case 8:  return <Step5 {...props} />;     // Geräte
      case 9:  return <Step6 {...props} />;     // Verträge
      case 10: return <Step7 {...props} />;     // Versicherungen
      case 11: return <Step8 {...props} />;     // Mobilität
      case 12: return <Step10 {...props} />;    // Summary
      default: return null;
    }
  }

  const displayStep = step - 1; // 1-indexed display (1 = Sparziel)

  return (
    <div style={{
      minHeight: '100vh', background: BG,
      fontFamily: "'Poppins', sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* ── Header ─────────────────────────────────────── */}
      <div style={{
        position: 'sticky' as const, top: 0, zIndex: 100,
        background: 'rgba(244,246,248,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <img
            src="/apps/wpilot-home/assets/logo-wp.png"
            alt="Wechselpilot"
            height={22}
            style={{ objectFit: 'contain', flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: "'Poppins', sans-serif", letterSpacing: '0.05em' }}>HOME</span>
        </div>

        {/* Step dots or resume indicator */}
        {resumeMode ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>Offene Fragen</span>
            <span style={{ fontSize: 11, color: TEXT_MUTED }}>{resumeIdx + 1} von {resumeSteps.length}</span>
          </div>
        ) : (
        <div style={{ display: 'flex', gap: 5, flex: 1, justifyContent: 'center' }}>
          {Array.from({ length: TOTAL_STEPS - 1 }, (_, i) => i + 2).map(n => {
            const dStep = n - 1; // display step (1-10)
            const isActive = dStep === displayStep;
            const isSkipped = skipped.has(n);
            const isPast = dStep < displayStep;
            let bg = BORDER; let color = TEXT_DIM;
            if (isActive) { bg = BLUE; color = WHITE; }
            else if (isSkipped) { bg = ACCENT; color = WHITE; }
            else if (isPast) { bg = BLUE; color = WHITE; }
            return (
              <button key={n} onClick={() => goTo(n)}
                title={STEP_META[n - 1][0]}
                style={{
                  width: isActive ? 28 : 8, height: 8, borderRadius: 4,
                  background: bg, border: 'none', cursor: 'pointer',
                  transition: 'all 0.2s',
                  padding: 0,
                  flexShrink: 0,
                }} />
            );
          })}
        </div>
        )}

        {/* Skip button removed from top — now in bottom nav */}
      </div>

      {/* ── Progress bar ────────────────────────────────── */}
      <div style={{ height: 3, background: BORDER }}>
        <motion.div
          style={{ height: '100%', background: BLUE, borderRadius: '0 2px 2px 0' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 120px' }}>
        {/* Step meta */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 4 }}>
            {stepLabel}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 6, lineHeight: 1.3 }}>
            {stepTitle}
          </h1>
          <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.5 }}>{stepSub}</p>
        </div>

        {/* Step content */}
        <div key={step}>
          {renderStep()}
        </div>
      </div>

      {/* ── Bottom nav ──────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${BORDER}`,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, zIndex: 100,
      }}>
        {/* Left: Back */}
        <button
          onClick={goBack}
          style={{
            background: 'transparent', border: `1.5px solid ${BORDER}`,
            borderRadius: 12, padding: '10px 16px',
            fontSize: 14, fontWeight: 600, color: step === 1 ? TEXT_DIM : TEXT,
            cursor: step === 1 ? 'not-allowed' : 'pointer',
            opacity: step === 1 ? 0.4 : 1,
            transition: 'all 0.15s', flexShrink: 0,
          }}
        >
          ← Zurück
        </button>

        {/* Center: Skipped indicator only */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {skipped.size > 0 && (
            <span style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>
              {skipped.size} übersprungen
            </span>
          )}
        </div>

        {/* Right: Skip + Next / Done grouped together */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {!resumeMode && step < TOTAL_STEPS && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={skip}
              style={{
                background: 'transparent', border: `1.5px solid ${BORDER}`,
                borderRadius: 10, padding: '10px 16px',
                fontSize: 13, fontWeight: 500, color: TEXT_MUTED,
                cursor: 'pointer', transition: 'all 0.15s',
                minHeight: 44,
              }}
            >
              Überspringen
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goNext}
            disabled={!canNext}
            style={{
              background: canNext ? BLUE : BORDER,
              border: 'none', borderRadius: 12,
              padding: '10px 20px',
              fontSize: 14, fontWeight: 600, color: canNext ? WHITE : TEXT_DIM,
              cursor: canNext ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
              boxShadow: canNext ? '0 2px 8px rgba(87,130,176,0.35)' : 'none',
            }}
          >
          {resumeMode
            ? (resumeIdx >= resumeSteps.length - 1 ? 'Profil vervollständigen ✓' : `Weiter ${resumeIdx + 1}/${resumeSteps.length} →`)
            : (step === TOTAL_STEPS ? 'Profil fertig ✓' : `Weiter ${displayStep}/${TOTAL_STEPS - 1} →`)}
        </motion.button>
        </div>
      </div>
    </div>
  );
}
