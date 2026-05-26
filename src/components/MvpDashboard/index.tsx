import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconHome,
  IconBuilding,
  IconFlame,
  IconCar,
  IconUsers,
  IconUser,
  IconCheck,
  IconTemperature,
  IconBolt,
  IconReceipt,
  IconSun,
  IconLeaf,
  IconBatteryCharging,
  IconShield,
  IconArrowRight,
  IconArrowLeft,
  IconCircle,
  IconPig,
  IconPlug,
  IconX,
  IconBike,
  IconKey,
  IconDroplet,
  IconChevronDown,
  IconPencil,
  IconTrendingDown,
  IconRocket,
  IconClock,
  IconTool,
  IconMinus,
  IconCpu,
  IconBuildingCommunity,
  IconCreditCard,
  IconDeviceMobile,
  IconWifi,
  IconTarget,
  IconHourglass,
  IconCoins,
  IconPlus,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import logoWp from '../../assets/logo-wp.png';
import thermostatImg from '../../assets/thermostat.png';
import type { MvpProfile, Residents } from '../_types';
import { getDenkmalschutzInfo } from '../_bundesland';

interface MvpTip {
  id: string;
  title: string;
  tagline?: string;
  description?: string;
  why?: string;                // NEW — explains *why* you save with this
  partner: string;
  partnerLinks?: { name: string; url: string; logo: string }[];
  actionLabel?: string;
  actionUrl?: string;
  howTo?: string[];
  effort?: string;             // NEW — estimated time investment
  difficulty?: 'Einfach' | 'Mittel' | 'Aufwändig';  // NEW
  priority: 3 | 2 | 1;
  category: string;
  icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
  savingsHg2: number;
  savingsHg3: number;
  condition: (p: MvpProfile) => boolean;
  // Per-Tip Anbieter-Empfehlungen (überschreibt den partner-string-Fallback)
  getOffers?: (p: MvpProfile) => Array<{
    name: string;
    description?: string;
    url?: string;
    savings?: number;
    recommended?: boolean;
  }>;
}

// ── Profile Field Definitions ────────────────────────────────────
const PROFILE_FIELDS = [
  {
    key: 'propertyType' as const,
    label: 'Wohnungstyp',
    icon: IconBuilding,
    options: [
      { value: 'wohnung', label: 'Wohnung',    icon: IconBuilding },
      { value: 'haus',    label: 'Haus / EFH', icon: IconHome },
    ],
  },
  {
    key: 'tenure' as const,
    label: 'Eigentumsstatus',
    icon: IconKey,
    options: [
      { value: 'miete',    label: 'Zur Miete',   icon: IconKey },
      { value: 'eigentum', label: 'Im Eigentum', icon: IconHome },
    ],
  },
  {
    key: 'denkmalschutz' as const,
    label: 'Denkmalschutz',
    icon: IconHome,
    options: [
      { value: 'true',  label: 'Ja',   icon: IconCheck },
      { value: 'false', label: 'Nein', icon: IconX },
    ],
  },
  {
    key: 'heatingType' as const,
    label: 'Heizungsart',
    icon: IconFlame,
    options: [
      { value: 'gas',         label: 'Gas',        icon: IconFlame },
      { value: 'oel',         label: 'Öl',         icon: IconDroplet },
      { value: 'strom',       label: 'Strom',      icon: IconBolt },
      { value: 'waermepumpe', label: 'Wärmepumpe', icon: IconLeaf },
    ],
  },
  {
    key: 'autoType' as const,
    label: 'Fahrzeug',
    icon: IconCar,
    options: [
      { value: 'verbrenner', label: 'Verbrenner', icon: IconCar },
      { value: 'eauto',      label: 'E-Auto',     icon: IconBatteryCharging },
      { value: 'hybrid',     label: 'Hybrid',     icon: IconPlug },
      { value: 'keins',      label: 'Kein Auto',  icon: IconBike },
    ],
  },
  // ── Basics ──────────────────────────────────────────────────
  {
    key: 'steuererklaerung' as const,
    label: 'Steuererklärung',
    icon: IconReceipt,
    options: [
      { value: 'true',  label: 'Erledigt',   icon: IconCheck },
      { value: 'false', label: 'Noch offen', icon: IconX },
    ],
  },
  {
    key: 'girokonto' as const,
    label: 'Kostenloses Girokonto',
    icon: IconCreditCard,
    options: [
      { value: 'true',  label: 'Vorhanden',     icon: IconCheck },
      { value: 'false', label: 'Nicht vorhanden', icon: IconX },
    ],
  },
  {
    key: 'internet' as const,
    label: 'Internet-Vertrag',
    icon: IconWifi,
    options: [
      { value: 'true',  label: 'Aktuell',        icon: IconCheck },
      { value: 'false', label: 'Nicht aktuell',  icon: IconX },
    ],
  },
  {
    key: 'mobilfunk' as const,
    label: 'Mobilfunk-Vertrag',
    icon: IconDeviceMobile,
    options: [
      { value: 'true',  label: 'Aktuell',        icon: IconCheck },
      { value: 'false', label: 'Nicht aktuell',  icon: IconX },
    ],
  },
  {
    key: 'kfzVersicherung' as const,
    label: 'KFZ-Versicherung',
    icon: IconCar,
    options: [
      { value: 'true',  label: 'Aktuell',           icon: IconCheck },
      { value: 'false', label: 'Nicht aktuell',     icon: IconX },
    ],
  },
  // ── Ausstattung (Wohnsituation Detail) ─────────────────────────
  {
    key: 'balkon' as const,
    label: 'Balkon / Loggia',
    icon: IconLeaf,
    options: [
      { value: 'true',  label: 'Vorhanden',       icon: IconCheck },
      { value: 'false', label: 'Nicht vorhanden', icon: IconX },
    ],
  },
  {
    key: 'sunHours' as const,
    label: 'Sonnenstunden Balkon',
    icon: IconSun,
    options: [
      { value: 'wenig',  label: 'Wenig (< 3 h)',    icon: IconSun },
      { value: 'mittel', label: 'Mittel (3–6 h)',   icon: IconSun },
      { value: 'viel',   label: 'Viel (6+ h)',      icon: IconSun },
    ],
  },
  {
    key: 'balkonSize' as const,
    label: 'Balkongröße',
    icon: IconHome,
    options: [
      { value: 'klein',  label: 'Klein (bis 4 m²)', icon: IconHome },
      { value: 'mittel', label: 'Mittel (4–8 m²)',  icon: IconHome },
      { value: 'gross',  label: 'Groß (8+ m²)',     icon: IconHome },
    ],
  },
  {
    key: 'garten' as const,
    label: 'Garten',
    icon: IconLeaf,
    options: [
      { value: 'true',  label: 'Vorhanden',       icon: IconCheck },
      { value: 'false', label: 'Nicht vorhanden', icon: IconX },
    ],
  },
  {
    key: 'garage' as const,
    label: 'Garage',
    icon: IconHome,
    options: [
      { value: 'true',  label: 'Vorhanden',       icon: IconCheck },
      { value: 'false', label: 'Nicht vorhanden', icon: IconX },
    ],
  },
  {
    key: 'carport' as const,
    label: 'Carport',
    icon: IconHome,
    options: [
      { value: 'true',  label: 'Vorhanden',       icon: IconCheck },
      { value: 'false', label: 'Nicht vorhanden', icon: IconX },
    ],
  },
];

// ── Tips ─────────────────────────────────────────────────────────
const ALL_TIPS: MvpTip[] = [
  {
    id: 'strom-wechsel',
    title: 'Stromtarif wechseln',
    tagline: 'Bis zu 40 % weniger Stromkosten durch Anbieterwechsel.',
    description: 'Mit Wechselpilot übernehmen wir den Wechsel komplett für Sie — automatisch zum besten Tarif, Jahr für Jahr. Sie zahlen nichts, profitieren aber dauerhaft von der günstigsten Stromrechnung.',
    why: 'Bei 3.500 kWh Jahresverbrauch zahlt eine Familie im Grundversorgungstarif schnell 400–600 € mehr als bei einem Wechseltarif mit Bonus. Stromtarife unterscheiden sich oft um 8–15 ct/kWh — und Wechselboni geben 50–250 € extra im ersten Jahr.',
    howTo: [
      'Stromzähler im Wechselpilot-Konto mit Zählernummer und Jahresverbrauch (steht auf der letzten Jahresabrechnung) hinterlegen.',
      'Wechselpilot prüft ab sofort jährlich alle Tarife in Ihrer Postleitzahl auf Top-Preis + Wechselbonus.',
      'Beim Fund eines besseren Tarifs übernimmt Wechselpilot Kündigung, Wechsel und Übergabe-Fristen — Strom fließt durchgängig weiter.',
      'Sie bleiben in der Grundversorgung versichert: Falls der neue Anbieter nicht liefert, springt automatisch der Grundversorger ein.',
    ],
    effort: '5 Min einmalig',
    difficulty: 'Einfach',
    partner: 'Octopus, Tibber, Lichtblick',
    priority: 3, category: 'energie', icon: IconBolt,
    savingsHg2: 300, savingsHg3: 450,
    condition: () => true,
  },
  {
    id: 'gas-wechsel',
    title: 'Gastarif wechseln',
    tagline: 'Neuer Gastarif spart oft mehrere hundert Euro pro Jahr.',
    description: 'Wechselpilot prüft Ihren Gastarif automatisch jedes Jahr und wechselt für Sie zum günstigsten Anbieter — ohne dass Sie selbst aktiv werden müssen. Komplett kostenlos und ohne Aufwand.',
    why: 'Gaspreise sind 2024–2026 sehr volatil. Ein Haushalt mit 15.000 kWh Jahresverbrauch zahlt in der Grundversorgung oft 300–500 € mehr als bei einem optimierten Tarif. Mit Wechselbonus kommt im ersten Jahr nochmal eine Einmalzahlung dazu.',
    actionLabel: 'Jetzt Zähler anlegen',
    actionUrl: 'https://konto.wechselpilot.com/neuer-zähler',
    howTo: [
      'Auf "Jetzt Zähler anlegen" klicken und im Wechselpilot-Konto den Gas-Zähler hinzufügen.',
      'Zählernummer und Jahresverbrauch (kWh) aus der letzten Jahresabrechnung übernehmen.',
      'Wechselpilot übernimmt ab sofort den jährlichen Tarifvergleich und Wechsel — kein weiteres Zutun nötig.',
      'Sicherheitsnetz: Bei Anbieter-Insolvenz übernimmt automatisch der Grundversorger, Sie haben nie ohne Gas dazustehen.',
    ],
    effort: '5 Min einmalig',
    difficulty: 'Einfach',
    partner: 'Vattenfall, E.ON, EnBW',
    priority: 3, category: 'energie', icon: IconFlame,
    savingsHg2: 350, savingsHg3: 550,
    condition: () => true,
  },
  {
    id: 'thermostate',
    title: 'Smarte Thermostate',
    tagline: 'Nur dann automatisch Heizen, wenn Sie zu Hause sind.',
    description: 'Smarte Thermostate heizen automatisch nur, wenn Sie zuhause sind. Studien des Fraunhofer-Instituts zeigen 8–15 % Heizkostenreduktion — bei einer Heizrechnung von 2.000 €/Jahr sind das 160–300 €.',
    why: 'Klassische Thermostate heizen "stumpf" auf eine eingestellte Temperatur. Smarte erkennen offene Fenster, regeln raumweise abhängig von Ihrer Anwesenheit und senken nachts automatisch ab. Förderung über BAFA ist bei Einzelmaßnahmen möglich.',
    howTo: [
      'Heizkörperzahl im Haushalt zählen — pro Heizkörper benötigen Sie ein Thermostat (ca. 35–60 € je Stück).',
      'Starter-Set inkl. Bridge bestellen (Komplettpaket für 4 Heizkörper: ca. 200–300 €).',
      'Alte Thermostat-Köpfe abschrauben (links drehen, lösen) und die neuen werkzeuglos aufsetzen — ca. 3 Min pro Heizkörper.',
      'App installieren, Bridge mit WLAN verbinden, alle Thermostate per Bluetooth pairen — geführt in ca. 15 Min.',
      'Heiz-Zeitpläne anlegen oder Geofencing aktivieren: Heizung springt automatisch an, wenn Sie nach Hause kommen.',
      'Optional: BAFA-Antrag für Einzelmaßnahme stellen — bis zu 15 % der Kosten werden bezuschusst.',
    ],
    effort: '1 Stunde + 200–300 € Investition',
    difficulty: 'Einfach',
    partner: 'tado°, Homematic IP',
    priority: 3, category: 'heizung', icon: IconTemperature,
    savingsHg2: 160, savingsHg3: 260,
    condition: () => true,
  },
  {
    id: 'waermepumpe',
    title: 'Wärmepumpe',
    tagline: 'Bis zu 70 % Förderung und halbierte Heizkosten.',
    description: 'Eine Wärmepumpe nutzt Umweltwärme statt Gas oder Öl und ist im Betrieb 50–70 % günstiger. Bei einem Einfamilienhaus mit ca. 20.000 kWh Heizbedarf sind das 800–1.500 € weniger pro Jahr — und zusätzlich bis zu 70 % Förderung beim Einbau.',
    why: 'Wärmepumpen arbeiten mit Strom + Umgebungswärme und erreichen einen "Wirkungsgrad" von 300–400 % (1 kWh Strom → 3–4 kWh Wärme). Bei aktuellen Strompreisen unschlagbar. Ab 2024 sind 65 % erneuerbare Heizenergie gesetzlich vorgeschrieben — Gas-/Ölheizung wird langfristig teurer (CO₂-Preis steigt).',
    howTo: [
      'Energieberatung buchen: BAFA bezuschusst die Beratung mit 80 % (max. 1.300 €). Berater berechnet Heizlast und empfiehlt Wärmepumpen-Typ.',
      'Heizflächen prüfen: Fußbodenheizung optimal, große Heizkörper auch geeignet. Bei alten kleinen Heizkörpern ggf. Austausch nötig.',
      'BEG-Förderung beantragen: 30 % Grundförderung + 5 % Klima-Bonus (Austausch funktionstüchtiger Gas-/Ölheizung) + 30 % Einkommens-Bonus (bei < 40.000 € Jahreseinkommen) = bis 70 %.',
      'Drei Festpreis-Angebote einholen: Luft-Wasser-Wärmepumpe 18.000–28.000 €, Sole-Wasser 25.000–40.000 € (inkl. Einbau, vor Förderung).',
      'Auftrag erteilen — Lieferzeit 3–6 Monate, Einbau 2–5 Werktage. Alte Heizung wird gleich entsorgt.',
      'Sofortwirkung: Nach Inbetriebnahme können Sie auf Wärmepumpen-Stromtarife wechseln (ca. 25 % günstiger).',
    ],
    effort: '3–6 Monate Projekt',
    difficulty: 'Aufwändig',
    partner: 'Thermondo, 1KOMMA5°',
    priority: 2, category: 'heizung', icon: IconLeaf,
    savingsHg2: 800, savingsHg3: 1500,
    condition: (p) => p.tenure === 'eigentum' && p.propertyType === 'haus' && p.heatingType !== 'waermepumpe',
  },
  {
    id: 'solaranlage',
    title: 'Solaranlage',
    tagline: 'Eigener Sonnenstrom statt 40 ct/kWh aus dem Netz.',
    description: 'Eine 10-kWp-Anlage mit Speicher produziert ca. 9.500 kWh/Jahr. Durch Eigenverbrauch (60–80 %) und Einspeisevergütung sparen Hausbesitzer typischerweise 1.000–1.500 € pro Jahr — bei einer Lebensdauer von 25+ Jahren.',
    why: 'Strom vom eigenen Dach kostet ca. 8–12 ct/kWh über die Lebensdauer — der Netzstrom 35–45 ct/kWh. Mit Batteriespeicher decken Sie tagsüber 30–50 % und mit Speicher bis 80 % Ihres Eigenbedarfs. Eigenverbrauch und Einspeisevergütung (8,03 ct/kWh, 20 Jahre garantiert) machen die Anlage zur sichersten Geldanlage.',
    howTo: [
      'Dach-Check: Ausrichtung Süd/Ost-West optimal, Neigung 20–60°, möglichst keine Verschattung durch Bäume oder Nachbarhäuser.',
      'Anlagengröße kalkulieren: Faustregel 1 kWp pro 1.000 kWh Jahresverbrauch + 30–50 % Reserve für künftiges E-Auto oder Wärmepumpe.',
      'Drei Festpreis-Angebote einholen — typische Preise 2025: 1.200–1.800 €/kWp inkl. Einbau. Speicher: 700–1.100 €/kWh Kapazität.',
      'Finanzierungsoptionen vergleichen: KfW-Kredit (270/271) ab 4 %, klassischer Bankkredit, Cash-Kauf oder Pacht-Modell (kein Eigenkapital nötig).',
      'Auftrag erteilen, Wartezeit 1–3 Monate. Installation: 1–2 Tage. Anbieter übernimmt Anmeldung beim Netzbetreiber + Marktstammdatenregister + Steuer.',
      'Nach Installation: Eigenverbrauch über App tracken, E-Auto/Wärmepumpe direkt mit PV-Strom betreiben.',
    ],
    effort: '2–4 Monate Projekt',
    difficulty: 'Aufwändig',
    partner: 'Enpal, Zolar',
    priority: 2, category: 'solar', icon: IconSun,
    savingsHg2: 900, savingsHg3: 1400,
    condition: (p) => p.tenure === 'eigentum' && p.propertyType === 'haus',
  },
  {
    id: 'balkonkraftwerk',
    title: 'Balkonkraftwerk',
    tagline: 'Eigener Solarstrom vom Balkon — auch für Mieter.',
    description: 'Ein 800-Watt-Set produziert in Deutschland ca. 600–800 kWh/Jahr. Bei einem Strompreis von 35 ct/kWh sind das 200–280 € Ersparnis jährlich — bei einer Investition von 400–700 €.',
    why: 'Seit 2024 vom "Solarpaket I" stark vereinfacht: Bis 800 W Wechselrichter genehmigungsfrei, normaler Schuko-Stecker erlaubt, einfache Anmeldung. Auch Mieter dürfen installieren (Beschluss BGH 2024). Steuerfrei (0 % MwSt. auf Privatanlagen).',
    howTo: [
      'Mieter: Vermieter formlos informieren — seit 2024 Anspruch auf Zustimmung außer bei optischer/baulicher Beeinträchtigung.',
      '800-Watt-Komplettset bestellen: 2 Module (je ~400 W), Wechselrichter, Halterung, ggf. Schuko-Kabel. Preis 2025: 350–700 €.',
      'Montage selbst: Module am Balkongeländer befestigen (Haltesystem mit dabei), Wechselrichter anstecken, Schuko-Stecker in normale Steckdose.',
      'Im Marktstammdatenregister online anmelden — 5 Min, Pflicht. Netzbetreiber-Anmeldung entfällt seit 2024.',
      'Optional: Smart Plug für Echtzeit-Anzeige der Stromerzeugung in der App.',
      'Amortisation: 3–5 Jahre, danach 15+ Jahre kostenloser Strom.',
    ],
    effort: '1–2 Stunden Aufbau',
    difficulty: 'Einfach',
    partner: 'Yuma, Priwatt',
    priority: 2, category: 'solar', icon: IconSun,
    savingsHg2: 180, savingsHg3: 240,
    condition: (p) => {
      if (p.tenure === 'eigentum' && p.propertyType === 'haus') return false;
      // Nur empfehlen wenn Balkon explizit bestätigt (nicht bei null/undefined)
      if (p.equipment?.balkon !== true) return false;
      if (p.equipment?.sunHours === 'wenig') return false;
      // Denkmalschutz + strenges Bundesland → BKW nicht empfehlen
      if (p.denkmalschutz === true) {
        const dz = getDenkmalschutzInfo(p.plz || '');
        if (dz && dz.info.category === 'strict') return false;
      }
      return true;
    },
    getOffers: (p) => {
      const size = p.equipment?.balkonSize;
      const KK_XL = {
        name: 'Kleines Kraftwerk — XL Duo',
        description: '1000 Wp bifazial · ideal für kleine Balkone',
        url: 'https://kleineskraftwerk.de/products/kleines-kraftwerk-xl-duo-komplettpaket-mit-optionaler-halterung-1000wp-bifazial?pub=wechselpilot',
        savings: 200,
      };
      const KK_FLEX = {
        name: 'Kleines Kraftwerk — Flex 4×/8×',
        description: '900–1.800 Wp · für mittlere Balkone',
        url: 'https://kleineskraftwerk.de/products/kleines-kraftwerk-flex-4x-8x-komplettpaket-900-wp-1800-wp-deal?pub=wechselpilot',
        savings: 320,
      };
      const KK_QUATTRO = {
        name: 'Kleines Kraftwerk — XL Quattro 2000 Wp + Solarbank',
        description: '2000 Wp + Anker Solarbank 3 E2700 Pro · für große Balkone',
        url: 'https://kleineskraftwerk.de/products/deal-kleines-kraftwerk-xl-2000wp-quattro-mit-optionaler-halterung-und-anker-solarbank-3-e2700-pro?pub=wechselpilot',
        savings: 540,
      };
      // Balkonstrom — Produktvarianten je nach Balkongröße
      const BS_KLEIN = {
        name: 'Balkonstrom Klein',
        description: 'Kompakt-Set ab 600 Wp · für kleine Balkone',
        url: 'https://balkonstrom.de',
        savings: 180,
      };
      const BS_FLEX = {
        name: 'Balkonstrom Flexibel',
        description: 'Modular ausbaubar 800–1.200 Wp · für mittlere Balkone',
        url: 'https://balkonstrom.de',
        savings: 240,
      };
      const BS_XL = {
        name: 'Balkonstrom XL',
        description: '1.600–2.000 Wp + optionaler Speicher · für große Balkone',
        url: 'https://balkonstrom.de',
        savings: 360,
      };

      const offers: Array<{ name: string; description?: string; url?: string; savings?: number; recommended?: boolean }> = [];
      if (size === 'klein') {
        offers.push({ ...KK_XL, recommended: true });
        offers.push(BS_KLEIN);
      } else if (size === 'mittel') {
        offers.push({ ...KK_XL, recommended: true });
        offers.push(KK_FLEX);
        offers.push(BS_FLEX);
      } else if (size === 'gross') {
        offers.push({ ...KK_XL, recommended: true });
        offers.push(KK_FLEX);
        offers.push(KK_QUATTRO);
        offers.push(BS_XL);
      } else {
        // Unbekannte Größe → Standard-Empfehlung
        offers.push({ ...KK_XL, recommended: true });
        offers.push(KK_FLEX);
        offers.push(BS_FLEX);
      }
      return offers;
    },
  },
  {
    id: 'kfz-versicherung',
    title: 'KFZ-Versicherung wechseln',
    tagline: 'Gleicher Schutz, oft 200–500 € günstiger pro Jahr.',
    description: 'KFZ-Tarife unterscheiden sich bei gleicher Leistung oft um 200–500 € pro Jahr. Eine durchschnittliche Vollkaskoversicherung kostet 800–1.200 € — Wechsler sparen typischerweise 25–40 %.',
    why: 'Versicherer locken Neukunden mit Rabatten und subventionieren diese mit höheren Beiträgen bei Bestandskunden — der sog. Treue-Strafe. Ein jährlicher Vergleich nutzt diese Logik aus. Schadenfreiheitsklasse, Bonus-Schutz und Werkstattbindung bleiben beim Wechsel erhalten.',
    howTo: [
      'Vertragsdetails sammeln: aktuelle Jahresprämie, Vertragsende, Schadenfreiheitsklasse (SFR), gefahrene Jahres-km (steht auf der Rechnung). Standard-Vertragsende: 31. Dezember, Kündigungsfrist: 1 Monat (bis 30. November).',
      'Online-Vergleich starten: Check24, Verivox, HUK24 — Eingabe dauert 5–10 Min. Fahrzeugschein bereithalten.',
      'Tarif-Stellschrauben prüfen: Werkstattbindung (5–15 % günstiger), Selbstbeteiligung erhöhen (z.B. von 300 auf 500 €), Garage statt Straße angeben.',
      'Bei besserem Angebot: Aktuelle Versicherung schriftlich kündigen (Mustertext im Portal). Neuen Vertrag zum 1. Januar abschließen.',
      'SFR-Übertragung: läuft automatisch zwischen den Versicherern. Versicherungsschein kommt per Post oder PDF.',
      'Sonderkündigungsrecht: Bei Beitragserhöhung oder Schadenfall haben Sie 1 Monat zum Wechsel — auch außerhalb des Standard-Termins.',
    ],
    effort: '20 Min einmal jährlich',
    difficulty: 'Einfach',
    partner: 'Clark, Tarifcheck, HUK24',
    priority: 3, category: 'mobilitaet', icon: IconCar,
    savingsHg2: 200, savingsHg3: 300,
    condition: (p) => p.autoType !== 'keins' && p.autoType !== '',
  },
  {
    id: 'thg-praemie',
    title: 'THG-Prämie',
    tagline: 'Geschenkte Prämie fürs E-Auto in nur 5 Minuten.',
    description: 'Als E-Auto-Fahrer haben Sie Anspruch auf die staatliche THG-Quote. Die Auszahlungen sind 2024–2026 stark gefallen — aktuell 70–110 € pro E-Auto und Jahr. Trotzdem geschenktes Geld für 5 Min Aufwand.',
    why: 'CO₂-Pflicht-Unternehmen (Mineralölkonzerne) müssen Quoten erfüllen. Ihr E-Auto spart CO₂ → Sie können die Quote verkaufen. Vermittler bündeln viele Halter und reichen die Quote beim Umweltbundesamt ein.',
    howTo: [
      'Vermittler vergleichen: Festpreis-Anbieter sind sicher (Auszahlung garantiert), Flexpreis-Anbieter zahlen bei guten Marktpreisen mehr. 2025 typisch: 80–120 €.',
      'Fahrzeugschein-Fotos (Vorder- und Rückseite, hochauflösend) und IBAN online hochladen — dauert 3–5 Min.',
      'Vermittler reicht Quote beim Umweltbundesamt ein (Prüfung 6–10 Wochen), zahlt dann auf Ihr Konto aus.',
      'Antrag jährlich erneut: Frist ist immer 28. Februar des Folgejahres. Viele Vermittler erinnern automatisch per Mail.',
      'Tipp: Jährlich Vermittler vergleichen — Preise ändern sich stark zwischen den Anbietern.',
    ],
    effort: '5 Min einmal jährlich',
    difficulty: 'Einfach',
    partner: 'Geld für eAuto',
    priority: 1, category: 'mobilitaet', icon: IconBatteryCharging,
    savingsHg2: 250, savingsHg3: 280,
    condition: (p) => (p.vehicles?.eauto ?? 0) > 0 || p.autoType === 'eauto',
  },
  {
    id: 'wallbox',
    title: 'Wallbox / Laden zuhause',
    tagline: 'Zuhause laden zum halben Preis öffentlicher Säulen.',
    description: 'Heimladen mit Wallbox kostet ca. 35 ct/kWh (Hausstrom) vs. 55–80 ct/kWh an öffentlichen Schnellladern. Bei 15.000 km/Jahr und 18 kWh/100km sparen Sie 400–800 €. Mit eigener PV-Anlage Eigenverbrauch zu ~12 ct/kWh: bis zu 1.000 € Ersparnis.',
    why: 'Öffentliche Ladesäulen verlangen happige Aufschläge (DC-Schnelllader oft 70+ ct/kWh). Eine 11-kW-Wallbox lädt das Auto über Nacht voll und nutzt günstige Heimstrom-Tarife oder bei PV den eigenen Solarstrom. Spezielle Autostrom-Tarife (Wechselpilot-Empfehlung!) liegen oft bei 25–28 ct/kWh.',
    howTo: [
      'Wallbox-Modell wählen: 11 kW Standard (genehmigungsfrei beim Netzbetreiber, Anmeldung reicht), ab 22 kW genehmigungspflichtig. Smart-Wallbox mit App ab 800 €.',
      'Elektriker-Angebot einholen: Anschluss inkl. eigener Leitung + FI Typ B + Verteiler-Anpassung kostet typisch 600–1.500 €.',
      'Wallbox beim Netzbetreiber online anmelden — 5 Min Formular, kostenlos. Erfolgt vor Installation.',
      'Installation: halber Tag vom Elektriker. Direkt einsatzbereit nach Inbetriebnahme.',
      'Optional bei PV: Überschussladen aktivieren — lädt nur, wenn Solar-Überschuss vorhanden ist. Spart weitere 50–100 % auf den Ladestrom.',
      'Autostrom-Tarif abschließen (separater Zähler nötig) — spart 7–12 ct/kWh gegenüber Haushaltsstrom.',
    ],
    effort: '1–2 Wochen Projekt',
    difficulty: 'Mittel',
    partner: 'Enpal, charge.cloud',
    priority: 1, category: 'mobilitaet', icon: IconBatteryCharging,
    savingsHg2: 350, savingsHg3: 600,
    condition: (p) => {
      const hasEV = (p.vehicles?.hybrid ?? 0) > 0 || (p.vehicles?.eauto ?? 0) > 0 || p.autoType === 'hybrid';
      // Wenn Garage/Carport explizit "nicht vorhanden" → keine Wallbox-Empfehlung
      const noParkSpace = p.equipment?.garage === false && p.equipment?.carport === false;
      return hasEV && !noParkSpace;
    },
  },
  {
    id: 'internet-wechsel',
    title: 'Internet-Anbieter wechseln',
    tagline: 'Neukunden-Tarife sparen 15–25 € pro Monat.',
    description: 'Stammkunden zahlen für 100-Mbit-DSL durchschnittlich 35–45 €/Monat, Neukunden bekommen denselben Tarif oft für 20–25 €/Monat im ersten Jahr. Das sind 180–300 € Ersparnis im Jahr — und der Wechsel ist meist 1 Klick.',
    why: 'Internet-Anbieter subventionieren Neukunden mit Rabatten und kompensieren das durch höhere Bestandskunden-Preise. Wechselbonus, Hardware-Aktionen und 12 Monate Neukunden-Rabatt machen jährliche Wechsel-Strategie lukrativ.',
    howTo: [
      'Vertragsende und Mindestlaufzeit prüfen — steht auf der monatlichen Rechnung. Standard-Kündigungsfrist: 1 Monat (Gesetzesänderung 2022).',
      'Verfügbarkeit + Tarifvergleich nach Postleitzahl starten (Verivox, Check24) — Bandbreite, Mindestlaufzeit, Neukunden-Bonus, Hardware vergleichen.',
      'Wechselservice nutzen: Neuer Anbieter übernimmt Kündigung beim Alten + Anschlussschaltung. Kein Internet-Ausfall.',
      'Alternative ohne Wechsel: Bestandskunden-/Kündigungshotline anrufen, „Mein Vertrag läuft aus, ich überlege zu wechseln." → bekommen Sie meist Neukunden-Tarif. Spart 30–40 % in 10 Min.',
      'Bei Glasfaser-Verfügbarkeit: Wechsel besonders lukrativ — gleicher Preis, deutlich schneller. Ggf. Hausanschluss kostenfrei.',
    ],
    effort: '15 Min einmal jährlich',
    difficulty: 'Einfach',
    partner: 'Verivox, Check24',
    priority: 2, category: 'kommunikation', icon: IconWifi,
    savingsHg2: 180, savingsHg3: 240,
    condition: () => true,
  },
  {
    id: 'mobilfunk-wechsel',
    title: 'Mobilfunk-Tarif optimieren',
    tagline: 'Gleiches Netz, gleiches GB — für die Hälfte der Kosten.',
    description: 'Viele Nutzer zahlen 30–50 €/Monat für 10 GB im D-Netz, obwohl gleiche Leistung als Neukunde für 12–20 €/Monat zu haben ist. Bei jährlichem Wechsel: 200–400 € Ersparnis. Bei Smartphones im Vertrag: auf Sim-Only-Tarif + separates Handy umstellen.',
    why: 'Mobilfunk-Anbieter haben hohe Margen bei Bestandskunden. Neukunden-Aktionen sind dauerhaft verfügbar. Mit Rufnummer-Mitnahme behalten Sie Ihre Nummer und können fast risikofrei jährlich wechseln.',
    howTo: [
      'Datenverbrauch der letzten 3 Monate in der App prüfen — meist deutlich unter dem gebuchten Volumen. Mehrheit braucht < 10 GB/Monat.',
      'Anforderungen festlegen: Datenvolumen, gewünschtes Netz (D1 = Telekom, D2 = Vodafone, O2), 5G ja/nein, EU-Roaming ja/nein.',
      'Tarif-Vergleich starten — Sim-Only-Tarife im D-Netz mit 10 GB gibt es 2025 ab 9,99 €/Monat (z.B. Aldi Talk, Lidl Connect, Tarifhaus).',
      'Rufnummer-Mitnahme im Bestellprozess aktivieren — neuer Anbieter kümmert sich, dauert 1–2 Tage Übergang.',
      'Alternative ohne Wechsel: Bei aktuellem Anbieter Kündigungs-Hotline anrufen, Verlängerungsangebot abwarten — oft 30–50 % günstiger als Bestandstarif.',
      'Bei Handyvertrag: Auf Sim-Only umstellen, separates Handy kaufen oder gebraucht — über 24 Monate gerechnet meist 200–400 € günstiger.',
    ],
    effort: '20 Min einmal jährlich',
    difficulty: 'Einfach',
    partner: 'Check24, Verivox',
    priority: 2, category: 'kommunikation', icon: IconDeviceMobile,
    savingsHg2: 150, savingsHg3: 250,
    condition: () => true,
  },
  {
    id: 'steuererklaerung',
    title: 'Steuererklärung einreichen',
    tagline: 'Durchschnittlich 1.095 € Rückerstattung pro Jahr.',
    description: 'Laut Statistischem Bundesamt erhalten Steuerzahler in Deutschland durchschnittlich 1.095 € zurück. Mit modernen Steuer-Apps ist die Erklärung in 30–60 Minuten erledigt — ohne Steuerwissen, ohne ELSTER-Formulare.',
    why: 'Werbungskosten (Fahrtkosten, Homeoffice-Pauschale 6 €/Tag, Arbeitsmittel, Fortbildung), Versicherungsbeiträge, Spenden, Handwerker- und haushaltsnahe Dienstleistungen werden vom zu versteuernden Einkommen abgezogen → mehr Steuern zurück. Frist: 31. Juli des Folgejahres (bei Steuer-App-Nutzung: 30. April Folge-Folgejahr).',
    howTo: [
      'Unterlagen sammeln (10 Min): Lohnsteuerbescheinigung (vom Arbeitgeber), Bescheid Krankenkasse, Quittungen Werbungskosten, Spendenbelege, Handwerker-/Pflegekosten-Rechnungen.',
      'Steuer-App wählen: Taxfix (App-only, ab 50 € pauschal), WISO Steuer (35–45 €, mit Excel-Export), Zasta (Steuerberater-Variante 99 €), kostenlos: ELSTER.',
      'Fragen Schritt für Schritt beantworten — geführter Fragebogen, ca. 30–60 Min. Voraus-Berechnung der Rückerstattung läuft live.',
      'Steuererklärung digital einreichen (ELSTER-Signatur automatisch). Keine Unterlagen mehr ans Finanzamt schicken — werden auf Anforderung nachgereicht.',
      'Bescheid kommt in 4–10 Wochen, Rückerstattung direkt aufs Konto.',
      'Tipp: 4 Jahre rückwirkend möglich (2021 bis 31.12.2025 noch einreichbar)! Bei Studierenden + alten Werbungskosten oft mehrere tausend Euro Rückerstattung.',
    ],
    partner: 'Taxfix, WISO, Zasta',
    partnerLinks: [
      { name: 'Taxfix', url: 'https://taxfix.de',           logo: '/apps/wpilot-home/assets/partners/taxfix.png' },
      { name: 'WISO',   url: 'https://www.wiso-steuer.de',  logo: '/apps/wpilot-home/assets/partners/wiso.png' },
      { name: 'Zasta',  url: 'https://www.zasta.de',        logo: '/apps/wpilot-home/assets/partners/zasta.png' },
    ],
    effort: '30–60 Min einmal jährlich',
    difficulty: 'Einfach',
    priority: 3, category: 'finanzen', icon: IconReceipt,
    savingsHg2: 1095, savingsHg3: 1200,
    condition: () => true,
  },
  {
    id: 'kostenloses-girokonto',
    title: 'Kostenloses Girokonto',
    tagline: 'Kontoführung 0 € — plus Wechselbonus geschenkt.',
    description: 'Klassische Filialbanken kassieren oft 4–10 €/Monat Kontoführungsgebühr, plus Girocard-Gebühr, plus Auslands-Aufschläge. Direktbanken bieten ein vollwertiges Konto mit Karte komplett kostenlos. Ersparnis: 60–120 €/Jahr.',
    why: 'Direktbanken (ING, DKB, Comdirect, C24 Bank) finanzieren sich über andere Einnahmequellen und können das Girokonto kostenlos anbieten — bei voller Funktionalität (Überweisung, Girocard, Apple/Google Pay, kostenfreies Geldabheben an vielen Automaten). Bonus: oft 50–100 € Wechselbonus.',
    howTo: [
      'Vergleich starten: Kontoführungsgebühr 0 €, kein Mindestgeldeingang, Girocard inkl., kostenloses Bargeld an > 5 Automaten-Netzwerken. Empfehlungen: ING, DKB, Comdirect, C24 Bank.',
      'Online eröffnen: Video-Ident per Smartphone, Ausweis bereit halten, dauert 15–20 Min.',
      'Kontoumzugs-Service nutzen: Neue Bank überträgt Daueraufträge + Lastschriften automatisch + informiert Arbeitgeber und Vertragspartner über neue IBAN.',
      'Altes Konto **erst** kündigen, wenn alle Zahlungen 1–2 Monate sauber auf dem neuen laufen — sonst Lastschrift-Rückgaben.',
      'Wechselbonus mitnehmen: Viele Banken zahlen 50–150 € Prämie bei Gehaltseingang + Bonus für Mastercard/Kreditkarte-Nutzung.',
    ],
    effort: '30 Min einmalig',
    difficulty: 'Einfach',
    partner: 'ING, DKB',
    priority: 1, category: 'finanzen', icon: IconPig,
    savingsHg2: 80, savingsHg3: 100,
    condition: () => true,
  },

  // ── Gratis / Verhaltens-Tipps ────────────────────────────────────
  {
    id: 'heizung-1-grad',
    title: 'Heizung 1 °C kälter',
    tagline: 'Jedes Grad weniger spart 6 % Heizenergie — kostenlos.',
    description: 'Jedes Grad weniger Raumtemperatur spart laut Verbraucherzentrale rund 6 % Heizenergie. Bei einer Heizrechnung von 1.500 €/Jahr sind das 90 € — ohne einen Cent zu investieren.',
    why: 'Die meisten Wohnungen werden auf 22–23 °C beheizt, empfohlen sind 19–21 °C im Wohnbereich und 17–18 °C im Schlafzimmer. Die gefühlte Wärme bleibt fast gleich — der Verbrauch sinkt deutlich.',
    howTo: [
      'Thermometer in jeden Raum stellen (Smartphone-App reicht).',
      'Wohnzimmer: 20 °C statt 22 °C. Schlafzimmer: 17 °C. Küche/Flur: 18 °C.',
      'Bei Abwesenheit > 6 h auf 16 °C absenken (nicht ganz aus — Auskühlen kostet mehr Energie beim Wiederaufheizen).',
      'Türen zu kühleren Räumen geschlossen halten — sonst zieht Feuchtigkeit dorthin und es gibt Schimmelrisiko.',
    ],
    effort: 'Sofort',
    difficulty: 'Einfach',
    partner: '',
    priority: 1, category: 'heizung', icon: IconTemperature,
    savingsHg2: 90, savingsHg3: 150,
    condition: () => true,
  },
  {
    id: 'stosslueften',
    title: 'Stoßlüften statt Kipplüften',
    tagline: 'Frische Luft in 5 Minuten — ohne Wärme zu verlieren.',
    description: '5 Minuten Stoßlüften 3× am Tag tauscht die Raumluft komplett aus — bei minimalem Wärmeverlust. Dauerhaft gekippte Fenster lassen Wände auskühlen und kosten 100–200 €/Jahr extra.',
    why: 'Bei Kippstellung kühlen die Fensterlaibungen und Wände rund um das Fenster langsam aus — die Heizung läuft permanent dagegen an. Stoßlüften (Fenster ganz auf, kurz) tauscht die Luft aus, bevor Wände auskühlen können.',
    howTo: [
      'Morgens nach dem Aufstehen 5 Min Querlüften (gegenüberliegende Fenster auf).',
      'Mittags und abends jeweils 5 Min wiederholen.',
      'Während des Lüftens Thermostate runterdrehen.',
      'Im Winter reichen 3–5 Min, im Sommer 10–15 Min.',
    ],
    effort: 'Sofort, täglich',
    difficulty: 'Einfach',
    partner: '',
    priority: 2, category: 'heizung', icon: IconLeaf,
    savingsHg2: 60, savingsHg3: 100,
    condition: () => true,
  },
  {
    id: 'heizkoerper-entlueften',
    title: 'Heizkörper entlüften',
    tagline: 'Volle Heizleistung mit einem 2-Euro-Schlüssel.',
    description: 'Luft im Heizkörper reduziert die Heizleistung um bis zu 15 %. Einmal jährlich entlüften (vor der Heizsaison) bringt 30–80 € Ersparnis pro Jahr und sorgt für gleichmäßige Wärme.',
    why: 'Wenn der Heizkörper oben kalt bleibt oder gluckert, ist Luft drin — das Wasser zirkuliert nicht mehr richtig, die Heizung läuft länger für die gleiche Wärme.',
    howTo: [
      'Heizung auf höchste Stufe drehen, 10 Min warten bis das System unter Druck steht.',
      'Eimer und Lappen bereitstellen, Entlüftungsschlüssel (Baumarkt, ~2 €) ansetzen.',
      'Ventil oben am Heizkörper langsam öffnen — Luft zischt heraus.',
      'Sobald Wasser austritt: zudrehen. Fertig.',
      'Heizungsdruck am Manometer prüfen (1,5–2 bar). Falls zu niedrig: Wasser nachfüllen lassen.',
    ],
    effort: '15 Min einmal jährlich',
    difficulty: 'Einfach',
    partner: '',
    priority: 2, category: 'heizung', icon: IconTool,
    savingsHg2: 40, savingsHg3: 70,
    condition: () => true,
  },
  {
    id: 'standby-aus',
    title: 'Standby-Geräte ausschalten',
    tagline: '100 € pro Jahr sparen mit einer 8-Euro-Steckerleiste.',
    description: 'Ein durchschnittlicher Haushalt verschwendet 80–120 €/Jahr durch Geräte im Standby. TV, Konsolen, Drucker, Ladegeräte ziehen Strom — auch wenn sie aus zu sein scheinen.',
    why: 'Studien des Umweltbundesamts zeigen: 10 % des Stromverbrauchs eines Haushalts entstehen durch Standby. Bei 1.000 €/Jahr Stromrechnung sind das 100 €. Schaltbare Steckdosenleisten kosten 8–15 € — Amortisation in wenigen Wochen.',
    howTo: [
      'Schaltbare Steckdosenleisten besorgen (ab 8 € im Baumarkt/Online).',
      'TV + Soundbar + Konsole an eine Leiste — abends einmal ausschalten.',
      'Drucker, Scanner an eine zweite Leiste — meist wochenlang nicht gebraucht.',
      'Smart-Plugs (15–25 €) mit Zeitplan: schalten nachts automatisch ab.',
      'Achtung: Router, Kühlschrank, Gefriertruhe NICHT abschalten.',
    ],
    effort: '20 Min einmalig',
    difficulty: 'Einfach',
    partner: '',
    priority: 2, category: 'energie', icon: IconPlug,
    savingsHg2: 70, savingsHg3: 110,
    condition: () => true,
  },
  {
    id: 'duschen-kuerzer',
    title: 'Duschzeit auf 5 Min reduzieren',
    tagline: 'Eine Minute weniger duschen spart 100 € pro Jahr.',
    description: 'Eine Minute weniger duschen pro Person und Tag spart laut co2online 100–150 €/Jahr Warmwasser- und Stromkosten in einem 4-Personen-Haushalt. Ein Sparduschkopf bringt zusätzlich 50–80 € pro Jahr.',
    why: 'Warmwasser ist nach Heizung der zweitgrößte Energieposten im Haushalt. Eine Person verbraucht beim Duschen ca. 60–80 Liter Wasser — 1 Minute weniger spart 12–15 L plus die Energie zum Aufheizen.',
    howTo: [
      'Timer (Smartphone oder analog) auf 5 Min stellen — funktioniert nach 2 Wochen automatisch.',
      'Sparduschkopf installieren (ab 25 €): halbiert den Wasserdurchfluss ohne Komfortverlust.',
      'Beim Einseifen Wasser ausstellen (gerade bei mehreren Personen wirksam).',
      'Wassertemperatur eine Stufe runter: spart Energie zum Aufheizen.',
    ],
    effort: 'Sofort',
    difficulty: 'Einfach',
    partner: '',
    priority: 2, category: 'energie', icon: IconDroplet,
    savingsHg2: 80, savingsHg3: 160,
    condition: () => true,
  },
  {
    id: 'kuehlschrank-7-grad',
    title: 'Kühlschrank auf 7 °C einstellen',
    tagline: 'Gleich frisch, aber 15 % weniger Stromverbrauch.',
    description: 'Viele Kühlschränke laufen unnötig kalt auf 4–5 °C. Empfohlen sind 7 °C — Lebensmittel bleiben gleich frisch, der Stromverbrauch sinkt um 10–15 % (25–40 €/Jahr).',
    why: 'Jedes Grad kälter erhöht den Stromverbrauch um ~6 %. 7 °C ist die optimale Lagertemperatur laut BMEL für die meisten Lebensmittel. Gefrierfach: -18 °C reicht — kälter verbraucht nur mehr Strom.',
    howTo: [
      'Thermometer ins Kühlschrank-Mittelfach für 2 h legen.',
      'Bei < 7 °C: Regler eine Stufe wärmer drehen, nochmal prüfen.',
      'Türen geschlossen halten — jede Öffnung kostet 30 Sekunden Kompressorlaufzeit.',
      'Rückseite alle 6 Monate abstauben — Staub verschlechtert Wärmeabgabe und kostet 10–15 % mehr Strom.',
      'Dichtung prüfen: Papierblatt einklemmen, Tür schließen — wenn es leicht rausrutscht, Dichtung tauschen (15–25 €).',
    ],
    effort: '10 Min einmalig',
    difficulty: 'Einfach',
    partner: '',
    priority: 3, category: 'energie', icon: IconLeaf,
    savingsHg2: 15, savingsHg3: 25,
    condition: () => true,
  },
];

// ── Cluster definitions ──────────────────────────────────────────
function buildClusters(profile: MvpProfile, tips: MvpTip[]): { title: string; tips: MvpTip[] }[] {
  const byCategory: Record<string, MvpTip[]> = {};
  for (const t of tips) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  }

  const heizungLabel: Record<string, string> = {
    gas:         'Spartipps für Ihre Gasheizung',
    oel:         'Spartipps für Ihre Ölheizung',
    strom:       'Spartipps für Ihre Stromheizung',
    waermepumpe: 'Ihre Wärmepumpe optimieren',
  };

  const clusterDefs: { key: string; title: string }[] = [
    {
      key: 'energie',
      title: 'Energie & Tarife',
    },
    {
      key: 'versicherung',
      title: 'KFZ-Versicherung',
    },
    {
      key: 'heizung',
      title: heizungLabel[profile.heatingType] ?? (
        profile.tenure === 'eigentum' && profile.propertyType === 'haus'
          ? 'Heizung & Modernisierung'
          : 'Heizung optimieren'
      ),
    },
    {
      key: 'finanzen',
      title: 'Steuern & Finanzen',
    },
    {
      key: 'kommunikation',
      title: 'Internet & Mobilfunk',
    },
    {
      key: 'mobilitaet',
      title:
        profile.autoType === 'eauto'      ? 'Spartipps für Ihr E-Auto' :
        profile.autoType === 'hybrid'     ? 'Spartipps für Ihr Hybrid-Fahrzeug' :
        profile.autoType === 'verbrenner' ? 'Spartipps für Ihr Auto' :
        'Mobilität',
    },
    {
      key: 'solar',
      title:
        profile.propertyType === 'haus' && profile.tenure === 'eigentum'
          ? 'Solar für Ihr Haus'
          : profile.tenure === 'eigentum'
          ? 'Solar für Ihre Eigentumswohnung'
          : 'Solar für Ihre Mietwohnung',
    },
  ];

  return clusterDefs
    .map(c => ({ title: c.title, tips: (byCategory[c.key] || []).sort((a, b) => b.priority - a.priority) }))
    .filter(c => c.tips.length > 0);
}

// ── Design Tokens (Wechselpilot Brand) ───────────────────────────
const BLUE      = '#5782B0';   // brand.blueLight (Gas-Claim Blau)
const BLUE_LT   = '#EDF2F9';
const BLUE_DK   = '#3D5261';   // brand.primary
const GREEN     = '#558D6D';   // brand.green
const GREEN_LT  = '#E2EEE7';   // sehr heller Tint
const ORANGE    = '#F9AA00';   // brand.accent — gelb/orange
const ORANGE_LT = '#FEEECC';
const DARK      = '#3D5261';   // brand.primary
const BG        = '#F4F4F4';   // brand.background
const WHITE     = '#FFFFFF';
const BORDER    = '#C2C7CB';   // semantic.border / muted
const TEXT      = '#44607F';   // brand.text
const TEXT_MUTED  = '#7E8990';
const TEXT_DIM    = '#A8AEB3';
const PRIMARY     = DARK;
const GREEN_DARK  = '#436F56'; // brand.greenDark
const GREY_800    = TEXT;

const PRIORITY_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  3: { bg: GREEN_LT,  text: GREEN,      label: 'Top' },
  2: { bg: ORANGE_LT, text: '#92400e',  label: 'Empfohlen' },
  1: { bg: '#f3f4f6', text: TEXT_MUTED, label: 'Tipp' },
};

function fmt(n: number) { return n.toLocaleString('de-DE'); }

// ── Animated Counter ─────────────────────────────────────────────
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const hasAnimatedRef = React.useRef(false);
  const displayRef = React.useRef(0);
  useEffect(() => {
    const isFirstRun = !hasAnimatedRef.current;
    hasAnimatedRef.current = true;
    const from = isFirstRun ? 0 : displayRef.current;
    const target = value;
    if (from === target) return;
    // Initial mount: longer count-up. Subsequent changes: shorter smooth tween.
    const duration = isFirstRun ? 1200 : 450;
    const t0 = performance.now();
    let rafId: number;
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (target - from) * eased);
      displayRef.current = v;
      setDisplay(v);
      if (p < 1) rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value]);
  return <>{fmt(display)}{suffix}</>;
}

// ── Profile Edit View ────────────────────────────────────────────
function ProfileEditView({
  profile, onSave, onBack,
}: {
  profile: MvpProfile;
  onSave: (p: MvpProfile) => void;
  onBack: () => void;
}) {
  const [local, setLocal] = useState<MvpProfile>(profile);
  const [openField, setOpenField] = useState<string | null>(null);
  // Collapsed sections (default: basisdaten + wohnen expanded, rest collapsed)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set(['bewohner', 'mobilitaet', 'finanzen', 'kommunikation', 'versicherung']));
  function toggleSection(key: string) {
    setCollapsed(prev => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  }

  const EQUIPMENT_KEYS = new Set(['balkon', 'sunHours', 'balkonSize', 'garten', 'garage', 'carport']);

  function getStrVal(field: typeof PROFILE_FIELDS[0]) {
    let v: any;
    if (EQUIPMENT_KEYS.has(field.key as string)) {
      v = (local.equipment ?? ({} as any))[field.key];
    } else {
      v = (local as any)[field.key];
    }
    return v === true ? 'true' : v === false ? 'false' : String(v ?? '');
  }

  function selectOption(fieldKey: string, value: string) {
    const coerced: any = value === 'true' ? true : value === 'false' ? false : value;
    let updated: MvpProfile;
    if (EQUIPMENT_KEYS.has(fieldKey)) {
      const cur = local.equipment ?? { balkon: null, sunHours: null, garten: null, garage: null, carport: null };
      const nextEq = { ...cur, [fieldKey]: coerced };
      // If balkon was set to false → reset sunHours
      if (fieldKey === 'balkon' && coerced !== true) nextEq.sunHours = null;
      updated = { ...local, equipment: nextEq };
    } else {
      updated = { ...local, [fieldKey]: coerced };
    }
    setLocal(updated);
    localStorage.setItem('wpilot_mvp_profile', JSON.stringify(updated));
    onSave(updated);
    setOpenField(null);
  }

  function setResidents(key: keyof Residents, delta: number) {
    const cur = local.residents ?? { mitbewohner: 0, kinder: 0, untermieter: 0, haustiere: 0 };
    const next = { ...cur, [key]: Math.max(0, cur[key] + delta) };
    updateLocal({ residents: next });
  }

  function setWohnflaeche(qm: number | null) {
    updateLocal({ wohnflaeche: qm });
  }

  function updateLocal(patch: Partial<MvpProfile>) {
    const updated = { ...local, ...patch };
    setLocal(updated);
    localStorage.setItem('wpilot_mvp_profile', JSON.stringify(updated));
    onSave(updated);
  }

  type VehicleType = 'verbrenner' | 'eauto' | 'hybrid';
  const VEHICLE_META: Record<VehicleType, { label: string; icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }> }> = {
    verbrenner: { label: 'Verbrenner', icon: IconCar },
    eauto:      { label: 'E-Auto',     icon: IconBatteryCharging },
    hybrid:     { label: 'Hybrid',     icon: IconPlug },
  };

  function addVehicle(type: VehicleType) {
    const v = local.vehicles ?? { verbrenner: 0, eauto: 0, hybrid: 0 };
    updateLocal({
      vehicles: { ...v, [type]: v[type] + 1 },
      autoType: 'has-vehicles',
    });
  }

  function removeVehicle(type: VehicleType) {
    const v = local.vehicles ?? { verbrenner: 0, eauto: 0, hybrid: 0 };
    const newV = { ...v, [type]: Math.max(0, v[type] - 1) };
    const total = newV.verbrenner + newV.eauto + newV.hybrid;
    updateLocal({
      vehicles: newV,
      autoType: total > 0 ? 'has-vehicles' : '',
    });
  }

  function setNoVehicle() {
    updateLocal({
      vehicles: { verbrenner: 0, eauto: 0, hybrid: 0 },
      autoType: 'keins',
    });
  }

  // Section grouping
  const SECTIONS: { key: string; title: string; icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>; fieldKeys: string[] }[] = [
    { key: 'basisdaten',    title: 'Basisdaten',     icon: IconHome,          fieldKeys: [] }, // custom rendering (PLZ)
    { key: 'wohnen',        title: 'Wohnsituation',  icon: IconHome,          fieldKeys: ['propertyType', 'tenure', 'denkmalschutz', 'heatingType', 'balkon', 'sunHours', 'balkonSize', 'garten', 'garage', 'carport'] },
    { key: 'bewohner',      title: 'Bewohner',       icon: IconUsers,         fieldKeys: [] }, // custom rendering
    { key: 'mobilitaet',    title: 'Mobilität',      icon: IconCar,           fieldKeys: ['autoType'] },
    { key: 'finanzen',      title: 'Finanzen',       icon: IconReceipt,       fieldKeys: ['steuererklaerung', 'girokonto'] },
    { key: 'kommunikation', title: 'Kommunikation',  icon: IconWifi,          fieldKeys: ['internet', 'mobilfunk'] },
    { key: 'versicherung',  title: 'KFZ-Versicherung', icon: IconCar,   fieldKeys: ['kfzVersicherung'] },
  ];

  // Profile summary for hero
  const propertyLabel = local.propertyType === 'haus' ? 'Haus' : local.propertyType === 'wohnung' ? 'Wohnung' : null;
  const tenureLabel = local.tenure === 'eigentum' ? 'Eigentum' : local.tenure === 'miete' ? 'Miete' : null;
  const vehicleTotal = (local.vehicles?.verbrenner ?? 0) + (local.vehicles?.eauto ?? 0) + (local.vehicles?.hybrid ?? 0);
  const summaryParts: string[] = [];
  if (propertyLabel && tenureLabel) summaryParts.push(`${propertyLabel} · ${tenureLabel}`);
  else if (propertyLabel) summaryParts.push(propertyLabel);
  else if (tenureLabel) summaryParts.push(tenureLabel);
  if (vehicleTotal > 0) summaryParts.push(`${vehicleTotal} Fahrzeug${vehicleTotal > 1 ? 'e' : ''}`);
  else if (local.autoType === 'keins') summaryParts.push('Kein Auto');

  function renderRow(field: typeof PROFILE_FIELDS[0]) {
    const strVal = getStrVal(field);
    const currentOpt = field.options.find(o => o.value === strVal);
    const useButtons = field.options.length <= 3;
    const isOpen = openField === field.key;

    return (
      <div
        key={field.key}
        style={{
          padding: '14px 0',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'center', gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{
          flex: 1, minWidth: 100,
          fontSize: 14, fontWeight: 500, color: TEXT,
        }}>
          {field.label}
        </div>

        {useButtons ? (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {field.options.map(opt => {
              const isSelected = strVal === opt.value;
              const OptIcon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectOption(field.key, opt.value)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: isSelected ? BLUE : '#f0f3f7',
                    color: isSelected ? WHITE : TEXT,
                    border: 'none',
                    borderRadius: 999,
                    padding: '7px 12px',
                    fontSize: 12, fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  <OptIcon size={13} stroke={1.8} color={isSelected ? WHITE : BLUE_DK} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenField(isOpen ? null : field.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: isOpen ? BLUE : BLUE_LT,
                color: isOpen ? WHITE : BLUE_DK,
                border: 'none',
                borderRadius: 999,
                padding: '7px 12px',
                fontSize: 13, fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>
                {currentOpt?.label ?? '– wählen'}
              </span>
              <IconChevronDown
                size={15} stroke={2}
                style={{
                  transition: 'transform 0.25s ease',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <>
                  {/* Click-outside backdrop */}
                  <div
                    onClick={() => setOpenField(null)}
                    style={{
                      position: 'fixed', inset: 0, zIndex: 40,
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: 240,
                      background: WHITE,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 6,
                      boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                      padding: 6, zIndex: 50,
                      transformOrigin: 'top right',
                    }}
                  >
                    {field.options.map(opt => {
                      const isSelected = strVal === opt.value;
                      const OptIcon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => selectOption(field.key, opt.value)}
                          style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: isSelected ? BLUE_LT : 'transparent',
                            border: 'none',
                            borderRadius: 6,
                            padding: '10px 12px',
                            fontSize: 14, fontWeight: 600,
                            color: isSelected ? BLUE_DK : TEXT,
                            cursor: 'pointer', textAlign: 'left' as const,
                            fontFamily: 'inherit',
                          }}
                          onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#f5f7fa'; }}
                          onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <OptIcon size={17} stroke={1.6} color={isSelected ? BLUE : TEXT_MUTED} />
                          <span style={{ flex: 1 }}>{opt.label}</span>
                          {isSelected && <IconCheck size={15} stroke={2.5} color={BLUE} />}
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(244,246,250,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`, padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: `1.5px solid ${BORDER}`, borderRadius: 6,
          padding: '7px 14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600, color: TEXT,
        }}>
          <IconArrowLeft size={16} stroke={1.5} /> Zurück
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Ihre Angaben</span>
        </div>
        <div style={{ width: 80 }} />
      </div>

      <div className="mvp-profile-container" style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px', width: '100%' }}>
        <style>{`
          @media(min-width:900px){
            .mvp-profile-container{max-width:980px !important;padding:24px 24px 40px !important;}
            /* Row list — single column with thin dividers (no grid on this section) */
          }
        `}</style>

        <p style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 20, lineHeight: 1.5 }}>
          Empfehlungen aktualisieren sich automatisch.
        </p>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {SECTIONS.map(section => {
            let sectionFields = section.fieldKeys
              .map(k => PROFILE_FIELDS.find(f => f.key === k))
              .filter(Boolean) as typeof PROFILE_FIELDS;
            // Hide sunHours + balkonSize rows when no balcony
            if (section.key === 'wohnen' && (local.equipment?.balkon !== true)) {
              sectionFields = sectionFields.filter(f => f.key !== 'sunHours' && f.key !== 'balkonSize');
            }
            // Hide balkonSize unless sunHours is mittel/viel
            if (section.key === 'wohnen' && local.equipment?.sunHours !== 'mittel' && local.equipment?.sunHours !== 'viel') {
              sectionFields = sectionFields.filter(f => f.key !== 'balkonSize');
            }
            const SectionIcon = section.icon;
            const isMobility = section.key === 'mobilitaet';
            const isBewohner = section.key === 'bewohner';
            const isWohnen = section.key === 'wohnen';
            const isBasis = section.key === 'basisdaten';
            if (sectionFields.length === 0 && !isMobility && !isBewohner && !isBasis) return null;
            const isCollapsed = collapsed.has(section.key);
            return (
              <div key={section.key}>
                <button
                  onClick={() => toggleSection(section.key)}
                  style={{
                    width: '100%',
                    background: 'transparent', border: 'none',
                    fontSize: 11, fontWeight: 700, color: TEXT_MUTED,
                    letterSpacing: '0.12em',
                    paddingTop: 0, paddingBottom: 6, paddingLeft: 0, paddingRight: 0,
                    borderBottom: `2px solid ${BORDER}`,
                    marginBottom: 2,
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    textAlign: 'left' as const,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = TEXT; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = TEXT_MUTED; }}
                >
                  <span>{section.title.toUpperCase()}</span>
                  <IconChevronDown
                    size={15} stroke={2.4}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                {isBasis ? (() => {
                  const dz = getDenkmalschutzInfo(local.plz || '');
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{
                        padding: '14px 0',
                        borderBottom: `1px solid ${BORDER}`,
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <div style={{ flex: 1, minWidth: 100, fontSize: 14, fontWeight: 500, color: TEXT }}>
                          Postleitzahl
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={5}
                          placeholder="z.B. 10115"
                          value={local.plz ?? ''}
                          onChange={e => {
                            const v = e.target.value.replace(/[^\d]/g, '').slice(0, 5);
                            updateLocal({ plz: v });
                          }}
                          style={{
                            width: 110, textAlign: 'right',
                            padding: '7px 10px',
                            border: `1px solid ${BORDER}`,
                            borderRadius: 6,
                            fontSize: 14, fontWeight: 600, color: TEXT,
                            fontFamily: 'inherit',
                            background: WHITE,
                            outline: 'none',
                            letterSpacing: '0.05em',
                          }}
                          onFocus={e => { e.currentTarget.style.borderColor = BLUE; }}
                          onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
                        />
                      </div>
                      {dz && (
                        <div style={{ padding: '12px 0' }}>
                          <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 6 }}>
                            Erkanntes Bundesland: <strong style={{ color: TEXT }}>{dz.name}</strong>
                          </div>
                          {local.denkmalschutz === true && (() => {
                            const c = dz.info.category;
                            const palette = c === 'liberal'
                              ? { bg: GREEN_LT, text: GREEN_DARK, border: GREEN_DARK, eyebrow: 'DENKMALSCHUTZ — GÜNSTIG' }
                              : c === 'pragmatic'
                              ? { bg: '#FEF3C7', text: '#92400E', border: '#92400E', eyebrow: 'DENKMALSCHUTZ — MIT AUFLAGEN' }
                              : { bg: '#FEE2E2', text: '#9F1F1F', border: '#9F1F1F', eyebrow: 'DENKMALSCHUTZ — STRENG' };
                            return (
                              <div style={{
                                background: palette.bg,
                                borderLeft: `3px solid ${palette.border}`,
                                borderRadius: 6,
                                padding: '10px 12px',
                              }}>
                                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: palette.text, marginBottom: 4 }}>
                                  {palette.eyebrow}
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: palette.text, marginBottom: 4 }}>
                                  {dz.info.short}
                                </div>
                                <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.5 }}>
                                  {dz.info.details}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })() : isBewohner ? (() => {
                  const r = local.residents ?? { mitbewohner: 0, kinder: 0, untermieter: 0, haustiere: 0 };
                  const rows: { key: keyof Residents; label: string; sub?: string }[] = [
                    { key: 'mitbewohner', label: 'Mitbewohner',  sub: 'Partner/in, WG, Familie' },
                    { key: 'kinder',      label: 'Kinder',       sub: 'unter 18 Jahre' },
                    { key: 'untermieter', label: 'Untermieter',  sub: 'mietet Zimmer / Bereich' },
                    { key: 'haustiere',   label: 'Haustiere',    sub: 'Hund, Katze, etc.' },
                  ];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {rows.map(row => (
                        <div key={row.key} style={{
                          padding: '14px 0',
                          borderBottom: `1px solid ${BORDER}`,
                          display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, lineHeight: 1.25 }}>{row.label}</div>
                            {row.sub && <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{row.sub}</div>}
                          </div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <button
                              onClick={() => setResidents(row.key, -1)}
                              disabled={r[row.key] === 0}
                              aria-label="Weniger"
                              style={{
                                width: 28, height: 28, borderRadius: 14,
                                border: `1px solid ${BORDER}`, background: WHITE,
                                color: r[row.key] === 0 ? '#cfd3da' : TEXT,
                                cursor: r[row.key] === 0 ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'inherit',
                              }}
                            >
                              <IconMinus size={14} stroke={2} />
                            </button>
                            <span style={{ minWidth: 22, textAlign: 'center', fontSize: 14, fontWeight: 700, color: TEXT }}>
                              {r[row.key]}
                            </span>
                            <button
                              onClick={() => setResidents(row.key, +1)}
                              aria-label="Mehr"
                              style={{
                                width: 28, height: 28, borderRadius: 14,
                                border: `1px solid ${BORDER}`, background: WHITE,
                                color: TEXT,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'inherit',
                              }}
                            >
                              <IconPlus size={14} stroke={2} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })() : isMobility ? (() => {
                  const v = local.vehicles ?? { verbrenner: 0, eauto: 0, hybrid: 0 };
                  const total = v.verbrenner + v.eauto + v.hybrid;
                  const isKeins = local.autoType === 'keins';
                  const vehicleList: { type: VehicleType; key: string }[] = [];
                  (['verbrenner', 'eauto', 'hybrid'] as const).forEach(t => {
                    for (let i = 0; i < v[t]; i++) vehicleList.push({ type: t, key: `${t}-${i}` });
                  });
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {/* Individual vehicle rows — 2-column grid on desktop */}
                      <style>{`@media(min-width:640px){.mvp-vehicle-grid{display:grid !important;grid-template-columns:repeat(2,1fr) !important;gap:8px !important;}}`}</style>
                      <div className="mvp-vehicle-grid" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <AnimatePresence initial={false}>
                        {vehicleList.map(({ type, key }) => {
                          const meta = VEHICLE_META[type];
                          const VIcon = meta.icon;
                          return (
                            <motion.div
                              key={key}
                              layout
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                              transition={{ duration: 0.18 }}
                              style={{
                                padding: '14px 0',
                                borderBottom: `1px solid ${BORDER}`,
                                display: 'flex', alignItems: 'center', gap: 12,
                              }}
                            >
                              <div style={{
                                flex: 1, minWidth: 0,
                                fontSize: 14, fontWeight: 500, color: TEXT,
                              }}>
                                {meta.label}
                              </div>
                              <button
                                onClick={() => removeVehicle(type)}
                                aria-label="Entfernen"
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 4,
                                  background: 'transparent',
                                  color: TEXT_MUTED,
                                  border: 'none',
                                  padding: '4px 8px',
                                  fontSize: 12, fontWeight: 500,
                                  cursor: 'pointer',
                                  fontFamily: 'inherit',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#dc2626'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = TEXT_MUTED; }}
                              >
                                <IconX size={13} stroke={2} /> Entfernen
                              </button>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      </div>

                      {/* Kein Auto status */}
                      {isKeins && total === 0 && (
                        <div style={{
                          padding: '14px 0',
                          borderBottom: `1px solid ${BORDER}`,
                          fontSize: 14, fontWeight: 500, color: TEXT,
                        }}>
                          Kein Auto
                        </div>
                      )}

                      {/* Empty state */}
                      {!isKeins && total === 0 && (
                        <div style={{
                          padding: '10px 14px',
                          fontSize: 12, color: TEXT_MUTED,
                          fontStyle: 'italic',
                        }}>
                          Noch kein Fahrzeug erfasst.
                        </div>
                      )}

                      {/* Add buttons */}
                      <div style={{
                        display: 'flex', gap: 8, flexWrap: 'wrap',
                        marginTop: 4, padding: '0 4px',
                      }}>
                        {(['verbrenner', 'eauto', 'hybrid'] as VehicleType[]).map(t => {
                          const VIcon = VEHICLE_META[t].icon;
                          return (
                            <button
                              key={t}
                              onClick={() => addVehicle(t)}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                background: BLUE_LT, color: BLUE_DK,
                                border: 'none',
                                borderRadius: 999,
                                padding: '7px 12px',
                                fontSize: 12, fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                              }}
                            >
                              <IconPlus size={13} stroke={2} color={BLUE} />
                              <VIcon size={13} stroke={1.8} color={BLUE_DK} />
                              {VEHICLE_META[t].label}
                            </button>
                          );
                        })}
                        <button
                          onClick={setNoVehicle}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            background: isKeins ? BLUE : 'transparent',
                            color: isKeins ? WHITE : TEXT_MUTED,
                            border: `1px solid ${isKeins ? BLUE : BORDER}`,
                            borderRadius: 999,
                            padding: '7px 12px',
                            fontSize: 12, fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            marginLeft: 'auto',
                          }}
                        >
                          <IconBike size={13} stroke={1.8} color={isKeins ? WHITE : TEXT_MUTED} />
                          Kein Auto
                        </button>
                      </div>

                      {/* KFZ-Versicherung row stays as normal field */}
                      {sectionFields.find(f => f.key === 'kfzVersicherung') && total > 0 && (
                        <div style={{ marginTop: 6 }}>
                          {renderRow(sectionFields.find(f => f.key === 'kfzVersicherung')!)}
                        </div>
                      )}
                    </div>
                  );
                })() : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {sectionFields.map(field => renderRow(field))}
                    {isWohnen && (() => {
                      const MIN = 20, MAX = 300, STEP = 5;
                      const current = local.wohnflaeche ?? 70;  // sinnvoller Default-Slider-Wert
                      const set = local.wohnflaeche != null;
                      const pct = ((current - MIN) / (MAX - MIN)) * 100;
                      return (
                        <div style={{
                          padding: '14px 0',
                          borderBottom: `1px solid ${BORDER}`,
                          display: 'flex', flexDirection: 'column', gap: 8,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ flex: 1, minWidth: 100, fontSize: 14, fontWeight: 500, color: TEXT }}>
                              Wohnfläche
                            </div>
                            <span style={{
                              fontSize: 14, fontWeight: 700, color: set ? TEXT : TEXT_MUTED,
                              minWidth: 64, textAlign: 'right',
                            }}>
                              {set ? `${current} m²` : '— m²'}
                            </span>
                          </div>
                          <style>{`
                            .mvp-wf-slider{
                              -webkit-appearance:none;appearance:none;
                              width:100%;height:6px;border-radius:3px;
                              background:linear-gradient(to right, ${BLUE} 0%, ${BLUE} ${pct}%, ${BORDER} ${pct}%, ${BORDER} 100%);
                              outline:none;cursor:pointer;
                            }
                            .mvp-wf-slider::-webkit-slider-thumb{
                              -webkit-appearance:none;appearance:none;
                              width:20px;height:20px;border-radius:50%;
                              background:${BLUE};
                              border:2px solid #fff;
                              box-shadow:0 1px 4px rgba(0,0,0,0.18);
                              cursor:pointer;
                            }
                            .mvp-wf-slider::-moz-range-thumb{
                              width:20px;height:20px;border-radius:50%;
                              background:${BLUE};
                              border:2px solid #fff;
                              box-shadow:0 1px 4px rgba(0,0,0,0.18);
                              cursor:pointer;
                            }
                          `}</style>
                          <input
                            type="range"
                            className="mvp-wf-slider"
                            min={MIN} max={MAX} step={STEP}
                            value={current}
                            onChange={e => setWohnflaeche(Number(e.target.value))}
                          />
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            fontSize: 10, color: TEXT_MUTED, fontWeight: 500,
                          }}>
                            <span>{MIN} m²</span>
                            <span>{MAX} m²+</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <button onClick={onBack} style={{
            background: BLUE, border: 'none', borderRadius: 6,
            padding: '12px 28px', fontSize: 14, fontWeight: 600,
            color: WHITE, cursor: 'pointer',
            boxShadow: `0 2px 8px rgba(87,130,176,0.35)`,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Empfehlungen ansehen <IconArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Profile Pill Icon ────────────────────────────────────────────
function ProfilePillIcon({ type, value }: { type: string; value: string }) {
  const p = { size: 16, stroke: 1.5, color: BLUE_DK };
  switch (type) {
    case 'tenure':   return <IconHome {...p} />;
    case 'property': return value === 'haus' ? <IconHome {...p} /> : <IconBuilding {...p} />;
    case 'heating':  return <IconFlame {...p} />;
    case 'auto':
      if (value === 'keins') return <IconBike {...p} />;
      if (value === 'eauto') return <IconBatteryCharging {...p} />;
      if (value === 'hybrid') return <IconPlug {...p} />;
      // verbrenner, has-vehicles, mixed → car icon
      return <IconCar {...p} />;
    case 'children': return value === 'mit' ? <IconUsers {...p} /> : <IconUser {...p} />;
    default:         return <IconCircle {...p} />;
  }
}

// ── Main Component ───────────────────────────────────────────────
interface DashboardProps {
  initialProfile?: MvpProfile;
}

export default function MvpDashboard({ initialProfile }: DashboardProps = {}) {
  const [profile, setProfile] = useState<MvpProfile | null>(initialProfile ?? null);
  const [view, setView] = useState<'dashboard' | 'profile'>('dashboard');
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      const stored = new Set(JSON.parse(localStorage.getItem('wpilot_mvp_done') || '[]')) as Set<string>;
      // Strom tip is always considered done — user already benefits from Wechselpilot
      stored.add('strom-wechsel');
      return stored;
    } catch { return new Set(['strom-wechsel']); }
  });
  const [removed, setRemoved] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wpilot_mvp_removed') || '[]')); } catch { return new Set(); }
  });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [overlayTipId, setOverlayTipId] = useState<string | null>(null);
  // Detail-Sub-View: 'intro' (Description + Warum) | 'steps' (How-To) | 'offers' (Anbieter)
  const [detailView, setDetailView] = useState<'intro' | 'steps' | 'offers'>('intro');
  // Reset whenever a different tip is opened
  useEffect(() => { setDetailView('intro'); }, [overlayTipId]);
  const showOffers = detailView === 'offers';
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [openModuleKey, setOpenModuleKey] = useState<string | null>(null);
  // Layout-ID of the element that opened the current overlay (for shared-element morph).
  // null when no overlay open.
  const [overlaySrcId, setOverlaySrcId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const modulesGridRef = React.useRef<HTMLDivElement>(null);
  const [gridCols, setGridCols] = useState(4);
  // Detect column count of the modules grid (responsive auto-fill)
  useEffect(() => {
    const el = modulesGridRef.current;
    if (!el) return;
    function compute() {
      if (!el) return;
      // Tatsächlich genutzte Spalten = Anzahl Items in der ersten Reihe.
      // Wir lesen die DOM-Positionen aus (top-Koordinaten clustern auf Reihen).
      // Robuster als getComputedStyle bei auto-fill (das auch leere Tracks zählt).
      // Die Feedback-Box selbst soll bei der Spalten-Erkennung NICHT mitzählen.
      const children = Array.from(el.children).filter(
        c => !(c as HTMLElement).dataset.feedbackBox,
      ) as HTMLElement[];
      if (children.length === 0) { setGridCols(1); return; }
      const firstTop = children[0].offsetTop;
      let count = 0;
      for (const c of children) {
        if (Math.abs(c.offsetTop - firstTop) < 2) count++;
        else break;
      }
      setGridCols(Math.max(1, count));
    }
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    // Re-detect cols whenever children are added/removed (modules ignored/restored)
    const mo = new MutationObserver(compute);
    mo.observe(el, { childList: true });
    // Recompute after fonts/layout settle
    const t = setTimeout(compute, 100);
    return () => { ro.disconnect(); mo.disconnect(); clearTimeout(t); };
  }, []);
  // TEMP: always show overlay on every dashboard visit (dev/testing).
  // Revert by restoring the localStorage check.
  const [showTopTipsOverlay, setShowTopTipsOverlay] = useState(true);
  function closeTopTipsOverlay() {
    setShowTopTipsOverlay(false);
  }
  // Lock body scroll while top-tips overlay is open
  useEffect(() => {
    if (!showTopTipsOverlay) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [showTopTipsOverlay]);

  // Auto-advance carousel every 4s (pauses while overlay is open / on hover / on manual nav)
  useEffect(() => {
    if (carouselPaused || showTopTipsOverlay || openModuleKey || overlayTipId) return;
    const id = setInterval(() => setCarouselIdx(i => i + 1), 4000);
    return () => clearInterval(id);
  }, [carouselPaused, showTopTipsOverlay, openModuleKey, overlayTipId]);
  const [showRemoved, setShowRemoved] = useState(false);
  const [savedAmounts, setSavedAmounts] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem('wpilot_mvp_saved_amounts') || '{}'); } catch { return {}; }
  });
  const [editingSavingsId, setEditingSavingsId] = useState<string | null>(null);
  const [savingsInput, setSavingsInput] = useState<string>('');

  useEffect(() => {
    if (initialProfile) return;
    try {
      const raw = localStorage.getItem('wpilot_mvp_profile');
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem('wpilot_mvp_done',    JSON.stringify([...done]));    }, [done]);
  useEffect(() => { localStorage.setItem('wpilot_mvp_removed', JSON.stringify([...removed])); }, [removed]);
  useEffect(() => { localStorage.setItem('wpilot_mvp_saved_amounts', JSON.stringify(savedAmounts)); }, [savedAmounts]);

  // Haushaltsgröße: zählt Erwachsene + Kinder + ggf. Untermieter (Haustiere irrelevant für Energie)
  const residentTotal = profile
    ? 1 + (profile.residents?.mitbewohner ?? 0) + (profile.residents?.kinder ?? 0) + (profile.residents?.untermieter ?? 0)
    : 2;
  const hg = (residentTotal >= 3 || profile?.hasChildren) ? 3 : 2;
  const getSavings = (tip: MvpTip) => {
    if (done.has(tip.id) && savedAmounts[tip.id] !== undefined) return savedAmounts[tip.id];
    return hg === 3 ? tip.savingsHg3 : tip.savingsHg2;
  };

  const tips = useMemo(() => {
    if (!profile) return [];
    const base = ALL_TIPS.filter(t => {
      if (!t.condition(profile)) return false;
      // Strom- und Gastarif werden separat behandelt — nicht im Dashboard anzeigen
      if (t.id === 'strom-wechsel' || t.id === 'gas-wechsel') return false;
      // Hide tips that user already completed in Basics steps
      if (t.id === 'steuererklaerung' && profile.steuererklaerung) return false;
      if (t.id === 'kostenloses-girokonto' && profile.girokonto) return false;
      if (t.id === 'internet-wechsel' && profile.internet) return false;
      if (t.id === 'mobilfunk-wechsel' && profile.mobilfunk) return false;
      if (t.id === 'kfz-versicherung' && profile.kfzVersicherung) return false;
      return true;
    });

    // Expand per-vehicle tips (KfZ-Versicherung per car, THG-Prämie per E-Auto)
    const v = profile.vehicles ?? { verbrenner: 0, eauto: 0, hybrid: 0 };
    const vehicleCount = v.verbrenner + v.eauto + v.hybrid;
    // Legacy fallback: if no vehicles object but autoType set, treat as 1 vehicle
    const legacyVehicle = vehicleCount === 0 && profile.autoType && profile.autoType !== 'keins' && profile.autoType !== '' ? 1 : 0;
    const totalVehicles = vehicleCount || legacyVehicle;

    const expanded: MvpTip[] = [];
    for (const t of base) {
      if (t.id === 'kfz-versicherung' && totalVehicles > 1) {
        for (let i = 1; i <= totalVehicles; i++) {
          expanded.push({ ...t, id: `${t.id}-${i}`, title: `${t.title} (Fahrzeug ${i})` });
        }
      } else if (t.id === 'thg-praemie' && v.eauto > 1) {
        for (let i = 1; i <= v.eauto; i++) {
          expanded.push({ ...t, id: `${t.id}-${i}`, title: `${t.title} (E-Auto ${i})` });
        }
      } else {
        expanded.push(t);
      }
    }

    return expanded.filter(t => !removed.has(t.id));
  }, [profile, removed]);

  const removedTips = useMemo(() => {
    if (!profile) return [];
    return ALL_TIPS.filter(t => t.condition(profile) && removed.has(t.id));
  }, [profile, removed]);

  const clusters = useMemo(() => profile ? buildClusters(profile, tips) : [], [profile, tips]);
  const total     = useMemo(() => tips.reduce((s, t) => s + getSavings(t), 0), [tips, hg, done, savedAmounts]);
  const doneCount = useMemo(() => tips.filter(t => done.has(t.id)).length, [tips, done]);
  const doneTotal = useMemo(() => tips.filter(t => done.has(t.id)).reduce((s, t) => s + getSavings(t), 0), [tips, done, hg, savedAmounts]);
  const nextBestTip = useMemo(() => {
    const open = tips.filter(t => !done.has(t.id));
    if (open.length === 0) return null;
    // Strom + Gas Wechsel haben höchste Priorität
    const strom = open.find(t => t.id === 'strom-wechsel');
    if (strom) return strom;
    const gas = open.find(t => t.id === 'gas-wechsel');
    if (gas) return gas;
    // Fallback: höchste Ersparnis
    return open.slice().sort((a, b) => getSavings(b) - getSavings(a))[0];
  }, [tips, done, hg, savedAmounts]);

  if (!profile) {
    return (
      <div style={{ minHeight: '100dvh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: TEXT_MUTED, marginBottom: 16 }}>Kein Profil gefunden</p>
          <button onClick={() => window.location.href = '/apps/wpilot-home/mvp.html'} style={{
            background: BLUE, color: WHITE, border: 'none', borderRadius: 6,
            padding: '12px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto',
            boxShadow: `0 2px 8px rgba(87,130,176,0.35)`,
          }}>
            Wizard starten <IconArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (view === 'profile') {
    return (
      <ProfileEditView
        profile={profile}
        onSave={updated => setProfile(updated)}
        onBack={() => setView('dashboard')}
      />
    );
  }

  function toggleDone(id: string) {
    setDone(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }
  function removeTip(id: string) {
    setRemoved(prev => { const n = new Set(prev); n.add(id); return n; });
    setDone(prev => { const n = new Set(prev); n.delete(id); return n; });
  }
  function restoreTip(id: string) {
    setRemoved(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  const profilePills = [
    { type: 'property', label: profile.propertyType === 'haus' ? 'Haus' : 'Wohnung',                                                          value: profile.propertyType },
    { type: 'tenure',   label: profile.tenure === 'eigentum' ? 'Eigentum' : 'Miete',                                                          value: profile.tenure },
    { type: 'heating',  label: ({ gas: 'Gas', oel: 'Öl', strom: 'Strom', waermepumpe: 'Wärmepumpe', weiss_nicht: 'Heizung unklar' } as any)[profile.heatingType] || 'Keine Angabe', value: profile.heatingType },
    { type: 'auto',     label: (() => {
        if (profile.autoType === 'keins') return 'Kein Auto';
        const v = profile.vehicles;
        if (v && (v.verbrenner + v.eauto + v.hybrid) > 0) {
          const parts: string[] = [];
          if (v.verbrenner > 0) parts.push(`${v.verbrenner}× Verbrenner`);
          if (v.eauto > 0)      parts.push(`${v.eauto}× E-Auto`);
          if (v.hybrid > 0)     parts.push(`${v.hybrid}× Hybrid`);
          return parts.join(', ');
        }
        return ({ verbrenner: 'Verbrenner', eauto: 'E-Auto', hybrid: 'Hybrid' } as any)[profile.autoType] || 'Fahrzeug';
      })(), value: profile.autoType },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{ minHeight: '100dvh', background: BG }}
    >
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(244,246,250,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`, padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <img src={logoWp} alt="Wechselpilot" height={28} style={{ objectFit: 'contain', flexShrink: 0 }} />
        <span style={{
          background: '#f9aa00', borderRadius: 999,
          padding: '4px 10px',
          fontFamily: "'Poppins', sans-serif",
          display: 'inline-flex', alignItems: 'center', lineHeight: 1,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#243c47', letterSpacing: '0.06em' }}>HOME</span>
        </span>
        <div style={{ flex: 1 }} />
      </div>

      <div className="mvp-dash-container" style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>
        <style>{`
          @media(min-width:900px){
            .mvp-dash-container{max-width:980px !important;padding:24px 24px 40px !important;}
            .mvp-cluster-tips{display:grid !important;grid-template-columns:repeat(2, 1fr) !important;gap:8px 12px !important;}
            .mvp-cluster-tip-wrap{align-self:start;}
          }
        `}</style>

        {/* Hero — two separate boxes */}
        <style>{`
          .mvp-hero-row{display:flex;flex-direction:column;gap:12px;margin-bottom:12px;}
          @media(min-width:700px){
            /* Split-Position richtet sich nach Mitte der 3. Modul-Kachel (4-Spalten-Grid):
               2.5 von 4 Spalten = 62.5 % → 5fr : 3fr */
            .mvp-hero-row{
              display:grid !important;
              grid-template-columns:5fr 3fr !important;
              align-items:stretch;
            }
          }
        `}</style>
        <motion.div
          className="mvp-hero-row"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          {/* Left: Savings summary */}
          <div style={{
            flex: '1 1 auto',
            background: 'linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)',
            borderRadius: 6, padding: '18px 20px', color: WHITE,
            position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12,
          }}>
            {/* Wechselpilot Brand-Schräge — diagonale Fläche (statt Kreis) */}
            <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: '55%',
              background: 'rgba(255,255,255,0.07)',
              clipPath: 'polygon(28% 0, 100% 0, 100% 100%, 0 100%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: '38%',
              background: 'rgba(255,255,255,0.05)',
              clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 4, letterSpacing: '0.05em' }}>Ihr Sparpotenzial pro Jahr</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}><AnimatedCounter value={total} /></span>
                <span style={{ fontSize: 20, fontWeight: 700, opacity: 0.8 }}>€</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{tips.length} Empfehlungen basierend auf Ihren Antworten</div>
            </div>
            <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '8px 12px', flex: '1 1 0' }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}><AnimatedCounter value={doneTotal} suffix=" €" /></div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>Erledigt</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: '8px 12px', flex: '1 1 0' }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{doneCount}/{tips.length}</div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>Tipps erledigt</div>
              </div>
            </div>
          </div>

          {/* Right: Top-3 tips carousel (or placeholder while overlay open) */}
          {(() => {
            const thermoTip = ALL_TIPS.find(t => t.id === 'thermostate');
            const otherTips = tips.filter(t => t.id !== 'thermostate');
            const topTips = (thermoTip ? [thermoTip, ...otherTips] : otherTips).slice(0, 3);
            if (topTips.length === 0) return null;
            const idx = ((carouselIdx % topTips.length) + topTips.length) % topTips.length;
            const tip = topTips[idx];
            const TipIcon = tip.icon;
            const savings = getSavings(tip);

            if (showTopTipsOverlay || openModuleKey || overlayTipId) {
              // Hidden placeholder: reserves hero layout space; carousel re-mounts when overlays close.
              // Keeps layoutId='top-tips-shell' free for the unified shell to morph from/to this slot.
              return (
                <div className="mvp-hero-carousel" style={{
                  flex: '0 0 auto', width: '100%',
                  visibility: 'hidden',
                  padding: '16px 18px',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  boxSizing: 'border-box' as const,
                  height: 224,
                }}>
                  <style>{`@media(min-width:700px){.mvp-hero-carousel{width:auto !important;flex:1 1 0 !important;}}`}</style>
                </div>
              );
            }

            return (
              <motion.div
                layoutId="top-tips-shell"
                className="mvp-hero-carousel"
                onMouseEnter={() => setCarouselPaused(true)}
                onMouseLeave={() => setCarouselPaused(false)}
                style={{
                  flex: '0 0 auto', width: '100%',
                  background: WHITE, border: 'none',
                  borderRadius: 6, padding: '16px 18px 64px',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  boxSizing: 'border-box' as const,
                  position: 'relative', overflow: 'hidden',
                  height: 224,
                }}
              >
                <style>{`@media(min-width:700px){.mvp-hero-carousel{width:auto !important;flex:1 1 0 !important;}}`}</style>

                {/* Ticket notches — semicircular cutouts at vertical mid-height (left + right) */}
                <div style={{
                  position: 'absolute', top: '50%', left: -10,
                  width: 20, height: 20, borderRadius: '50%',
                  background: BG, transform: 'translateY(-50%)',
                  pointerEvents: 'none', zIndex: 2,
                }} />
                <div style={{
                  position: 'absolute', top: '50%', right: -10,
                  width: 20, height: 20, borderRadius: '50%',
                  background: BG, transform: 'translateY(-50%)',
                  pointerEvents: 'none', zIndex: 2,
                }} />

                {/* Top row: TOP TIPP eyebrow (left) + savings chip (right) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: GREEN_DARK }}>TOP TIPP</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: GREEN_LT, color: GREEN_DARK,
                    fontSize: 12, fontWeight: 700,
                    padding: '4px 10px', borderRadius: 999,
                    whiteSpace: 'nowrap',
                  }}>
                    bis zu {fmt(savings)} € / Jahr
                  </div>
                </div>

                {/* Middle: image + title */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      position: 'relative', zIndex: 1,
                    }}
                  >
                    {tip.id === 'thermostate' ? (
                      <img src={thermostatImg} alt="Smartes Thermostat" style={{ width: 88, height: 88, objectFit: 'contain', flexShrink: 0 }} />
                    ) : (
                      <div style={{
                        width: 64, height: 64, borderRadius: 6,
                        background: GREEN_LT,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <TipIcon size={32} stroke={1.6} color={GREEN_DARK} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 17, fontWeight: 800, color: PRIMARY, lineHeight: 1.25, letterSpacing: '-0.01em', marginBottom: 4 }}>{tip.title}</div>
                      {tip.tagline && (
                        <div style={{ fontSize: 12, color: GREY_800, lineHeight: 1.4, fontWeight: 500 }}>
                          {tip.tagline}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Bottom row: arrows (left) + CTA (right) — pinned to card bottom */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  position: 'absolute', left: 18, right: 18, bottom: 16,
                  zIndex: 2,
                }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setCarouselIdx(i => (i - 1 + topTips.length) % topTips.length)}
                      aria-label="Vorheriger Tipp"
                      style={{
                        width: 32, height: 32, borderRadius: 16, flexShrink: 0,
                        border: `1px solid ${BORDER}`, background: WHITE,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: PRIMARY,
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = PRIMARY; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
                    >
                      <IconArrowLeft size={15} stroke={2} />
                    </button>
                    <button
                      onClick={() => setCarouselIdx(i => (i + 1) % topTips.length)}
                      aria-label="Nächster Tipp"
                      style={{
                        width: 32, height: 32, borderRadius: 16, flexShrink: 0,
                        border: `1px solid ${BORDER}`, background: WHITE,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: PRIMARY,
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = PRIMARY; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
                    >
                      <IconArrowRight size={15} stroke={2} />
                    </button>
                  </div>

                  <button
                    onClick={() => { setOverlaySrcId('top-tips-shell'); setOverlayTipId(tip.id); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: PRIMARY, color: WHITE, border: 'none',
                      borderRadius: 999, padding: '10px 20px',
                      fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                      boxShadow: '0 4px 12px rgba(36,60,71,0.20)',
                      transition: 'transform 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                  >
                    Jetzt starten <IconArrowRight size={14} stroke={2.5} />
                  </button>
                </div>

                {/* (Dots indicator removed — kept hidden block below empty to satisfy old JSX structure) */}
                <div style={{ display: 'none' }}>
                  {topTips.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIdx(i)}
                      style={{
                        width: i === idx ? 18 : 6, height: 6,
                        borderRadius: 3, border: 'none',
                        background: i === idx ? PRIMARY : BORDER,
                        cursor: 'pointer', padding: 0,
                        transition: 'width 0.2s, background 0.2s',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })()}
        </motion.div>


        {/* Profile pills */}
        <div
          onClick={() => setView('profile')}
          style={{
            background: WHITE, borderRadius: 6, padding: '12px 16px', marginBottom: 12,
            border: `1px solid ${BORDER}`, display: 'flex', gap: 8, flexWrap: 'wrap',
            cursor: 'pointer', alignItems: 'center',
          }}
        >
          {profilePills.map(p => (
            <span key={p.type} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: BLUE_LT, borderRadius: 6, padding: '5px 10px',
              fontSize: 12, fontWeight: 500, color: BLUE_DK,
            }}>
              <ProfilePillIcon type={p.type} value={p.value} />
              {p.label}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: TEXT_MUTED, fontWeight: 600 }}>
            <IconPencil size={13} stroke={1.5} /> Angaben ändern
          </span>
        </div>

        {/* Module cards grid */}
        {(() => {
          const moduleMeta: Record<string, { icon: React.ComponentType<any>; tint: string; bg: string }> = {
            energie:       { icon: IconBolt,    tint: BLUE, bg: 'transparent' },
            heizung:       { icon: IconFlame,   tint: BLUE, bg: 'transparent' },
            finanzen:      { icon: IconReceipt, tint: BLUE, bg: 'transparent' },
            kommunikation: { icon: IconWifi,    tint: BLUE, bg: 'transparent' },
            mobilitaet:    { icon: IconCar,     tint: BLUE, bg: 'transparent' },
            versicherung:  { icon: IconShield,  tint: BLUE, bg: 'transparent' },
            solar:         { icon: IconSun,     tint: BLUE, bg: 'transparent' },
          };
          // Compute one module per cluster (already filtered/grouped by getClusters)
          return (
            <div
              ref={modulesGridRef}
              className="mvp-modules-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 12,
              }}
            >
              {clusters.map(cluster => {
                // find category key by matching the cluster title to its key — use original byCategory data instead
                const tipsInCluster = cluster.tips;
                const totalPotential = tipsInCluster.reduce((s, t) => s + getSavings(t), 0);
                const doneInCluster = tipsInCluster.filter(t => done.has(t.id)).length;
                const categoryKey = tipsInCluster[0]?.category || 'energie';
                const meta = moduleMeta[categoryKey] || moduleMeta.energie;
                const MIcon = meta.icon;
                return (
                  <motion.button
                    key={cluster.title}
                    layoutId={`module-card-${categoryKey}`}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setOverlaySrcId(`module-card-${categoryKey}`); setOpenModuleKey(categoryKey); }}
                    style={{
                      background: WHITE, border: `1px solid ${BORDER}`,
                      borderRadius: 6, padding: '16px',
                      display: 'flex', flexDirection: 'column', gap: 12,
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const,
                      transition: 'border-color 0.15s, transform 0.15s',
                      minHeight: 140,
                      visibility: overlaySrcId === `module-card-${categoryKey}` ? 'hidden' : 'visible',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = meta.tint; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: 32, height: 32 }}>
                        <MIcon size={26} stroke={1.7} color={meta.tint} />
                      </div>
                      {doneInCluster > 0 && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: GREEN_LT, color: GREEN_DARK,
                          fontSize: 11, fontWeight: 700,
                          padding: '4px 8px', borderRadius: 999,
                        }}>
                          <IconCheck size={11} stroke={2.5} /> {doneInCluster}/{tipsInCluster.length}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, lineHeight: 1.25, marginBottom: 4 }}>
                        {cluster.title}
                      </div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                        {tipsInCluster.length} {tipsInCluster.length === 1 ? 'Tipp' : 'Tipps'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: TEXT_MUTED, letterSpacing: '0.05em', marginBottom: 2 }}>POTENZIAL</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: GREEN_DARK, lineHeight: 1 }}>{fmt(totalPotential)} €</div>
                      </div>
                      <IconArrowRight size={18} stroke={2.2} color={TEXT_MUTED} />
                    </div>
                  </motion.button>
                );
              })}

              {/* Dynamische Feedback-Box füllt die Lücke in der letzten Zeile */}
              {(() => {
                const n = clusters.length;
                const cols = gridCols;
                const remainder = n % cols;
                const span = remainder === 0 ? cols : cols - remainder;
                return (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowFeedback(true)}
                    data-feedback-box="1"
                    style={{
                      gridColumn: `span ${span}`,
                      background: 'linear-gradient(135deg, #243C47 0%, #3D5261 100%)',
                      border: 'none',
                      borderRadius: 6, padding: '20px 22px',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12,
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const,
                      color: WHITE, minHeight: 140,
                      position: 'relative', overflow: 'hidden',
                      transition: 'transform 0.15s',
                    }}
                  >
                    {/* Brand-Schräge */}
                    <div style={{
                      position: 'absolute', top: 0, right: 0, bottom: 0,
                      width: '40%',
                      background: 'rgba(249,170,0,0.08)',
                      clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%)',
                      pointerEvents: 'none',
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 44, height: 44, borderRadius: 6,
                        background: 'rgba(255,255,255,0.10)', marginBottom: 0,
                      }}>
                        <IconUsers size={22} stroke={1.8} color={ORANGE} />
                      </div>
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: ORANGE, marginBottom: 6 }}>
                        IHRE MEINUNG ZÄHLT
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: WHITE, lineHeight: 1.25, marginBottom: 4 }}>
                        Wie gefällt Ihnen unser Spar-Lotse?
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.5 }}>
                        Kurzes Feedback geben — oder ein persönliches Gespräch anfragen.
                      </div>
                    </div>
                    <div style={{
                      position: 'relative', zIndex: 1,
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 13, fontWeight: 700,
                      color: WHITE,
                    }}>
                      Feedback geben <IconArrowRight size={14} stroke={2.4} />
                    </div>
                  </motion.button>
                );
              })()}
            </div>
          );
        })()}

        {/* HIDDEN — old cluster listing (kept for reference, never rendered) */}
        <div style={{ display: 'none' }}>
          {clusters.map((cluster, ci) => (
            <div key={cluster.title}>
              {/* Cluster heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{cluster.title}</span>
                <div style={{ flex: 1, height: 1, background: BORDER }} />
                <span style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 500 }}>
                  {fmt(cluster.tips.reduce((s, t) => s + getSavings(t), 0))} €
                </span>
              </div>

              <div className="mvp-cluster-tips" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cluster.tips.map((tip, i) => {
                  const isDone = done.has(tip.id);
                  const isExpanded = expanded === tip.id;
                  const TipIcon = tip.icon;
                  const savings = getSavings(tip);
                  return (
                    <div key={tip.id} className="mvp-cluster-tip-wrap" style={{ position: 'relative' }}>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                        style={{
                          background: WHITE, borderRadius: 6,
                          border: isDone ? `2px solid ${GREEN}` : `1px solid ${BORDER}`,
                          overflow: 'hidden', opacity: isDone ? 0.6 : 1, transition: 'opacity 0.15s',
                        }}
                      >
                        <div
                          onClick={() => setExpanded(isExpanded ? null : tip.id)}
                          style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                        >
                          <div style={{ width: 44, height: 44, borderRadius: 6, background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <TipIcon size={22} stroke={1.6} color={WHITE} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, lineHeight: 1.3, textDecoration: isDone ? 'line-through' : 'none', marginBottom: 2 }}>
                              {tip.title}
                            </div>
                            <div style={{ fontSize: 12, color: TEXT_MUTED }}>{fmt(savings)} € / Jahr</div>
                          </div>
                          {tip.id === 'strom-wechsel' && (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              background: GREEN_LT, color: GREEN,
                              borderRadius: 999, padding: '6px 12px',
                              fontSize: 13, fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap',
                            }}>
                              <IconCheck size={13} stroke={2.5} />
                              {fmt(savings)} €
                            </span>
                          )}
                          <div style={{
                            color: TEXT_DIM,
                            transition: 'transform 0.25s ease',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            display: 'flex', flexShrink: 0,
                          }}>
                            <IconChevronDown size={18} stroke={1.5} />
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ padding: '14px 16px 16px', borderTop: `1px solid ${BORDER}` }}>
                                {tip.description && (
                                  <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.6, marginBottom: 12, fontWeight: 400 }}>{tip.description}</p>
                                )}

                                {tip.id !== 'strom-wechsel' && (() => {
                                  const isEditing = editingSavingsId === tip.id;
                                  const defaultAmount = String(savedAmounts[tip.id] ?? (hg === 3 ? tip.savingsHg3 : tip.savingsHg2));

                                  function confirmSavings(e: React.MouseEvent) {
                                    e.stopPropagation();
                                    const num = Number(savingsInput.replace(/[^\d]/g, ''));
                                    const amount = isNaN(num) ? Number(defaultAmount) : num;
                                    setSavedAmounts(prev => ({ ...prev, [tip.id]: amount }));
                                    setDone(prev => { const n = new Set(prev); n.add(tip.id); return n; });
                                    setEditingSavingsId(null);
                                    setSavingsInput('');
                                    setExpanded(null);
                                  }

                                  function startEditing(e: React.MouseEvent) {
                                    e.stopPropagation();
                                    setSavingsInput(defaultAmount);
                                    setEditingSavingsId(tip.id);
                                  }

                                  function resetDone(e: React.MouseEvent) {
                                    e.stopPropagation();
                                    setDone(prev => { const n = new Set(prev); n.delete(tip.id); return n; });
                                    setSavedAmounts(prev => {
                                      const next = { ...prev }; delete next[tip.id]; return next;
                                    });
                                  }

                                  if (isEditing) {
                                    return (
                                      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>
                                          Wie viel sparen Sie damit pro Jahr?
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                          <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            background: WHITE,
                                            border: `1.5px solid ${BLUE}`,
                                            borderRadius: 6, padding: '8px 12px',
                                            flex: 1, maxWidth: 220,
                                          }}>
                                            <input
                                              type="text"
                                              inputMode="numeric"
                                              autoFocus
                                              value={savingsInput}
                                              onClick={e => e.stopPropagation()}
                                              onChange={e => setSavingsInput(e.target.value.replace(/[^\d]/g, ''))}
                                              onKeyDown={e => { if (e.key === 'Enter') confirmSavings(e as any); }}
                                              style={{
                                                border: 'none', outline: 'none', background: 'transparent',
                                                flex: 1, minWidth: 0,
                                                fontSize: 14, fontWeight: 700, color: TEXT,
                                                fontFamily: 'inherit',
                                              }}
                                              placeholder="0"
                                            />
                                            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED }}>€ / Jahr</span>
                                          </div>
                                          <button
                                            onClick={confirmSavings}
                                            style={{
                                              background: GREEN, color: WHITE, border: 'none',
                                              borderRadius: 999, padding: '10px 16px',
                                              fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                              display: 'inline-flex', alignItems: 'center', gap: 5,
                                              fontFamily: 'inherit',
                                            }}
                                          >
                                            <IconCheck size={14} stroke={2.5} /> Übernehmen
                                          </button>
                                          <button
                                            onClick={e => { e.stopPropagation(); setEditingSavingsId(null); setSavingsInput(''); }}
                                            style={{
                                              background: 'transparent', color: TEXT_MUTED, border: 'none',
                                              fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                              fontFamily: 'inherit', padding: '8px 4px',
                                            }}
                                          >
                                            Abbrechen
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                                      {isDone ? (
                                        <button
                                          onClick={resetDone}
                                          style={{
                                            flexShrink: 0,
                                            background: '#eef0f3', color: TEXT,
                                            border: 'none',
                                            borderRadius: 999, padding: '10px 16px',
                                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            fontFamily: 'inherit',
                                          }}
                                        >
                                          <IconX size={14} stroke={2.4} /> Zurücksetzen
                                        </button>
                                      ) : (
                                        <button
                                          onClick={startEditing}
                                          style={{
                                            flexShrink: 0,
                                            background: '#eef0f3', color: TEXT,
                                            border: 'none',
                                            borderRadius: 999, padding: '10px 16px',
                                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            fontFamily: 'inherit',
                                          }}
                                        >
                                          Erledigt
                                        </button>
                                      )}
                                      <button
                                        onClick={e => { e.stopPropagation(); setOverlayTipId(tip.id); }}
                                        style={{
                                          marginLeft: 'auto',
                                          display: 'inline-flex', alignItems: 'center', gap: 6,
                                          background: DARK, color: WHITE,
                                          border: 'none',
                                          borderRadius: 999, padding: '10px 18px',
                                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                          fontFamily: 'inherit',
                                        }}
                                      >
                                        {tip.actionLabel || 'Tipp umsetzen'}
                                        <IconArrowRight size={14} stroke={2.5} />
                                      </button>
                                    </div>
                                  );
                                })()}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <button
                        onClick={() => removeTip(tip.id)}
                        style={{
                          position: 'absolute', top: '50%', right: -34, transform: 'translateY(-50%)',
                          width: 28, height: 28, borderRadius: 6, border: 'none',
                          background: 'transparent', color: TEXT_MUTED, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.15s',
                        }}
                        className="mvp-tip-delete"
                      >
                        <IconX size={16} stroke={1.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Deleted tips */}
        {removedTips.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <button onClick={() => setShowRemoved(!showRemoved)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              color: TEXT_MUTED, fontSize: 13, fontWeight: 600, padding: '8px 0', width: '100%',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 6, background: ORANGE_LT, fontSize: 11, fontWeight: 700, color: '#92400e' }}>
                {removedTips.length}
              </span>
              Gelöschte Empfehlungen
              <span style={{ display: 'inline-block', transform: showRemoved ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: 14 }}>▾</span>
            </button>
            {showRemoved && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
                  {removedTips.map(tip => {
                    const TipIcon = tip.icon;
                    const savings = getSavings(tip);
                    const pri = PRIORITY_COLORS[tip.priority];
                    return (
                      <div key={tip.id} style={{ background: WHITE, borderRadius: 6, border: `1px dashed ${BORDER}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.7 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: BLUE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <TipIcon size={18} stroke={1.5} color={BLUE} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{tip.title}</div>
                          <div style={{ fontSize: 11, color: TEXT_MUTED }}>{fmt(savings)} € / Jahr</div>
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 6px', borderRadius: 5, background: pri.bg, color: pri.text, flexShrink: 0 }}>{pri.label}</span>
                        <button onClick={() => restoreTip(tip.id)} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, border: `1px solid ${GREEN}`, background: GREEN_LT, color: GREEN, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          ↩ Zurück
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}

      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {showFeedback && (
          <FeedbackOverlay onClose={() => setShowFeedback(false)} />
        )}
      </AnimatePresence>

      {/* Unified Overlay — single shell, content morphs between top-tips, module list, and tip detail */}
      <AnimatePresence>
        {(openModuleKey || overlayTipId || showTopTipsOverlay) && (() => {
          // Top-tips data (used when showTopTipsOverlay is true AND no other mode is selected)
          const thermoTip = ALL_TIPS.find(t => t.id === 'thermostate');
          const otherTips = tips.filter(t => t.id !== 'thermostate');
          const topTips = (thermoTip ? [thermoTip, ...otherTips] : otherTips).slice(0, 3);

          // Mode priority: detail > list > topTips
          const isDetail  = !!overlayTipId;
          const isList    = !isDetail && !!openModuleKey;
          const isTopTips = !isDetail && !isList && showTopTipsOverlay && topTips.length > 0;

          const tip = isDetail
            ? (tips.find(t => t.id === overlayTipId) || ALL_TIPS.find(t => t.id === overlayTipId!.replace(/-\d+$/, '')))
            : undefined;
          const cluster = isList
            ? clusters.find(c => (c.tips[0]?.category || '') === openModuleKey)
            : undefined;
          if (isDetail && !tip) return null;
          if (isList && !cluster) return null;
          if (!isDetail && !isList && !isTopTips) return null;

          const propLabel = profile.propertyType === 'haus' ? 'Haus' : 'Wohnung';
          const tenLabel  = profile.tenure === 'eigentum' ? 'im Eigentum' : profile.tenure === 'miete' ? 'zur Miete' : '';
          const ctx = profile.propertyType || profile.tenure
            ? `Basierend auf Ihrer Situation: ${propLabel}${tenLabel ? ' ' + tenLabel : ''}.`
            : 'Basierend auf Ihren persönlichen Angaben.';

          let eyebrow = '';
          let title = '';
          let amount = 0;
          let meta = '';

          if (isDetail) {
            eyebrow = 'IHR SPARTIPP';
            title = tip!.title;
            amount = hg === 3 ? tip!.savingsHg3 : tip!.savingsHg2;
            meta = 'pro Jahr · konkret für Ihren Haushalt';
          } else if (isList) {
            const doneCnt = cluster!.tips.filter(t => done.has(t.id)).length;
            eyebrow = 'IHR SPARMODUL';
            title = cluster!.title;
            amount = cluster!.tips.reduce((s, t) => s + getSavings(t), 0);
            meta = `pro Jahr · ${cluster!.tips.length} ${cluster!.tips.length === 1 ? 'Tipp' : 'Tipps'}${doneCnt > 0 ? ` · ${doneCnt} erledigt` : ''}`;
          } else {
            eyebrow = 'IHRE TOP TIPPS';
            title = `Diese ${topTips.length} Maßnahmen lohnen sich am meisten`;
            amount = topTips.reduce((s, t) => s + getSavings(t), 0);
            meta = `pro Jahr · ${topTips.length} Schritte`;
          }

          const contentKey = isDetail
            ? `detail-${tip!.id}`
            : isList
            ? `list-${openModuleKey}`
            : 'top-tips';
          const ctaUrl = tip?.actionUrl || tip?.partnerLinks?.[0]?.url;

          const closeAll = () => {
            setOpenModuleKey(null);
            setOverlayTipId(null);
            setOverlaySrcId(null);
            if (showTopTipsOverlay) closeTopTipsOverlay();
          };
          const backToList = () => { setOverlayTipId(null); };

          return (
            <>
              <motion.div
                key="ov-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={closeAll}
                style={{
                  position: 'fixed', inset: 0, zIndex: 1000,
                  background: 'rgba(30,32,38,0.22)',
                }}
              />
              <style>{`
                .mvp-ov-wrap{padding:5px;}
                @media(min-width:640px){.mvp-ov-wrap{padding:20px;}}
              `}</style>
              <div className="mvp-ov-wrap" style={{
                position: 'fixed', inset: 0, zIndex: 1001,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
                fontFamily: "'Poppins', sans-serif",
              }}>
                <motion.div
                  layoutId={overlaySrcId || 'top-tips-shell'}
                  key="ov-shell"
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.96 }}
                  transition={{
                    layout:  { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                    default: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
                  }}
                  onClick={e => e.stopPropagation()}
                  className="mvp-ov-shell"
                  style={{
                    width: 'min(960px, 100%)', maxHeight: '90vh', minHeight: 0,
                    /* Mobile: fülle den verfügbaren Raum (Wrapper-Padding 5px = max nutzbare 100dvh - 10px) */
                    background: WHITE, border: `1px solid ${BORDER}`,
                    borderRadius: 6,
                    overflow: 'hidden', pointerEvents: 'auto',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                    position: 'relative',
                  }}
                >
                  <style>{`
                    .mvp-ov-grid{display:flex;flex-direction:column;flex:1;min-height:0;}
                    .mvp-ov-left{padding:16px 20px;position:relative;flex-shrink:0;}
                    .mvp-ov-right{position:relative;display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;}
                    .mvp-ov-right-scroll{flex:1;overflow-y:auto;padding:18px 20px 12px;}
                    .mvp-ov-footer{position:sticky;bottom:0;background:#fff;border-top:1px solid ${BORDER};padding:10px 20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
                    /* Mobile: Overlay füllt den verfügbaren Raum (Wrapper hat 5px Padding) */
                    .mvp-ov-shell{height:calc(100dvh - 10px) !important;max-height:calc(100dvh - 10px) !important;width:100% !important;}
                    /* Mobile: kompakte Höhe für linke dunkle Hero-Spalte */
                    .mvp-ov-left .mvp-ov-eyebrow{font-size:9px !important;margin-bottom:6px !important;}
                    .mvp-ov-left .mvp-ov-title{font-size:16px !important;margin-bottom:8px !important;line-height:1.25 !important;}
                    .mvp-ov-left .mvp-ov-amount{font-size:26px !important;margin-bottom:2px !important;letter-spacing:-1px !important;}
                    .mvp-ov-left .mvp-ov-meta{font-size:11px !important;}
                    .mvp-ov-left .mvp-ov-persona{display:none !important;}
                    .mvp-ov-left .mvp-ov-back{margin-bottom:8px !important;}
                    @media(min-width:640px){
                      .mvp-ov-shell{height:auto !important;max-height:90vh !important;width:min(960px, 100%) !important;}
                    }
                    @media(min-width:760px){
                      .mvp-ov-shell{min-height:540px !important;}
                      .mvp-ov-grid{flex-direction:row;}
                      .mvp-ov-left{flex:0 0 320px;padding:32px 28px;}
                      .mvp-ov-right-scroll{padding:32px 32px 16px;}
                      .mvp-ov-footer{padding:14px 32px;}
                      .mvp-ov-left .mvp-ov-eyebrow{font-size:10px !important;margin-bottom:12px !important;}
                      .mvp-ov-left .mvp-ov-title{font-size:22px !important;margin-bottom:18px !important;line-height:1.2 !important;}
                      .mvp-ov-left .mvp-ov-amount{font-size:40px !important;margin-bottom:6px !important;letter-spacing:-1.5px !important;}
                      .mvp-ov-left .mvp-ov-meta{font-size:12px !important;}
                      .mvp-ov-left .mvp-ov-persona{display:block !important;}
                      .mvp-ov-left .mvp-ov-back{margin-bottom:16px !important;}
                    }
                  `}</style>

                  {/* Close button — top-right corner */}
                  <button
                    onClick={closeAll}
                    aria-label="Schließen"
                    style={{
                      position: 'absolute', top: 8, right: 8, zIndex: 3,
                      width: 28, height: 28, borderRadius: 14,
                      border: 'none', background: 'transparent', color: TEXT_MUTED,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.color = TEXT; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = TEXT_MUTED; }}
                  >
                    <IconX size={16} stroke={2} />
                  </button>

                  <div className="mvp-ov-grid">
                    {/* LEFT — dark hero with crossfading content */}
                    <div className="mvp-ov-left" style={{
                      background: 'linear-gradient(160deg, #243c47 0%, #1c2e3f 100%)',
                      color: WHITE, display: 'flex', flexDirection: 'column',
                    }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`left-${contentKey}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18 }}
                          style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                        >
                          {/* Back button when in detail mode (only if we came from module list) */}
                          {isDetail && openModuleKey && (
                            <button
                              onClick={backToList}
                              className="mvp-ov-back"
                              style={{
                                alignSelf: 'flex-start',
                                background: 'rgba(255,255,255,0.12)', color: WHITE,
                                border: 'none', borderRadius: 999,
                                padding: '5px 10px',
                                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                fontFamily: 'inherit',
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                              }}
                            >
                              <IconArrowLeft size={12} stroke={2.4} /> Zurück zur Liste
                            </button>
                          )}
                          <div>
                            <div className="mvp-ov-eyebrow" style={{ fontWeight: 700, color: ORANGE, letterSpacing: '0.14em' }}>
                              {eyebrow}
                            </div>
                            <h2 className="mvp-ov-title" style={{ fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                              {title}
                            </h2>
                            <div className="mvp-ov-amount" style={{ fontWeight: 800, color: ORANGE, lineHeight: 1 }}>
                              {fmt(amount)} €
                            </div>
                            <div className="mvp-ov-meta" style={{ opacity: 0.75 }}>{meta}</div>
                          </div>

                          <div style={{ flex: 1, minHeight: 20 }} />

                          <div className="mvp-ov-persona">
                            <div style={{ fontSize: 11, fontWeight: 700, color: ORANGE, marginBottom: 3 }}>Persönlich für Sie:</div>
                            <div style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.5 }}>{ctx}</div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* RIGHT — switches between list and detail */}
                    <div className="mvp-ov-right">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`right-${contentKey}`}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
                        >
                          {isDetail ? (() => {
                            // Behavioral tip = no partner/service behind it (kein Anbieter zum Wechseln).
                            // Transactional tip = has partner → "Jetzt sparen" mit Anbieter-Empfehlungen.
                            const isFreeTip = !tip!.partner || tip!.partner.trim() === '';
                            const isTipDone = done.has(tip!.id);
                            // Offers: 1) custom getOffers if defined  2) partner-string fallback  3) generic
                            const customOffers = tip!.getOffers ? tip!.getOffers(profile) : null;
                            const partnerList = !customOffers && tip!.partner ? tip!.partner.split(/,\s*/).filter(Boolean) : [];
                            const offers: Array<{ name: string; description?: string; url?: string; savings?: number; recommended?: boolean }> =
                              customOffers && customOffers.length > 0
                                ? customOffers
                                : partnerList.length > 0
                                ? partnerList.slice(0, 4).map((p, i) => ({ name: p, savings: Math.round((hg === 3 ? tip!.savingsHg3 : tip!.savingsHg2) * (0.95 - i * 0.1)), recommended: i === 0 }))
                                : [
                                    { name: 'Vergleichsportal Check24',   savings: Math.round((hg === 3 ? tip!.savingsHg3 : tip!.savingsHg2) * 0.95), recommended: true },
                                    { name: 'Vergleichsportal Verivox',   savings: Math.round((hg === 3 ? tip!.savingsHg3 : tip!.savingsHg2) * 0.88) },
                                    { name: 'Direkt beim Anbieter',       savings: Math.round((hg === 3 ? tip!.savingsHg3 : tip!.savingsHg2) * 0.80) },
                                  ];

                            return (
                            <>
                              <div className="mvp-ov-right-scroll">
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={`detail-${detailView}`}
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -12 }}
                                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                  >
                                {detailView === 'intro' ? (
                                  <>
                                    {/* Meta chips */}
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, paddingRight: 44 }}>
                                      {tip!.effort && (
                                        <span style={{
                                          display: 'inline-flex', alignItems: 'center', gap: 5,
                                          background: '#f1f5f9', color: TEXT,
                                          padding: '5px 10px', borderRadius: 999,
                                          fontSize: 12, fontWeight: 500,
                                        }}>
                                          <IconClock size={12} stroke={2} color={TEXT_MUTED} /> {tip!.effort}
                                        </span>
                                      )}
                                      {tip!.difficulty && (
                                        <span style={{
                                          display: 'inline-flex', alignItems: 'center',
                                          color: tip!.difficulty === 'Einfach' ? GREEN_DARK : tip!.difficulty === 'Mittel' ? '#92400e' : '#c52828',
                                          padding: '5px 10px', borderRadius: 999,
                                          fontSize: 12, fontWeight: 700,
                                          border: `1px solid currentColor`,
                                        }}>
                                          {tip!.difficulty}
                                        </span>
                                      )}
                                    </div>

                                    {tip!.description && (
                                      <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.65, marginBottom: 18, fontWeight: 400 }}>
                                        {tip!.description}
                                      </p>
                                    )}

                                    {tip!.why && (
                                      <div style={{
                                        background: '#f9fafb',
                                        borderLeft: `3px solid ${BLUE}`,
                                        borderRadius: 6,
                                        padding: '12px 14px',
                                      }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: BLUE, letterSpacing: '0.12em', marginBottom: 6 }}>
                                          WARUM DAS SPART
                                        </div>
                                        <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.55, margin: 0 }}>{tip!.why}</p>
                                      </div>
                                    )}
                                  </>
                                ) : detailView === 'steps' ? (
                                  <>
                                    {/* Back to intro */}
                                    <button
                                      onClick={() => setDetailView('intro')}
                                      style={{
                                        background: 'transparent', color: TEXT_MUTED,
                                        border: 'none', padding: 0, marginBottom: 14,
                                        fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                      }}
                                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = TEXT; }}
                                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = TEXT_MUTED; }}
                                    >
                                      <IconArrowLeft size={13} stroke={2} /> Zur Einleitung
                                    </button>
                                    {tip!.howTo && tip!.howTo.length > 0 ? (
                                      <div>
                                        <h3 style={{ fontSize: 10, fontWeight: 700, color: TEXT_MUTED, letterSpacing: '0.12em', margin: '0 0 12px' }}>
                                          IN {tip!.howTo.length} SCHRITT{tip!.howTo.length === 1 ? '' : 'EN'} ERLEDIGT
                                        </h3>
                                        <ol style={{ paddingLeft: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                          {tip!.howTo.map((step, i) => (
                                            <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                              <span style={{
                                                flexShrink: 0,
                                                width: 22, height: 22, borderRadius: 11,
                                                background: GREEN_LT, color: GREEN_DARK,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                marginTop: 1, fontSize: 12, fontWeight: 800,
                                              }}>
                                                {i + 1}
                                              </span>
                                              <span style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.6 }}>{step}</span>
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                    ) : (
                                      <p style={{ fontSize: 13, color: TEXT_MUTED, fontStyle: 'italic' }}>
                                        Für diesen Tipp gibt es keine konkreten Schritte — direkt loslegen.
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  // OFFERS SUB-VIEW (replaces detail content while keeping dark hero)
                                  <motion.div
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ paddingRight: 44 }}
                                  >
                                    <button
                                      onClick={() => setDetailView('steps')}
                                      style={{
                                        background: 'transparent', color: TEXT_MUTED,
                                        border: 'none', padding: 0, marginBottom: 14,
                                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                      }}
                                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = TEXT; }}
                                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = TEXT_MUTED; }}
                                    >
                                      <IconArrowLeft size={13} stroke={2} /> Zurück zu den Schritten
                                    </button>
                                    <h3 style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: 0, marginBottom: 4, letterSpacing: '-0.01em' }}>
                                      Unsere Empfehlungen
                                    </h3>
                                    <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.55, margin: '0 0 18px' }}>
                                      Wählen Sie eine Option und sparen Sie noch heute. Alle Empfehlungen sind für Sie kostenfrei.
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                      {offers.map((o, i) => {
                                        const isRec = !!o.recommended;
                                        const href = o.url || ctaUrl || '#';
                                        return (
                                          <div
                                            key={o.name + i}
                                            style={{
                                              border: `1px solid ${isRec ? GREEN : BORDER}`,
                                              borderRadius: 6, padding: '14px 16px',
                                              display: 'flex', alignItems: 'center', gap: 12,
                                              position: 'relative',
                                              background: isRec ? GREEN_LT : WHITE,
                                            }}
                                          >
                                            {isRec && (
                                              <span style={{
                                                position: 'absolute', top: -8, left: 12,
                                                background: GREEN_DARK, color: WHITE,
                                                fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
                                                padding: '3px 8px', borderRadius: 999,
                                              }}>EMPFOHLEN</span>
                                            )}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.3, marginBottom: o.description ? 3 : 4 }}>
                                                {o.name}
                                              </div>
                                              {o.description && (
                                                <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.4, marginBottom: 4 }}>
                                                  {o.description}
                                                </div>
                                              )}
                                              {o.savings != null && (
                                                <div style={{ fontSize: 12, color: GREEN_DARK, fontWeight: 700 }}>
                                                  bis zu {fmt(o.savings)} € / Jahr sparen
                                                </div>
                                              )}
                                            </div>
                                            <a
                                              href={href}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                                background: isRec ? GREEN_DARK : DARK,
                                                color: WHITE,
                                                borderRadius: 999, padding: '8px 14px',
                                                fontSize: 12, fontWeight: 700, textDecoration: 'none',
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0,
                                              }}
                                            >
                                              Zum Anbieter <IconArrowRight size={13} stroke={2.5} />
                                            </a>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    <p style={{ fontSize: 10, color: TEXT_MUTED, lineHeight: 1.5, marginTop: 18 }}>
                                      Werbung · Wir verdienen ggf. eine Provision, für Sie ändert sich am Preis nichts.
                                    </p>
                                  </motion.div>
                                )}
                                  </motion.div>
                                </AnimatePresence>
                              </div>

                              <div className="mvp-ov-footer">
                                {detailView !== 'offers' && (
                                  <div style={{ fontSize: 10, color: TEXT_MUTED, flex: 1 }}>
                                    {isFreeTip ? 'Selbstständig umsetzbar' : 'Werbung · Empfehlung kostenfrei'}
                                  </div>
                                )}
                                {detailView === 'offers' && <div style={{ flex: 1 }} />}

                                {/* Ignorieren — auf allen Sub-Views gleich */}
                                <button
                                  onClick={() => { removeTip(tip!.id); closeAll(); }}
                                  style={{
                                    background: 'transparent', color: TEXT_MUTED,
                                    border: 'none',
                                    padding: '8px 12px',
                                    fontSize: 12, fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                  }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#c52828'; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = TEXT_MUTED; }}
                                >
                                  <IconX size={13} stroke={2.4} /> Ignorieren
                                </button>

                                {detailView === 'intro' ? (
                                  // Seite 1 (Einleitung + Warum) → "Weiter" zur Steps-Seite
                                  <button
                                    onClick={() => setDetailView('steps')}
                                    style={{
                                      background: DARK, color: WHITE, border: 'none',
                                      borderRadius: 999, padding: '11px 20px',
                                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                      fontFamily: 'inherit',
                                      display: 'inline-flex', alignItems: 'center', gap: 6,
                                      boxShadow: '0 4px 12px rgba(36,60,71,0.20)',
                                    }}
                                  >
                                    Weiter <IconArrowRight size={14} stroke={2.5} />
                                  </button>
                                ) : detailView === 'steps' ? (
                                  // Seite 2 (Steps) → bei Gratis "Erledigt", sonst "Jetzt sparen"
                                  isFreeTip ? (
                                    <button
                                      onClick={() => { toggleDone(tip!.id); closeAll(); }}
                                      style={{
                                        background: isTipDone ? GREEN_LT : GREEN_DARK,
                                        color: isTipDone ? GREEN_DARK : WHITE,
                                        border: 'none',
                                        borderRadius: 999, padding: '11px 20px',
                                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        boxShadow: '0 4px 12px rgba(22,122,82,0.20)',
                                      }}
                                    >
                                      <IconCheck size={14} stroke={2.5} /> {isTipDone ? 'Rückgängig' : 'Erledigt'}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => setDetailView('offers')}
                                      style={{
                                        background: DARK, color: WHITE, border: 'none',
                                        borderRadius: 999, padding: '11px 20px',
                                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        boxShadow: '0 4px 12px rgba(36,60,71,0.20)',
                                      }}
                                    >
                                      Jetzt sparen <IconArrowRight size={14} stroke={2.5} />
                                    </button>
                                  )
                                ) : (
                                  // Seite 3 (Offers) → "Als erledigt markieren"
                                  <button
                                    onClick={() => { toggleDone(tip!.id); closeAll(); }}
                                    style={{
                                      background: isTipDone ? GREEN_LT : GREEN_DARK,
                                      color: isTipDone ? GREEN_DARK : WHITE,
                                      border: 'none',
                                      borderRadius: 999, padding: '11px 20px',
                                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                      fontFamily: 'inherit',
                                      display: 'inline-flex', alignItems: 'center', gap: 6,
                                      boxShadow: '0 4px 12px rgba(22,122,82,0.20)',
                                    }}
                                  >
                                    <IconCheck size={14} stroke={2.5} /> {isTipDone ? 'Rückgängig' : 'Als erledigt markieren'}
                                  </button>
                                )}
                              </div>
                            </>
                            );
                          })() : isList ? (
                            <>
                              <style>{`
                                .mvp-list-row{position:relative;}
                                .mvp-list-actions{
                                  position:absolute;
                                  bottom:0;
                                  right:14px;
                                  transform:translateY(40%);
                                  background:#fff;
                                  padding:0 6px;
                                  display:inline-flex;
                                  gap:8px;
                                  opacity:0;
                                  pointer-events:none;
                                  transition:opacity 0.15s;
                                  line-height:1;
                                }
                                .mvp-list-row:hover .mvp-list-actions{
                                  opacity:1;
                                  pointer-events:auto;
                                }
                              `}</style>
                              <div className="mvp-ov-right-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 44 }}>
                                {cluster!.tips.map((t) => {
                                  const TIcon = t.icon;
                                  const sv = getSavings(t);
                                  const isDone = done.has(t.id);
                                  return (
                                    <div
                                      key={t.id}
                                      className="mvp-list-row"
                                      onClick={() => setOverlayTipId(t.id)}
                                      style={{
                                        background: WHITE, border: `1px solid ${isDone ? GREEN : BORDER}`,
                                        borderRadius: 6, padding: '12px 14px',
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const,
                                        width: '100%', transition: 'border-color 0.15s',
                                        opacity: isDone ? 0.65 : 1,
                                      }}
                                      onMouseEnter={e => { if (!isDone) (e.currentTarget as HTMLElement).style.borderColor = BLUE; }}
                                      onMouseLeave={e => { if (!isDone) (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
                                    >
                                      <div style={{
                                        width: 36, height: 36, flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      }}>
                                        {isDone
                                          ? <IconCheck size={20} stroke={2.5} color={GREEN_DARK} />
                                          : <TIcon size={22} stroke={1.7} color={BLUE} />}
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                                          <span style={{
                                            fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.3,
                                            textDecoration: isDone ? 'line-through' : 'none',
                                          }}>{t.title}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: TEXT_MUTED, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                          <span style={{ color: GREEN_DARK, fontWeight: 700 }}>{fmt(sv)} € / Jahr</span>
                                          {t.effort && <span>· {t.effort}</span>}
                                        </div>
                                      </div>
                                      <IconArrowRight size={16} stroke={2.2} color={TEXT_MUTED} style={{ flexShrink: 0 }} />
                                      {/* Hover-Actions: Ignorieren + Erledigt — cut into bottom border */}
                                      <span className="mvp-list-actions">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); removeTip(t.id); }}
                                          style={{
                                            background: 'transparent', color: '#c52828',
                                            border: 'none', padding: '2px 4px',
                                            fontSize: 11, fontWeight: 700,
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            display: 'inline-flex', alignItems: 'center', gap: 3, lineHeight: 1,
                                          }}
                                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
                                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
                                        >
                                          <IconX size={12} stroke={2.4} /> Ignorieren
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); toggleDone(t.id); }}
                                          style={{
                                            background: 'transparent', color: GREEN_DARK,
                                            border: 'none', padding: '2px 4px',
                                            fontSize: 11, fontWeight: 700,
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            display: 'inline-flex', alignItems: 'center', gap: 3, lineHeight: 1,
                                          }}
                                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
                                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
                                        >
                                          <IconCheck size={12} stroke={2.5} /> {isDone ? 'Rückgängig' : 'Erledigt'}
                                        </button>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <>
                              <style>{`
                                .mvp-tt-row{position:relative;}
                                .mvp-tt-actions{
                                  position:absolute;
                                  bottom:0;
                                  right:14px;
                                  transform:translateY(40%);
                                  background:#fff;
                                  padding:0 6px;
                                  display:inline-flex;
                                  gap:8px;
                                  opacity:0;
                                  pointer-events:none;
                                  transition:opacity 0.15s;
                                  line-height:1;
                                }
                                .mvp-tt-row:hover .mvp-tt-actions{
                                  opacity:1;
                                  pointer-events:auto;
                                }
                              `}</style>
                              <div className="mvp-ov-right-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 36 }}>
                                {topTips.map((t, i) => {
                                  const TIcon = t.icon;
                                  const sv = getSavings(t);
                                  const isDone = done.has(t.id);
                                  return (
                                    <div
                                      key={t.id}
                                      className="mvp-tt-row"
                                      onClick={() => setOverlayTipId(t.id)}
                                      style={{
                                        background: WHITE, border: `1px solid ${isDone ? GREEN : BORDER}`,
                                        borderRadius: 6, padding: '12px 14px',
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const,
                                        width: '100%', transition: 'border-color 0.15s',
                                        opacity: isDone ? 0.65 : 1,
                                      }}
                                      onMouseEnter={e => { if (!isDone) (e.currentTarget as HTMLElement).style.borderColor = BLUE; }}
                                      onMouseLeave={e => { if (!isDone) (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
                                    >
                                      <div style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: 28, height: 28, borderRadius: 999,
                                        background: isDone ? GREEN_DARK : DARK, color: WHITE,
                                        fontSize: 13, fontWeight: 800, flexShrink: 0,
                                      }}>
                                        {isDone ? <IconCheck size={14} stroke={2.5} /> : (i + 1)}
                                      </div>
                                      <div style={{
                                        width: 40, height: 40, flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden',
                                      }}>
                                        {t.id === 'thermostate'
                                          ? <img src={thermostatImg} alt="Smartes Thermostat" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                                          : <TIcon size={22} stroke={1.7} color={BLUE} />}
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, lineHeight: 1.3, marginBottom: 2, textDecoration: isDone ? 'line-through' : 'none' }}>{t.title}</div>
                                        <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                                          <span style={{ color: GREEN_DARK, fontWeight: 700 }}>{fmt(sv)} € / Jahr</span>
                                          {t.effort && <span> · {t.effort}</span>}
                                        </div>
                                      </div>
                                      {/* Arrow on right (default) */}
                                      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
                                        <IconArrowRight size={16} stroke={2.2} color={TEXT_MUTED} />
                                      </span>
                                      {/* Action buttons cut into the bottom border on hover */}
                                      <span className="mvp-tt-actions">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); removeTip(t.id); }}
                                          style={{
                                            background: 'transparent', color: '#c52828',
                                            border: 'none',
                                            padding: '2px 4px',
                                            fontSize: 11, fontWeight: 700,
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            display: 'inline-flex', alignItems: 'center', gap: 3,
                                            lineHeight: 1,
                                          }}
                                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
                                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
                                        >
                                          <IconX size={12} stroke={2.4} /> Ignorieren
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); toggleDone(t.id); }}
                                          style={{
                                            background: 'transparent',
                                            color: GREEN_DARK,
                                            border: 'none',
                                            padding: '2px 4px',
                                            fontSize: 11, fontWeight: 700,
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            display: 'inline-flex', alignItems: 'center', gap: 3,
                                            lineHeight: 1,
                                          }}
                                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
                                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
                                        >
                                          <IconCheck size={12} stroke={2.5} /> {isDone ? 'Rückgängig' : 'Erledigt'}
                                        </button>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mvp-ov-footer" style={{ justifyContent: 'flex-end' }}>
                                <button
                                  onClick={closeTopTipsOverlay}
                                  style={{
                                    background: DARK, color: WHITE, border: 'none',
                                    borderRadius: 999, padding: '11px 22px',
                                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    boxShadow: '0 4px 12px rgba(36,60,71,0.20)',
                                  }}
                                >
                                  Weiter zum Dashboard <IconArrowRight size={14} stroke={2.5} />
                                </button>
                              </div>
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          );
        })()}
      </AnimatePresence>

    </motion.div>
  );
}

// ── Feedback Overlay ─────────────────────────────────────────────
function FeedbackOverlay({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState<number>(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [wish, setWish] = useState('');
  const [wantsCall, setWantsCall] = useState<boolean | null>(null);
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const TEXT_C  = '#44607F';
  const MUTED_C = '#7E8990';
  const BORDER_C = '#C2C7CB';
  const BG_C = '#F4F4F4';
  const PRIMARY_C = '#3D5261';
  const ORANGE_C = '#F9AA00';
  const GREEN_C = '#436F56';
  const GREEN_BRIGHT_C = '#E2EEE7';

  function submit() {
    // Hier könnte ein POST an ein Backend / Form-Service gehen.
    // Für jetzt: lokal abspeichern.
    try {
      const payload = { rating, wish, wantsCall, contact, ts: Date.now() };
      const prev = JSON.parse(localStorage.getItem('wpilot_mvp_feedback') || '[]');
      prev.push(payload);
      localStorage.setItem('wpilot_mvp_feedback', JSON.stringify(prev));
    } catch {}
    setSubmitted(true);
  }

  const canSubmit = rating > 0 || wish.trim().length > 0 || wantsCall === true;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(30,32,38,0.22)',
        }}
      />
      <style>{`
        .mvp-fb-wrap{padding:5px;}
        @media(min-width:640px){.mvp-fb-wrap{padding:20px;}}
        .mvp-fb-grid{display:flex;flex-direction:column;flex:1;min-height:0;}
        .mvp-fb-left{padding:16px 20px;position:relative;flex-shrink:0;}
        .mvp-fb-right{position:relative;display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;}
        .mvp-fb-right-scroll{flex:1;overflow-y:auto;padding:18px 20px 12px;}
        .mvp-fb-footer{position:sticky;bottom:0;background:#fff;border-top:1px solid ${BORDER_C};padding:10px 20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end;}
        .mvp-fb-shell{height:calc(100dvh - 10px) !important;max-height:calc(100dvh - 10px) !important;width:100% !important;}
        .mvp-fb-left .mvp-fb-eyebrow{font-size:9px !important;margin-bottom:6px !important;}
        .mvp-fb-left .mvp-fb-title{font-size:16px !important;margin-bottom:8px !important;line-height:1.25 !important;}
        .mvp-fb-left .mvp-fb-sub{font-size:11px !important;}
        @media(min-width:640px){
          .mvp-fb-shell{height:auto !important;max-height:90vh !important;width:min(820px, 100%) !important;}
        }
        @media(min-width:760px){
          .mvp-fb-shell{min-height:480px !important;}
          .mvp-fb-grid{flex-direction:row;}
          .mvp-fb-left{flex:0 0 300px;padding:32px 28px;}
          .mvp-fb-right-scroll{padding:32px 32px 16px;}
          .mvp-fb-footer{padding:14px 32px;}
          .mvp-fb-left .mvp-fb-eyebrow{font-size:10px !important;margin-bottom:12px !important;}
          .mvp-fb-left .mvp-fb-title{font-size:22px !important;margin-bottom:14px !important;line-height:1.2 !important;}
          .mvp-fb-left .mvp-fb-sub{font-size:13px !important;}
        }
      `}</style>
      <div className="mvp-fb-wrap" style={{
        position: 'fixed', inset: 0, zIndex: 1001,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className="mvp-fb-shell"
          style={{
            width: 'min(820px, 100%)', maxHeight: '90vh', minHeight: 0,
            background: '#fff', border: `1px solid ${BORDER_C}`,
            borderRadius: 6, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            pointerEvents: 'auto',
            position: 'relative',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Schließen"
            style={{
              position: 'absolute', top: 8, right: 8, zIndex: 3,
              width: 28, height: 28, borderRadius: 14,
              border: 'none', background: 'transparent', color: MUTED_C,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = MUTED_C; }}
          >
            <IconX size={16} stroke={2} />
          </button>

          {!submitted ? (
            <div className="mvp-fb-grid">
              {/* LEFT — dark hero */}
              <div className="mvp-fb-left" style={{
                background: 'linear-gradient(160deg, #243c47 0%, #1c2e3f 100%)',
                color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
              }}>
                <div className="mvp-fb-eyebrow" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: ORANGE_C }}>
                  IHRE MEINUNG
                </div>
                <h2 className="mvp-fb-title" style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                  Wie gefällt Ihnen der Spar-Lotse?
                </h2>
                <p className="mvp-fb-sub" style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', margin: 0, lineHeight: 1.5 }}>
                  3 kurze Fragen — Ihr Feedback hilft uns, das Tool besser zu machen.
                </p>
              </div>

              {/* RIGHT — form */}
              <div className="mvp-fb-right">
                <div className="mvp-fb-right-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Rating */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY_C, marginBottom: 8 }}>
                  Wie zufrieden sind Sie?
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(n => {
                    const filled = n <= (hoverStar || rating);
                    return (
                      <motion.button
                        key={n}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverStar(n)}
                        onMouseLeave={() => setHoverStar(0)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {filled
                          ? <IconStarFilled size={26} color={ORANGE_C} />
                          : <IconStar size={26} stroke={1.6} color={BORDER_C} />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Wish */}
              <div>
                <label htmlFor="fb-wish" style={{ fontSize: 12, fontWeight: 700, color: PRIMARY_C, marginBottom: 8, display: 'block' }}>
                  Was wünschen Sie sich noch?
                </label>
                <textarea
                  id="fb-wish"
                  value={wish}
                  onChange={e => setWish(e.target.value)}
                  rows={3}
                  placeholder="z. B. mehr Spartipps für Gartenbesitzer, einen Vergleichsrechner für …"
                  style={{
                    width: '100%', resize: 'vertical' as const,
                    padding: '10px 12px',
                    border: `1px solid ${BORDER_C}`,
                    borderRadius: 6,
                    fontSize: 14, color: PRIMARY_C, fontFamily: 'inherit',
                    background: '#fff', outline: 'none',
                    boxSizing: 'border-box' as const,
                    lineHeight: 1.5,
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = ORANGE_C; }}
                  onBlur={e => { e.currentTarget.style.borderColor = BORDER_C; }}
                />
              </div>

              {/* Want call */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY_C, marginBottom: 8 }}>
                  Hätten Sie Interesse an einem persönlichen Gespräch?
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  {[
                    { v: true,  label: 'Ja, gerne' },
                    { v: false, label: 'Nein, danke' },
                  ].map(opt => {
                    const isOn = wantsCall === opt.v;
                    return (
                      <button
                        key={String(opt.v)}
                        onClick={() => setWantsCall(opt.v)}
                        style={{
                          flex: '1 1 0',
                          background: isOn ? (opt.v ? GREEN_BRIGHT_C : BG_C) : '#fff',
                          color: isOn ? (opt.v ? GREEN_C : PRIMARY_C) : MUTED_C,
                          border: `1.5px solid ${isOn ? (opt.v ? GREEN_C : BORDER_C) : BORDER_C}`,
                          borderRadius: 999, padding: '10px 14px',
                          fontSize: 13, fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'inherit',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                      >
                        {isOn && opt.v && <IconCheck size={14} stroke={2.5} />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                {wantsCall === true && (
                  <input
                    type="text"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="E-Mail oder Telefonnummer"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${BORDER_C}`,
                      borderRadius: 6,
                      fontSize: 14, color: PRIMARY_C, fontFamily: 'inherit',
                      background: '#fff', outline: 'none',
                      boxSizing: 'border-box' as const,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = ORANGE_C; }}
                    onBlur={e => { e.currentTarget.style.borderColor = BORDER_C; }}
                  />
                )}
              </div>

                </div>
                {/* Footer */}
                <div className="mvp-fb-footer">
                  <button
                    onClick={onClose}
                    style={{
                      background: 'transparent', color: MUTED_C, border: 'none',
                      padding: '11px 18px', borderRadius: 999,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={submit}
                    disabled={!canSubmit}
                    style={{
                      background: canSubmit ? PRIMARY_C : '#E0E3E6',
                      color: canSubmit ? '#fff' : MUTED_C,
                      border: 'none', borderRadius: 999, padding: '11px 22px',
                      fontSize: 13, fontWeight: 700,
                      cursor: canSubmit ? 'pointer' : 'not-allowed',
                      fontFamily: 'inherit',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      boxShadow: canSubmit ? '0 4px 12px rgba(36,60,71,0.20)' : 'none',
                      transition: 'background 0.15s',
                    }}
                  >
                    Feedback senden <IconArrowRight size={14} stroke={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px 26px 36px', textAlign: 'center' as const, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 64, height: 64, borderRadius: 32,
                background: GREEN_BRIGHT_C, marginBottom: 18,
              }}>
                <IconCheck size={32} stroke={2.5} color={GREEN_C} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY_C, margin: 0, marginBottom: 8 }}>
                Vielen Dank!
              </h2>
              <p style={{ fontSize: 14, color: MUTED_C, lineHeight: 1.5, margin: 0, marginBottom: 22, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
                Ihr Feedback ist angekommen. {wantsCall === true ? 'Wir melden uns in den nächsten Tagen bei Ihnen.' : ''}
              </p>
              <button
                onClick={onClose}
                style={{
                  background: PRIMARY_C, color: '#fff', border: 'none',
                  borderRadius: 999, padding: '11px 26px',
                  fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Schließen
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
