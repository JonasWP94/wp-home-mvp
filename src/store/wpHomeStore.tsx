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
  wizardDone: boolean;
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
  wizardDone: false,
};

const STORAGE_KEY = "wpHome_v1";

interface WpHomeContextValue {
  data: WpHomeData;
  setData: (d: WpHomeData) => void;
  updateHousehold: (h: Partial<Household>) => void;
  updateElectricity: (e: ElectricityContract | null) => void;
  updateGas: (g: GasContract | null) => void;
  updateProfile: (p: Partial<Pick<WpHomeData, 'income' | 'heatingType' | 'buildingAge' | 'insulationQuality' | 'hasGarden' | 'hasSolarPotential'>>) => void;
  finishWizard: () => void;
  resetWizard: () => void;
}

const WpHomeContext = createContext<WpHomeContextValue | null>(null);

export function WpHomeProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<WpHomeData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
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

  function updateProfile(p: Partial<Pick<WpHomeData, 'income' | 'heatingType' | 'buildingAge' | 'insulationQuality' | 'hasGarden' | 'hasSolarPotential'>>) {
    setDataState(prev => ({ ...prev, ...p }));
  }

  function finishWizard() {
    setDataState(prev => ({ ...prev, wizardDone: true }));
  }

  function resetWizard() {
    setDataState(DEFAULT_DATA);
  }

  return (
    <WpHomeContext.Provider value={{ data, setData, updateHousehold, updateElectricity, updateGas, updateProfile, finishWizard, resetWizard }}>
      {children}
    </WpHomeContext.Provider>
  );
}

export function useWpHome() {
  const ctx = useContext(WpHomeContext);
  if (!ctx) throw new Error("useWpHome must be used inside WpHomeProvider");
  return ctx;
}
