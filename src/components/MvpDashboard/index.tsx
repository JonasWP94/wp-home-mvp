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
  IconShieldCheck,
  IconHomeShield,
  IconHeartHandshake,
  IconPlus,
} from '@tabler/icons-react';
import logoWp from '../../assets/logo-wp.png';
import type { MvpProfile } from '../_types';

interface MvpTip {
  id: string;
  title: string;
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
    key: 'haftpflicht' as const,
    label: 'Privathaftpflicht',
    icon: IconShieldCheck,
    options: [
      { value: 'true',  label: 'Vorhanden',         icon: IconCheck },
      { value: 'false', label: 'Nicht vorhanden',   icon: IconX },
    ],
  },
  {
    key: 'hausrat' as const,
    label: 'Hausratversicherung',
    icon: IconHomeShield,
    options: [
      { value: 'true',  label: 'Vorhanden',         icon: IconCheck },
      { value: 'false', label: 'Nicht vorhanden',   icon: IconX },
    ],
  },
  {
    key: 'berufsunfaehigkeit' as const,
    label: 'Berufsunfähigkeit',
    icon: IconHeartHandshake,
    options: [
      { value: 'true',  label: 'Vorhanden',         icon: IconCheck },
      { value: 'false', label: 'Nicht vorhanden',   icon: IconX },
    ],
  },
  {
    key: 'gebaeude' as const,
    label: 'Wohngebäudeversicherung',
    icon: IconBuilding,
    options: [
      { value: 'true',  label: 'Vorhanden',         icon: IconCheck },
      { value: 'false', label: 'Nicht vorhanden',   icon: IconX },
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
];

// ── Tips ─────────────────────────────────────────────────────────
const ALL_TIPS: MvpTip[] = [
  {
    id: 'strom-wechsel',
    title: 'Stromtarif wechseln',
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
    savingsHg2: 475, savingsHg3: 475,
    condition: () => true,
  },
  {
    id: 'gas-wechsel',
    title: 'Gastarif wechseln',
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
    savingsHg2: 361, savingsHg3: 361,
    condition: () => true,
  },
  {
    id: 'thermostate',
    title: 'Smarte Thermostate',
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
    savingsHg2: 220, savingsHg3: 280,
    condition: () => true,
  },
  {
    id: 'waermepumpe',
    title: 'Wärmepumpe',
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
    savingsHg2: 1200, savingsHg3: 1200,
    condition: (p) => p.tenure === 'eigentum' && p.propertyType === 'haus' && p.heatingType !== 'waermepumpe',
  },
  {
    id: 'solaranlage',
    title: 'Solaranlage',
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
    savingsHg2: 1100, savingsHg3: 1300,
    condition: (p) => p.tenure === 'eigentum' && p.propertyType === 'haus',
  },
  {
    id: 'balkonkraftwerk',
    title: 'Balkonkraftwerk',
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
    savingsHg2: 220, savingsHg3: 240,
    condition: (p) => !(p.tenure === 'eigentum' && p.propertyType === 'haus'),
  },
  {
    id: 'kfz-versicherung',
    title: 'KFZ-Versicherung wechseln',
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
    savingsHg2: 350, savingsHg3: 350,
    condition: (p) => p.autoType !== 'keins' && p.autoType !== '',
  },
  {
    id: 'thg-praemie',
    title: 'THG-Prämie',
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
    savingsHg2: 95, savingsHg3: 95,
    condition: (p) => (p.vehicles?.eauto ?? 0) > 0 || p.autoType === 'eauto',
  },
  {
    id: 'wallbox',
    title: 'Wallbox / Laden zuhause',
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
    savingsHg2: 400, savingsHg3: 500,
    condition: (p) => (p.vehicles?.hybrid ?? 0) > 0 || (p.vehicles?.eauto ?? 0) > 0 || p.autoType === 'hybrid',
  },
  {
    id: 'haftpflicht-versicherung',
    title: 'Privathaftpflicht abschließen',
    description: 'Eine moderne Privathaftpflicht mit 10 Mio. € Deckung kostet 50–80 €/Jahr — wer einen alten Tarif hat, zahlt oft 120–200 €. Wer noch keine hat, riskiert im Schadensfall die finanzielle Existenz.',
    why: 'Im Alltag passiert schnell ein teurer Fehler: Glas auf dem Hardwood-Boden des Freundes, beschädigtes Mietfahrzeug, Sturz eines Passanten. Privathaftpflicht zahlt — ohne Versicherung haften Sie privat (BGH: lebenslang).',
    howTo: [
      'Bedarf prüfen: Solo-Tarif ca. 50–70 €/Jahr, Paartarif 70–100 €/Jahr, Familientarif (mit minderjährigen Kindern) 80–120 €/Jahr.',
      'Online vergleichen (Check24, Verivox) — direkt nach Preis filtern.',
      'Auf Stiftung-Warentest-Empfehlung und folgende Punkte achten: Deckungssumme ≥ 10 Mio. €, Forderungsausfalldeckung (zahlt auch wenn Schädiger nicht zahlt), Best-Leistungs-Garantie.',
      'Bei alter Police: Kündigungsschreiben aus dem Portal als Vorlage. Neue Police gilt sofort beim Abschluss.',
      'Schäden direkt online melden — bei modernen Anbietern 24/7-Hotline + App.',
    ],
    effort: '15 Min einmalig',
    difficulty: 'Einfach',
    partner: 'Clark, Check24',
    priority: 3, category: 'versicherung', icon: IconShieldCheck,
    savingsHg2: 60, savingsHg3: 80,
    condition: () => true,
  },
  {
    id: 'hausrat-versicherung',
    title: 'Hausratversicherung optimieren',
    description: 'Eine durchschnittliche Hausratversicherung für eine 80-qm-Wohnung kostet 80–150 €/Jahr. Alte Verträge ohne Elementarschäden-Deckung sind 2024 angesichts häufiger Starkregen-Ereignisse riskant — und oft 50–100 € teurer als moderne Tarife.',
    why: 'Hausrat zahlt bei Einbruch, Feuer, Wasser, Sturm und (mit Zusatz) Elementarschäden. Faustregel: Versicherungssumme ≥ 650 €/qm Wohnfläche. Häufiger Fehler: zu hohe Summe → zu hohe Prämie. Neue Tarife haben smartere Konditionen (Fahrraddiebstahl inklusive, Außenversicherung weltweit).',
    howTo: [
      'Wohnfläche × 650 € = realistische Versicherungssumme (z.B. 80 qm → 52.000 €). Wertvolle Einrichtung extra erfassen.',
      'Tarifvergleich starten — wichtige Klauseln: Elementarschäden (Hochwasser, Erdrutsch, Starkregen), Fahrraddiebstahl, Glasbruch, grobe Fahrlässigkeit.',
      'Selbstbeteiligung von 150–250 € senkt die Prämie um 15–25 %.',
      'Kündigungsfrist: 3 Monate zum Ablauf. Bei Beitragserhöhung Sonderkündigungsrecht (1 Monat).',
      'Beim Wechsel: Neuer Anbieter übernimmt oft Kündigung. Versicherung gilt nahtlos weiter.',
    ],
    effort: '20 Min einmalig',
    difficulty: 'Einfach',
    partner: 'Clark, Check24',
    priority: 2, category: 'versicherung', icon: IconHomeShield,
    savingsHg2: 100, savingsHg3: 120,
    condition: () => true,
  },
  {
    id: 'berufsunfaehigkeit-versicherung',
    title: 'Berufsunfähigkeitsversicherung',
    description: 'Jeder vierte Deutsche wird berufsunfähig — Hauptursache: psychische Erkrankungen, Rückenleiden, Krebs. Die staatliche Erwerbsminderungsrente reicht selten zum Leben (Ø 1.000 €/Monat). Eine BU sichert Ihr Einkommen mit ca. 30–70 €/Monat ab.',
    why: 'Bei Berufsunfähigkeit zahlt die BU eine vereinbarte Monatsrente bis zum Renteneintritt. Ohne BU müssen Sie auf private Ersparnisse, Familie oder die geringe staatliche Rente zurückgreifen. Je jünger und gesünder beim Abschluss, desto günstiger — Beitrag bleibt für die gesamte Vertragslaufzeit gleich.',
    howTo: [
      'Bedarf berechnen: 70–80 % des Nettoeinkommens als monatliche BU-Rente (z.B. 2.500 € Netto → 1.800 € BU).',
      'Unabhängige Beratung holen — kein Versicherer-Vertreter, da diese provisionsabhängig empfehlen. Beratung kostet 300–800 € (Honorar), spart aber oft Jahresbeiträge ein.',
      'Gesundheitsfragen vorbereiten: alle Diagnosen, Behandlungen, Therapien, Klinikaufenthalte der letzten 5–10 Jahre. Falsche Angaben → Leistungsverweigerung im Schadensfall.',
      'Auf Top-Klauseln achten: Verzicht auf abstrakte Verweisung, Nachversicherungsgarantie (Anpassung bei Heirat/Kind), Beitragsdynamik 2–3 %/Jahr.',
      'Anonyme Risikovoranfrage über Makler stellen — verhindert dass eine Ablehnung in der Wagnisdatei landet.',
      'Bei Vertragsschluss: Lebenslange Beitrags-Garantie wählen, nicht nur die "Bruttoprämie".',
    ],
    effort: '4–6 Wochen Projekt',
    difficulty: 'Aufwändig',
    partner: 'Clark, MLP',
    priority: 2, category: 'versicherung', icon: IconHeartHandshake,
    savingsHg2: 0, savingsHg3: 0,
    condition: () => true,
  },
  {
    id: 'gebaeude-versicherung',
    title: 'Wohngebäudeversicherung optimieren',
    description: 'Eine Wohngebäudeversicherung für ein typisches Einfamilienhaus kostet 400–800 €/Jahr. Alte Verträge ohne Elementarschäden-Deckung sind 2024–2026 angesichts häufiger Unwetter ein hohes Risiko. Wechsel spart typisch 150–300 €/Jahr.',
    why: 'Gebäudeversicherung deckt das Haus selbst (Mauern, Dach, Heizung, fest verbaute Einrichtung) gegen Feuer, Sturm, Hagel, Leitungswasser, optional Elementarschäden. Wer bei Hochwasser/Starkregen nicht versichert ist, riskiert Schäden in 6-stelliger Höhe.',
    howTo: [
      'Wert 1914 ermitteln (steht auf der aktuellen Police) — alternativ Schätzung über Vergleichsrechner mit Baujahr, Wohnfläche, Ausstattung.',
      'Aktuelle Police prüfen: Sind Elementarschäden (Hochwasser, Erdrutsch, Starkregen, Schneedruck) eingeschlossen? Wenn nicht → dringend ergänzen oder wechseln.',
      'Tarifvergleich starten (Check24, Verivox) — Eingabe der Hausdaten dauert 10 Min.',
      'Selbstbeteiligung 250–500 € senkt Prämie um 15–25 %, lohnt sich bei eigener Rücklage.',
      'Kündigungsfristen beachten: 3 Monate zum Ablauf, Sonderkündigungsrecht bei Beitragserhöhung (1 Monat).',
      'Beim Wechsel: Neue Versicherung übernimmt Kündigung. Nahtloser Übergang sicherstellen — sonst Versicherungslücke.',
    ],
    effort: '30 Min einmalig',
    difficulty: 'Mittel',
    partner: 'Clark, Check24',
    priority: 2, category: 'versicherung', icon: IconBuilding,
    savingsHg2: 250, savingsHg3: 280,
    condition: (p) => p.propertyType === 'haus' && p.tenure === 'eigentum',
  },
  {
    id: 'internet-wechsel',
    title: 'Internet-Anbieter wechseln',
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
    savingsHg2: 240, savingsHg3: 240,
    condition: () => true,
  },
  {
    id: 'mobilfunk-wechsel',
    title: 'Mobilfunk-Tarif optimieren',
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
    savingsHg2: 180, savingsHg3: 180,
    condition: () => true,
  },
  {
    id: 'steuererklaerung',
    title: 'Steuererklärung einreichen',
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
    savingsHg2: 1095, savingsHg3: 1095,
    condition: () => true,
  },
  {
    id: 'kostenloses-girokonto',
    title: 'Kostenloses Girokonto',
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
    savingsHg2: 90, savingsHg3: 90,
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
      title: profile.hasChildren ? 'Versicherung & Schutz für Ihre Familie' : 'Versicherung & Schutz',
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

// ── Design Tokens ────────────────────────────────────────────────
const BLUE      = '#5782B0';
const BLUE_LT   = '#EDF2F9';
const BLUE_DK   = '#3D5A80';
const GREEN     = '#0C663B';
const GREEN_LT  = '#E8F5EF';
const ORANGE    = '#F9AA00';
const ORANGE_LT = '#FEF3C7';
const DARK      = '#2C3E50';
const BG        = '#F4F6FA';
const WHITE     = '#FFFFFF';
const BORDER    = '#E2E8F0';
const TEXT      = DARK;
const TEXT_MUTED  = '#7A8C9A';
const TEXT_DIM    = '#A0AEBB';

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

  function getStrVal(field: typeof PROFILE_FIELDS[0]) {
    const v = local[field.key];
    return v === true ? 'true' : v === false ? 'false' : String(v ?? '');
  }

  function selectOption(fieldKey: string, value: string) {
    const coerced: any = value === 'true' ? true : value === 'false' ? false : value;
    const updated = { ...local, [fieldKey]: coerced };
    setLocal(updated);
    localStorage.setItem('wpilot_mvp_profile', JSON.stringify(updated));
    onSave(updated);
    setOpenField(null);
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
    { key: 'wohnen',        title: 'Wohnsituation',  icon: IconHome,          fieldKeys: ['propertyType', 'tenure', 'heatingType'] },
    { key: 'mobilitaet',    title: 'Mobilität',      icon: IconCar,           fieldKeys: ['autoType'] },
    { key: 'finanzen',      title: 'Finanzen',       icon: IconReceipt,       fieldKeys: ['steuererklaerung', 'girokonto'] },
    { key: 'kommunikation', title: 'Kommunikation',  icon: IconWifi,          fieldKeys: ['internet', 'mobilfunk'] },
    { key: 'versicherung',  title: 'Versicherungen', icon: IconShieldCheck,   fieldKeys: ['haftpflicht', 'hausrat', 'berufsunfaehigkeit', 'gebaeude', 'kfzVersicherung'] },
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
    const FieldIcon = field.icon;
    const strVal = getStrVal(field);
    const currentOpt = field.options.find(o => o.value === strVal);
    const useButtons = field.options.length <= 3;
    const isOpen = openField === field.key;

    return (
      <div
        key={field.key}
        style={{
          background: WHITE,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: DARK,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FieldIcon size={19} stroke={1.6} color={WHITE} />
        </div>

        <div style={{
          flex: 1, minWidth: 100,
          fontSize: 13, fontWeight: 600, color: TEXT,
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
                      borderRadius: 14,
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
                            borderRadius: 10,
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
          background: 'none', border: `1.5px solid ${BORDER}`, borderRadius: 10,
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
            .mvp-profile-section-grid{display:grid !important;grid-template-columns:repeat(2, 1fr) !important;gap:10px 14px !important;}
          }
        `}</style>

        <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 18, lineHeight: 1.5 }}>
          Tippen Sie auf einen Wert, um Ihre Angabe zu ändern. Die Empfehlungen aktualisieren sich automatisch.
        </p>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {SECTIONS.map(section => {
            const sectionFields = section.fieldKeys
              .map(k => PROFILE_FIELDS.find(f => f.key === k))
              .filter(Boolean) as typeof PROFILE_FIELDS;
            const SectionIcon = section.icon;
            const isMobility = section.key === 'mobilitaet';
            if (sectionFields.length === 0 && !isMobility) return null;
            return (
              <div key={section.key}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 10,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: DARK,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <SectionIcon size={16} stroke={1.6} color={WHITE} />
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: TEXT,
                    letterSpacing: '0.01em',
                  }}>
                    {section.title}
                  </span>
                  <div style={{ flex: 1, height: 1, background: BORDER }} />
                </div>
                {isMobility ? (() => {
                  const v = local.vehicles ?? { verbrenner: 0, eauto: 0, hybrid: 0 };
                  const total = v.verbrenner + v.eauto + v.hybrid;
                  const isKeins = local.autoType === 'keins';
                  const vehicleList: { type: VehicleType; key: string }[] = [];
                  (['verbrenner', 'eauto', 'hybrid'] as const).forEach(t => {
                    for (let i = 0; i < v[t]; i++) vehicleList.push({ type: t, key: `${t}-${i}` });
                  });
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {/* Individual vehicle rows */}
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
                                background: WHITE,
                                border: `1px solid ${BORDER}`,
                                borderRadius: 14,
                                padding: '12px 14px',
                                display: 'flex', alignItems: 'center', gap: 12,
                              }}
                            >
                              <div style={{
                                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                background: DARK,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <VIcon size={19} stroke={1.6} color={WHITE} />
                              </div>
                              <div style={{
                                flex: 1, minWidth: 0,
                                fontSize: 14, fontWeight: 600, color: TEXT,
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
                                  border: `1px solid ${BORDER}`,
                                  borderRadius: 999,
                                  padding: '6px 10px',
                                  fontSize: 12, fontWeight: 600,
                                  cursor: 'pointer',
                                  fontFamily: 'inherit',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#dc2626'; (e.currentTarget as HTMLElement).style.borderColor = '#dc2626'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = TEXT_MUTED; (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
                              >
                                <IconX size={13} stroke={2} /> Entfernen
                              </button>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>

                      {/* Kein Auto status */}
                      {isKeins && total === 0 && (
                        <div style={{
                          background: WHITE,
                          border: `1px solid ${BORDER}`,
                          borderRadius: 14,
                          padding: '12px 14px',
                          display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            background: DARK,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <IconBike size={19} stroke={1.6} color={WHITE} />
                          </div>
                          <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: TEXT }}>
                            Kein Auto
                          </div>
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
                  <div className="mvp-profile-section-grid" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sectionFields.map(field => renderRow(field))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <button onClick={onBack} style={{
            background: BLUE, border: 'none', borderRadius: 12,
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

  const hg = profile?.hasChildren ? 3 : 2;
  const getSavings = (tip: MvpTip) => {
    if (done.has(tip.id) && savedAmounts[tip.id] !== undefined) return savedAmounts[tip.id];
    return hg === 3 ? tip.savingsHg3 : tip.savingsHg2;
  };

  const tips = useMemo(() => {
    if (!profile) return [];
    const base = ALL_TIPS.filter(t => {
      if (!t.condition(profile)) return false;
      // Hide tips that user already completed in Basics steps
      if (t.id === 'steuererklaerung' && profile.steuererklaerung) return false;
      if (t.id === 'kostenloses-girokonto' && profile.girokonto) return false;
      if (t.id === 'internet-wechsel' && profile.internet) return false;
      if (t.id === 'mobilfunk-wechsel' && profile.mobilfunk) return false;
      if (t.id === 'haftpflicht-versicherung' && profile.haftpflicht) return false;
      if (t.id === 'hausrat-versicherung' && profile.hausrat) return false;
      if (t.id === 'berufsunfaehigkeit-versicherung' && profile.berufsunfaehigkeit) return false;
      if (t.id === 'gebaeude-versicherung' && profile.gebaeude) return false;
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
            background: BLUE, color: WHITE, border: 'none', borderRadius: 12,
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
    <div style={{ minHeight: '100dvh', background: BG }}>
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

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)',
            borderRadius: 18, padding: '18px 20px', color: WHITE,
            position: 'relative', overflow: 'hidden',
            marginBottom: 14,
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.06)' }} />

          <style>{`
            .mvp-hero-grid{display:flex;flex-direction:column;gap:10px;position:relative;z-index:1;}
            .mvp-hero-headline{}
            .mvp-hero-stats{display:flex;gap:8px;}
            .mvp-hero-next{}
            @media(min-width:760px){
              .mvp-hero-grid{
                display:grid;
                grid-template-columns:1fr 280px;
                grid-template-rows:auto auto;
                gap:10px 16px;
                align-items:stretch;
              }
              .mvp-hero-headline{grid-column:1;grid-row:1;}
              .mvp-hero-stats{grid-column:1;grid-row:2;}
              .mvp-hero-next{grid-column:2;grid-row:1 / 3;}
            }
          `}</style>

          <div className="mvp-hero-grid">
            <div className="mvp-hero-headline">
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 4, letterSpacing: '0.05em' }}>Ihr Sparpotenzial pro Jahr</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}><AnimatedCounter value={total} /></span>
                <span style={{ fontSize: 20, fontWeight: 700, opacity: 0.8 }}>€</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{tips.length} Empfehlungen basierend auf Ihren Antworten</div>
            </div>

            <div className="mvp-hero-stats">
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '8px 12px', flex: '1 1 0' }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}><AnimatedCounter value={doneTotal} suffix=" €" /></div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>Erledigt</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '8px 12px', flex: '1 1 0' }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{doneCount}/{tips.length}</div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>Tipps erledigt</div>
              </div>
            </div>

            {/* Next best step — vertical card spanning both rows on desktop */}
            {nextBestTip && (() => {
              const NextIcon = nextBestTip.icon;
              const nextSavings = getSavings(nextBestTip);
              return (
                <button
                  className="mvp-hero-next"
                  onClick={() => setOverlayTipId(nextBestTip.id)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    borderRadius: 14,
                    padding: '12px 14px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    gap: 8, color: WHITE,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left' as const,
                    transition: 'background 0.15s, border-color 0.15s',
                    minHeight: '100%',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; }}
                >
                  <div style={{
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.1em', opacity: 0.85,
                  }}>
                    NÄCHSTER SCHRITT
                  </div>

                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(255,255,255,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <NextIcon size={20} stroke={1.5} color={WHITE} />
                  </div>

                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
                      {nextBestTip.title}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.85, marginTop: 3 }}>
                      bis zu {fmt(nextSavings)} € / Jahr
                    </div>
                  </div>

                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 12, fontWeight: 700, opacity: 0.95,
                  }}>
                    Tipp anschauen <IconArrowRight size={14} stroke={2.4} />
                  </div>
                </button>
              );
            })()}
          </div>
        </motion.div>

        {/* Profile pills */}
        <div
          onClick={() => setView('profile')}
          style={{
            background: WHITE, borderRadius: 14, padding: '12px 16px', marginBottom: 24,
            border: `1px solid ${BORDER}`, display: 'flex', gap: 8, flexWrap: 'wrap',
            cursor: 'pointer', alignItems: 'center',
          }}
        >
          {profilePills.map(p => (
            <span key={p.type} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: BLUE_LT, borderRadius: 8, padding: '5px 10px',
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

        {/* Clustered tips */}
        <div className="mvp-clusters" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
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
                          background: WHITE, borderRadius: 14,
                          border: isDone ? `2px solid ${GREEN}` : `1px solid ${BORDER}`,
                          overflow: 'hidden', opacity: isDone ? 0.6 : 1, transition: 'opacity 0.15s',
                        }}
                      >
                        <div
                          onClick={() => setExpanded(isExpanded ? null : tip.id)}
                          style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                        >
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                                            borderRadius: 10, padding: '8px 12px',
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
                          width: 28, height: 28, borderRadius: 8, border: 'none',
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
                      <div key={tip.id} style={{ background: WHITE, borderRadius: 12, border: `1px dashed ${BORDER}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.7 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: BLUE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <TipIcon size={18} stroke={1.5} color={BLUE} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{tip.title}</div>
                          <div style={{ fontSize: 11, color: TEXT_MUTED }}>{fmt(savings)} € / Jahr</div>
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 6px', borderRadius: 5, background: pri.bg, color: pri.text, flexShrink: 0 }}>{pri.label}</span>
                        <button onClick={() => restoreTip(tip.id)} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8, border: `1px solid ${GREEN}`, background: GREEN_LT, color: GREEN, cursor: 'pointer', whiteSpace: 'nowrap' }}>
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

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 12, color: TEXT_MUTED }}>
            {tips.length} Empfehlungen · {fmt(total)} € Potenzial ·{' '}
            <button onClick={() => setView('profile')} style={{ background: 'none', border: 'none', color: BLUE, fontSize: 12, fontWeight: 500, cursor: 'pointer', padding: 0 }}>
              Angaben ändern
            </button>
          </p>
        </div>
      </div>

      {/* How-to Overlay */}
      <AnimatePresence>
        {overlayTipId && (() => {
          const tip = tips.find(t => t.id === overlayTipId) || ALL_TIPS.find(t => t.id === overlayTipId.replace(/-\d+$/, ''));
          if (!tip) return null;
          const TipIcon = tip.icon;
          const ctaUrl = tip.actionUrl || tip.partnerLinks?.[0]?.url;
          return (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => setOverlayTipId(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(15,25,40,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 16, fontFamily: "'Poppins', sans-serif",
                willChange: 'opacity, backdrop-filter',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{
                  opacity: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  y:       { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 },
                  scale:   { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 },
                }}
                onClick={e => e.stopPropagation()}
                style={{
                  background: WHITE, borderRadius: 22,
                  maxWidth: 920, width: '100%', maxHeight: '92vh', overflowY: 'auto',
                  boxShadow: '0 30px 70px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.12)',
                  position: 'relative',
                  willChange: 'transform, opacity',
                  transformOrigin: 'center bottom',
                }}
              >
                {/* Close */}
                <button
                  onClick={() => setOverlayTipId(null)}
                  style={{
                    position: 'absolute', top: 14, right: 14, zIndex: 1,
                    width: 32, height: 32, borderRadius: 16,
                    border: 'none', background: '#f3f4f6', color: TEXT_MUTED,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-label="Schließen"
                >
                  <IconX size={18} stroke={2} />
                </button>

                <div style={{ padding: '40px 44px 36px' }}>
                  {/* Title + icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, paddingRight: 40 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 14,
                      background: DARK,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <TipIcon size={28} stroke={1.6} color={WHITE} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h2 style={{ fontSize: 24, fontWeight: 700, color: TEXT, lineHeight: 1.2, margin: 0 }}>
                        {tip.title}
                      </h2>
                      <div style={{ fontSize: 14, color: GREEN, fontWeight: 700, marginTop: 4 }}>
                        bis zu {fmt(hg === 3 ? tip.savingsHg3 : tip.savingsHg2)} € / Jahr
                      </div>
                    </div>
                  </div>

                  {/* Meta badges (effort + difficulty) */}
                  {(tip.effort || tip.difficulty) && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                      {tip.effort && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: BLUE_LT, color: BLUE_DK,
                          padding: '6px 12px', borderRadius: 999,
                          fontSize: 12, fontWeight: 700,
                        }}>
                          <IconClock size={13} stroke={2} /> {tip.effort}
                        </span>
                      )}
                      {tip.difficulty && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          background: tip.difficulty === 'Einfach' ? GREEN_LT
                            : tip.difficulty === 'Mittel' ? ORANGE_LT : '#fce7e7',
                          color: tip.difficulty === 'Einfach' ? GREEN
                            : tip.difficulty === 'Mittel' ? '#92400e' : '#c52828',
                          padding: '6px 12px', borderRadius: 999,
                          fontSize: 12, fontWeight: 700,
                        }}>
                          {tip.difficulty}
                        </span>
                      )}
                    </div>
                  )}

                  {tip.description && (
                    <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.65, marginBottom: 18, fontWeight: 400 }}>
                      {tip.description}
                    </p>
                  )}

                  {/* Why */}
                  {tip.why && (
                    <div style={{
                      background: '#f9fafb',
                      borderLeft: `3px solid ${BLUE}`,
                      borderRadius: 8,
                      padding: '14px 18px',
                      marginBottom: 24,
                    }}>
                      <div style={{
                        fontSize: 11, fontWeight: 700, color: BLUE,
                        letterSpacing: '0.1em', marginBottom: 6,
                      }}>
                        WARUM DAS SPART
                      </div>
                      <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.6, margin: 0 }}>
                        {tip.why}
                      </p>
                    </div>
                  )}

                  {/* How-to steps */}
                  {tip.howTo && tip.howTo.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <h3 style={{
                        fontSize: 12, fontWeight: 700, color: BLUE,
                        letterSpacing: '0.1em', margin: '0 0 16px',
                      }}>
                        SO SETZEN SIE DEN TIPP UM
                      </h3>
                      <ol style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                        {tip.howTo.map((step, i) => (
                          <li key={i} style={{
                            display: 'flex', gap: 16, marginBottom: 14, alignItems: 'flex-start',
                          }}>
                            <span style={{
                              flexShrink: 0,
                              width: 28, height: 28, borderRadius: 14,
                              background: BLUE, color: WHITE,
                              fontSize: 13, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              marginTop: 1,
                            }}>
                              {i + 1}
                            </span>
                            <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.65 }}>
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* CTA */}
                  {ctaUrl && (
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: DARK, color: WHITE,
                        borderRadius: 999, padding: '14px 24px',
                        fontSize: 14, fontWeight: 700, textDecoration: 'none',
                        width: '100%', boxSizing: 'border-box',
                      }}
                    >
                      {tip.actionLabel || 'Jetzt loslegen'}
                      <IconArrowRight size={16} stroke={2.5} />
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
