// Shared types across the funnel and dashboard

export interface VehicleCounts {
  verbrenner: number;
  eauto:      number;
  hybrid:     number;
}

export interface Equipment {
  balkon:    boolean | null;
  sunHours:  'wenig' | 'mittel' | 'viel' | null;  // nur relevant wenn balkon === true
  garten:    boolean | null;
  garage:    boolean | null;
  carport:   boolean | null;
}

export interface Residents {
  mitbewohner: number;
  kinder:      number;
  untermieter: number;
  haustiere:   number;
}

export interface MvpProfile {
  // Wohn-Basics
  tenure:       'miete' | 'eigentum' | '';
  propertyType: 'wohnung' | 'haus' | '';
  heatingType:  'gas' | 'oel' | 'strom' | 'waermepumpe' | 'weiss_nicht' | '';
  wohnflaeche:  number | null;  // m²
  equipment:    Equipment;

  // Bewohner (Profilseite — beeinflusst Tipps)
  residents:    Residents;

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

  // Basics: KFZ
  kfzVersicherung:    boolean | null;
}

export const INITIAL_PROFILE: MvpProfile = {
  tenure: '', propertyType: '', heatingType: '',
  wohnflaeche: null,
  equipment: { balkon: null, sunHours: null, garten: null, garage: null, carport: null },
  residents: { mitbewohner: 0, kinder: 0, untermieter: 0, haustiere: 0 },
  autoType: '', vehicles: { verbrenner: 0, eauto: 0, hybrid: 0 },
  hasChildren: null,
  sparziel: '', zeitaufwand: '', investitionen: '',
  steuererklaerung: null, girokonto: null,
  internet: null, mobilfunk: null,
  kfzVersicherung: null,
};
