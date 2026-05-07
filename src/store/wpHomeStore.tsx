import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Household {
  plz: string;
  persons: number; // 1-5
  propertyType: "apartment" | "house";
  area: number; // m²
}

export interface ElectricityContract {
  provider: string;
  kwh: number;
  monthlyCost: number; // EUR
  tariffType: "grundversorgung" | "sondertarif" | "oeko";
  contractEnd: string; // "YYYY-MM"
}

export interface GasContract {
  provider: string;
  kwh: number;
  monthlyCost: number; // EUR
  contractEnd: string; // "YYYY-MM"
}

export type IncomeLevel = 'low' | 'medium' | 'high' | 'very_high';
export type HeatingType = 'gas' | 'oil' | 'heat_pump' | 'district' | 'electric' | 'other';
export type BuildingAge = 'pre1990' | '1990to2010' | 'post2010';
export type InsulationQuality = 'poor' | 'medium' | 'good';

export interface WizardProfile {
  immobilientyp: string | null;       // Einfamilienhaus | Eigentumswohnung | Mietwohnung | ...
  wohnflaeche: number;                 // m²
  zimmeranzahl: number;
  baujahr_range: string | null;        // vor 1960 | 1960–1990 | 1990–2010 | nach 2010 | Neubau / KfW | Weiß nicht
  besitzverhaeltnis: string | null;   // Eigentümer (selbst bewohnt) | Hauptmieter | WG-Mitglied | ...
  haushalt_personen: number | null;   // 1 | 2 | 3 | 4 | 5+
  altersgruppe: string | null;
  heizungsart: HeatingType;
  warmwasser: string | null;
  strom_eigenverbrauch: number;       // kWh/Jahr
  gas_verbrauch: number;              // kWh/Jahr
  pv_anlage: boolean;
  balkonkraftwerk: boolean;
  e_auto: boolean;
  smart_home: boolean;
  geraete: string[];                   // ['Geschirrspüler', 'Wäschetrockner', ...]
  vertraege_aktiv: string[];          // ['Stromvertrag', 'Netflix / Amazon / Disney+', ...]
  versicherungen: string[];           // ['Haftpflichtversicherung', ...]
  sparziel: string | null;
  zeitaufwand: string | null;          // Mühelos | Moderat | Intensiv
  plz: string;
  strom_status: string | null;
  // Komfort-Felder
  aufzug: boolean;
  keller: boolean;
  dachboden: boolean;
  garten: boolean;
  garage: boolean;
  balkon_terrasse: boolean;
  heizkosten_inklusive: boolean;
  nebenkosten_inklusive: boolean;
  kinder: boolean;
  kinder_anzahl: number;
  haustiere: boolean;
  homeoffice: boolean;
  skippedSteps: number[];              // Übersprungene Schritte (später vervollständigen)
}

export type Tenure = 'eigentum' | 'miete';

export interface WpHomeData {
  household: Household;
  electricity: ElectricityContract | null;
  gas: GasContract | null;
  income: IncomeLevel;
  heatingType: HeatingType;
  buildingAge: BuildingAge;
  insulationQuality: InsulationQuality;
  hasGarden: boolean;
  hasSolarPotential: boolean;
  hasBalkonkraftwerk: boolean;
  tenure: Tenure;
  hasAuto: boolean;
  zeitaufwand: string | null;  // "Mühelos" | "Moderat" | "Intensiv" | null
  homeoffice: boolean;
  hasKeller: boolean;
  hasSmartHome: boolean;
  wizardDone: boolean;
  // Vollständiges Wizard-Profil (neu)
  wizardProfile: WizardProfile | null;
}

const DEFAULT_DATA: WpHomeData = {
  household: { plz: "", persons: 2, propertyType: "apartment", area: 80 },
  electricity: null,
  gas: null,
  income: "medium",
  heatingType: "gas",
  buildingAge: "1990to2010",
  insulationQuality: "medium",
  hasGarden: false,
  hasSolarPotential: false,
  hasBalkonkraftwerk: false,
  tenure: "miete",
  hasAuto: false,
  zeitaufwand: null,
  homeoffice: false,
  hasKeller: false,
  hasSmartHome: false,
  wizardDone: false,
  wizardProfile: null,
};

const STORAGE_KEY = "wpHome_v2";

interface WpHomeContextValue {
  data: WpHomeData;
  setData: (d: WpHomeData) => void;
  updateHousehold: (h: Partial<Household>) => void;
  updateElectricity: (e: ElectricityContract | null) => void;
  updateGas: (g: GasContract | null) => void;
  updateProfile: (p: Partial<Pick<WpHomeData, 'income' | 'heatingType' | 'buildingAge' | 'insulationQuality' | 'hasGarden' | 'hasSolarPotential' | 'hasBalkonkraftwerk' | 'tenure' | 'hasAuto' | 'zeitaufwand' | 'homeoffice' | 'hasKeller' | 'hasSmartHome'>>) => void;
  finishWizard: () => void;
  resetWizard: () => void;
  saveWizardProfile: (profile: WizardProfile) => void;
}

const WpHomeContext = createContext<WpHomeContextValue | null>(null);

export function WpHomeProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<WpHomeData>(() => {
    try {
      // Migrate from v1 if v2 doesn't exist yet
      let stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const v1 = localStorage.getItem('wpHome_v1');
        if (v1) {
          const old = JSON.parse(v1);
          // Add new fields with defaults
          stored = JSON.stringify({
            ...DEFAULT_DATA,
            ...old,
            hasBalkonkraftwerk: old.hasBalkonkraftwerk || false,
            tenure: old.tenure || 'miete',
            hasAuto: old.hasAuto || false,
            zeitaufwand: old.zeitaufwand || null,
            homeoffice: old.homeoffice || false,
            hasKeller: old.hasKeller || false,
            hasSmartHome: old.hasSmartHome || false,
          });
        }
      }
      return stored ? JSON.parse(stored) : DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  function setData(d: WpHomeData) {
    setDataState(d);
  }

  function updateHousehold(h: Partial<Household>) {
    setDataState(prev => ({ ...prev, household: { ...prev.household, ...h } }));
  }

  function updateElectricity(e: ElectricityContract | null) {
    setDataState(prev => ({ ...prev, electricity: e }));
  }

  function updateGas(g: GasContract | null) {
    setDataState(prev => ({ ...prev, gas: g }));
  }

  function updateProfile(p: Partial<Pick<WpHomeData, 'income' | 'heatingType' | 'buildingAge' | 'insulationQuality' | 'hasGarden' | 'hasSolarPotential' | 'hasBalkonkraftwerk' | 'tenure' | 'hasAuto' | 'zeitaufwand' | 'homeoffice' | 'hasKeller' | 'hasSmartHome'>>) {
    setDataState(prev => ({ ...prev, ...p }));
  }

  function finishWizard() {
    setDataState(prev => ({ ...prev, wizardDone: true }));
  }

  function resetWizard() {
    setDataState(DEFAULT_DATA);
  }

  function saveWizardProfile(profile: WizardProfile) {
    // Ableiten der kompatiblen Felder aus dem Wizard-Profil
    const heatingMap: Record<string, HeatingType> = {
      'Gasheizung (Zentralheizung)': 'gas',
      'Ölheizung': 'oil',
      'Wärmepumpe': 'heat_pump',
      'Fernwärme': 'district',
      'Elektroheizung': 'electric',
      'Pellets / Holz': 'other',
    };
    const buildingAgeMap: Record<string, BuildingAge> = {
      'vor 1960': 'pre1990',
      '1960–1990': 'pre1990',
      '1990–2010': '1990to2010',
      'nach 2010': 'post2010',
      'Neubau / KfW': 'post2010',
      'Weiß nicht': '1990to2010',
    };
    const personsMap: Record<string, number> = { '1': 1, '2': 2, '3': 3, '4': 4, '5+': 5 };
    const propTypeMap: Record<string, 'apartment' | 'house'> = {
      'Einfamilienhaus': 'house',
      'Eigentumswohnung': 'apartment',
      'Mietwohnung': 'apartment',
      'Dachgeschoss': 'apartment',
      'Studentenappartement': 'apartment',
      'Gewerbe/Büro': 'apartment',
    };

    const tenureMap: Record<string, Tenure> = {
      'Eigentümer (selbst bewohnt)': 'eigentum',
      'Eigentümer (vermietet)': 'eigentum',
      'Hauptmieter': 'miete',
      'Untermieter': 'miete',
      'WG-Mitglied': 'miete',
      'Zur freien Nutzung': 'eigentum',
    };

    setDataState(prev => ({
      ...prev,
      wizardProfile: profile,
      household: {
        ...prev.household,
        plz: profile.plz || prev.household.plz,
        persons: profile.haushalt_personen ? (personsMap[String(profile.haushalt_personen)] || 2) : prev.household.persons,
        propertyType: propTypeMap[profile.immobilientyp || ''] || prev.household.propertyType,
        area: profile.wohnflaeche || prev.household.area,
      },
      heatingType: heatingMap[profile.heizungsart || ''] || prev.heatingType,
      buildingAge: buildingAgeMap[profile.baujahr_range || ''] || prev.buildingAge,
      hasGarden: profile.garten || prev.hasGarden,
      hasSolarPotential: profile.pv_anlage || profile.balkonkraftwerk || prev.hasSolarPotential,
      hasBalkonkraftwerk: profile.balkonkraftwerk || prev.hasBalkonkraftwerk,
      tenure: tenureMap[profile.besitzverhaeltnis || ''] || prev.tenure,
      hasAuto: profile.auto_vorhanden || prev.hasAuto,
      zeitaufwand: profile.zeitaufwand || prev.zeitaufwand,
      homeoffice: profile.homeoffice || prev.homeoffice,
      hasKeller: profile.keller || prev.hasKeller,
      hasSmartHome: profile.smart_home || prev.hasSmartHome,
      wizardDone: true,
    }));
  }

  return (
    <WpHomeContext.Provider value={{ data, setData, updateHousehold, updateElectricity, updateGas, updateProfile, finishWizard, resetWizard, saveWizardProfile }}>
      {children}
    </WpHomeContext.Provider>
  );
}

export function useWpHome() {
  const ctx = useContext(WpHomeContext);
  if (!ctx) throw new Error("useWpHome must be used inside WpHomeProvider");
  return ctx;
}
