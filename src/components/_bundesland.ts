// ── PLZ → Bundesland → Denkmalschutz-Kategorie (Balkonkraftwerk) ──
// Vereinfachtes Lookup nach erstem 2-Ziffern-Bereich der PLZ.
// Quelle: typische PLZ-Zuordnung in DE. Grenz-PLZ sind grobe Zuordnungen.

export type BundeslandCode =
  | 'BW' | 'BY' | 'BE' | 'BB' | 'HB' | 'HH' | 'HE' | 'MV'
  | 'NI' | 'NW' | 'RP' | 'SL' | 'SN' | 'ST' | 'SH' | 'TH';

export const BUNDESLAND_NAME: Record<BundeslandCode, string> = {
  BW: 'Baden-Württemberg',
  BY: 'Bayern',
  BE: 'Berlin',
  BB: 'Brandenburg',
  HB: 'Bremen',
  HH: 'Hamburg',
  HE: 'Hessen',
  MV: 'Mecklenburg-Vorpommern',
  NI: 'Niedersachsen',
  NW: 'Nordrhein-Westfalen',
  RP: 'Rheinland-Pfalz',
  SL: 'Saarland',
  SN: 'Sachsen',
  ST: 'Sachsen-Anhalt',
  SH: 'Schleswig-Holstein',
  TH: 'Thüringen',
};

export function plzToBundesland(plz: string): BundeslandCode | null {
  if (!plz || plz.length < 2) return null;
  const p = parseInt(plz.slice(0, 2), 10);
  if (Number.isNaN(p)) return null;

  // Lookup nach ersten 2 Ziffern (vereinfacht)
  if (p === 1) return 'SN';                            // 01xxx Sachsen (Dresden)
  if (p === 2) return 'SN';                            // 02xxx Sachsen (Bautzen)
  if (p === 3) return 'BB';                            // 03xxx Brandenburg (Cottbus)
  if (p === 4) return 'SN';                            // 04xxx Sachsen (Leipzig)
  if (p === 6) return 'ST';                            // 06xxx Sachsen-Anhalt (Halle)
  if (p === 7 || p === 8 || p === 9) return 'TH';      // 07–09 Thüringen
  if (p >= 10 && p <= 14) return 'BE';                 // Berlin
  if (p === 15 || p === 16) return 'BB';               // Brandenburg
  if (p === 17 || p === 18 || p === 19) return 'MV';   // Mecklenburg-Vorpommern
  if (p >= 20 && p <= 22) return 'HH';                 // Hamburg
  if (p >= 23 && p <= 25) return 'SH';                 // Schleswig-Holstein
  if (p === 26) return 'NI';                           // 26xxx Niedersachsen (Emden)
  if (p === 27) return 'HB';                           // 27xxx Bremen (großteils)
  if (p === 28) return 'HB';                           // Bremen
  if (p === 29) return 'NI';                           // Lüneburger Heide
  if (p >= 30 && p <= 38) return 'NI';                 // Niedersachsen (Hannover etc.)
  if (p === 39) return 'ST';                           // Sachsen-Anhalt (Magdeburg)
  if (p >= 40 && p <= 48) return 'NW';                 // NRW (Düsseldorf, Essen, …)
  if (p === 49) return 'NI';                           // Osnabrück = Niedersachsen
  if (p >= 50 && p <= 59) return 'NW';                 // NRW (Köln, Bonn, Aachen, …)
  if (p >= 60 && p <= 65) return 'HE';                 // Hessen (Frankfurt …)
  if (p === 66) return 'SL';                           // Saarland (Saarbrücken)
  if (p === 67) return 'RP';                           // Rheinland-Pfalz
  if (p === 68 || p === 69) return 'BW';               // BaWü (Mannheim, Heidelberg)
  if (p >= 70 && p <= 79) return 'BW';                 // BaWü (Stuttgart, Karlsruhe, Freiburg)
  if (p >= 80 && p <= 87) return 'BY';                 // Bayern (München, Augsburg)
  if (p === 88) return 'BW';                           // BaWü (Bodensee)
  if (p === 89) return 'BY';                           // Bayern (Ulm-Umland)
  if (p >= 90 && p <= 96) return 'BY';                 // Bayern (Nürnberg, Würzburg-Umland)
  if (p === 97) return 'BY';                           // Bayern (Würzburg)
  if (p === 98 || p === 99) return 'TH';               // Thüringen (Erfurt)
  return null;
}

export type DenkmalschutzCategory = 'liberal' | 'pragmatic' | 'strict';

export interface DenkmalschutzInfo {
  category: DenkmalschutzCategory;
  label: string;
  short: string;
  details: string;
}

export const DENKMALSCHUTZ_BY_BUNDESLAND: Record<BundeslandCode, DenkmalschutzInfo> = {
  // Vorreiter / Liberal
  HH: { category: 'liberal',   label: 'Sehr unkompliziert',  short: 'Hamburg ist Vorreiter',                  details: 'Solaranlagen sind im Denkmalschutz explizit erwünscht. Wenn die Module von der Straße aus unsichtbar sind, wird das Verfahren meist im Eiltempo durchgewinkt.' },
  BE: { category: 'liberal',   label: 'Sehr unkompliziert',  short: 'Berlin ist Vorreiter',                   details: 'Solaranlagen sind im Denkmalschutz explizit erwünscht. Wenn die Module von der Straße aus unsichtbar sind, wird das Verfahren meist im Eiltempo durchgewinkt.' },
  BW: { category: 'liberal',   label: 'Sehr unkompliziert',  short: 'Eine der liberalsten Regelungen',        details: 'Denkmalschutzbehörden müssen Solaranlagen genehmigen, solange die historische Bausubstanz nicht beschädigt wird und die Optik durch farbliche Anpassung (z. B. "Full-Black"-Module) harmonisch bleibt.' },
  NW: { category: 'liberal',   label: 'Sehr unkompliziert',  short: 'NRW hat Denkmalschutz gelockert',        details: 'Solaranlagen auf Denkmälern sind der Regelfall geworden. Anträge werden standardmäßig positiv beschieden, außer es liegt ein extremer Ausnahmefall vor.' },

  // Pragmatisch
  BY: { category: 'pragmatic', label: 'Mit Auflagen möglich', short: 'Bayern prüft jeden Fall einzeln',       details: 'In historischen Ensembles (z. B. Altstadt Regensburg) scheitern sichtbare Module oft. Im Innenhof ist eine Genehmigung mit matten, komplett schwarzen Modulen und flacher Montage meist möglich.' },
  HE: { category: 'pragmatic', label: 'Mit Auflagen möglich', short: 'Regelmäßig zu erteilen',                details: 'Genehmigung ist regelmäßig zu erteilen. Sichtbare Kabelwege an der Fassade oder glänzende Silberrahmen werden jedoch streng abgelehnt.' },
  RP: { category: 'pragmatic', label: 'Mit Auflagen möglich', short: 'Regelmäßig zu erteilen',                details: 'Genehmigung ist regelmäßig zu erteilen. Sichtbare Kabelwege an der Fassade oder glänzende Silberrahmen werden jedoch streng abgelehnt.' },
  SL: { category: 'pragmatic', label: 'Mit Auflagen möglich', short: 'Ähnlich Rheinland-Pfalz',                details: 'Genehmigung mit optischen Auflagen meist möglich. Sichtbare Kabel und glänzende Rahmen werden abgelehnt.' },

  // Streng
  SH: { category: 'strict',    label: 'Strenge Prüfung',     short: 'Visuelle Beeinträchtigung streng ausgelegt', details: 'Selbst im Innenhof oder hinter Schneefanggittern verlangen Behörden teilweise den Rückbau, wenn das Gebäude als bedeutend eingestuft wird. Höhere Ablehnungsquoten als anderswo.' },
  SN: { category: 'strict',    label: 'Strenge Prüfung',     short: 'Hohe Dichte historischer Altstädte',     details: 'Wegen extrem hoher Dichte an historischen Altstädten und Schieferbauten wird genau hingeschaut. Außenseiten-Module sind im einsehbaren Bereich oft nur mit teuren, farblich angepassten Spezialmodulen durchsetzbar.' },
  TH: { category: 'strict',    label: 'Strenge Prüfung',     short: 'Hohe Dichte historischer Altstädten',    details: 'Wegen extrem hoher Dichte an historischen Altstädten und Schieferbauten wird genau hingeschaut. Außenseiten-Module sind im einsehbaren Bereich oft nur mit teuren, farblich angepassten Spezialmodulen durchsetzbar.' },

  // Sonstige (default pragmatisch — Einzelfallprüfung, keine extremen Linien)
  BB: { category: 'pragmatic', label: 'Einzelfallprüfung',   short: 'Übliche Einzelfallprüfung',               details: 'Standard-Einzelfallprüfung: Genehmigung meist mit Auflagen möglich, z. B. flache Montage und matte Module.' },
  HB: { category: 'liberal',   label: 'Unkompliziert',        short: 'Stadtstaat — solar-freundlich',           details: 'Als Stadtstaat ähnlich solar-freundlich wie Hamburg. Module von der Straße aus unsichtbar montiert werden meist zügig genehmigt.' },
  MV: { category: 'pragmatic', label: 'Einzelfallprüfung',   short: 'Übliche Einzelfallprüfung',               details: 'Standard-Einzelfallprüfung: Genehmigung meist mit Auflagen möglich, z. B. flache Montage und matte Module.' },
  NI: { category: 'pragmatic', label: 'Einzelfallprüfung',   short: 'Übliche Einzelfallprüfung',               details: 'Standard-Einzelfallprüfung: Genehmigung meist mit Auflagen möglich, z. B. flache Montage und matte Module.' },
  ST: { category: 'strict',    label: 'Strenge Prüfung',     short: 'Hohe Dichte historischer Altstädte',     details: 'Ähnlich Sachsen/Thüringen: in historischen Ensembles oft nur mit farblich angepassten Modulen durchsetzbar.' },
};

export function getDenkmalschutzInfo(plz: string): { bl: BundeslandCode; name: string; info: DenkmalschutzInfo } | null {
  const bl = plzToBundesland(plz);
  if (!bl) return null;
  return {
    bl,
    name: BUNDESLAND_NAME[bl],
    info: DENKMALSCHUTZ_BY_BUNDESLAND[bl],
  };
}
