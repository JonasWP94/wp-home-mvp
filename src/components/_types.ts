// Shared types across the funnel and dashboard

export interface VehicleCounts {
  verbrenner: number;
  eauto:      number;
  hybrid:     number;
}

export interface MvpProfile {
  // Wohn-Basics
  tenure:       'miete' | 'eigentum' | '';
  propertyType: 'wohnung' | 'haus' | '';
  heatingType:  'gas' | 'oel' | 'strom' | 'waermepumpe' | 'weiss_nicht' | '';

  // Fahrzeuge (Quelle der Wahrheit ist `vehicles`; `autoType` ist Quick-Flag für legacy)
  autoType:     'verbrenner' | 'eauto' | 'hybrid' | 'keins' | 'has-vehicles' | '';
  vehicles:     VehicleCounts;

  hasChildren:  boolean | null;

  // Spar-Präferenzen (optional, legacy)
  sparziel?:       string;
  zeitaufwand?:    string;
  investitionen?:  'keine' | 'gadgets' | 'projekte' | '';

  // Basics: Finanzen
  steuererklaerung: boolean | null;
  girokonto:        boolean | null;

  // Basics: Kommunikation
  internet:    boolean | null;
  mobilfunk:   boolean | null;

  // Basics: Versicherungen
  haftpflicht:        boolean | null;
  hausrat:            boolean | null;
  berufsunfaehigkeit: boolean | null;
  gebaeude:           boolean | null;
  kfzVersicherung:    boolean | null;
}

export const INITIAL_PROFILE: MvpProfile = {
  tenure: '', propertyType: '', heatingType: '',
  autoType: '', vehicles: { verbrenner: 0, eauto: 0, hybrid: 0 },
  hasChildren: null,
  sparziel: '', zeitaufwand: '', investitionen: '',
  steuererklaerung: null, girokonto: null,
  internet: null, mobilfunk: null,
  haftpflicht: null, hausrat: null, berufsunfaehigkeit: null,
  gebaeude: null, kfzVersicherung: null,
};
