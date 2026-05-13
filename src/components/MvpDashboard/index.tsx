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
} from '@tabler/icons-react';
import logoWp from '../../assets/logo-wp.png';

// ── Types ────────────────────────────────────────────────────────
interface MvpProfile {
  tenure: 'miete' | 'eigentum' | '';
  propertyType: 'wohnung' | 'haus' | '';
  heatingType: 'gas' | 'oel' | 'strom' | 'waermepumpe' | '';
  autoType: 'verbrenner' | 'eauto' | 'hybrid' | 'keins' | 'has-vehicles' | '';
  vehicles?: { verbrenner: number; eauto: number; hybrid: number };
  hasChildren: boolean | null;
  // Spar-Präferenzen
  sparziel?: string;
  zeitaufwand?: string;
  investitionen?: string;
  // Basics
  steuererklaerung?: boolean;
  girokonto?: boolean;
  mobilfunk?: boolean;
  internet?: boolean;
  haftpflicht?: boolean;
  hausrat?: boolean;
  berufsunfaehigkeit?: boolean;
  gebaeude?: boolean;
  kfzVersicherung?: boolean;
}

interface MvpTip {
  id: string;
  title: string;
  description?: string;
  partner: string;
  partnerLinks?: { name: string; url: string; logo: string }[];
  actionLabel?: string;
  actionUrl?: string;
  howTo?: string[];
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
    howTo: [
      'Im Wechselpilot-Konto Ihren Stromzähler mit aktueller Zählernummer und Jahresverbrauch (kWh) hinterlegen.',
      'Wechselpilot vergleicht ab sofort jährlich alle Tarife in Ihrer Postleitzahl.',
      'Beim Fund eines besseren Tarifs übernimmt Wechselpilot Kündigung, Wechsel und Übergangsfristen automatisch.',
    ],
    partner: 'Octopus, Tibber, Lichtblick',
    priority: 3, category: 'energie', icon: IconBolt,
    savingsHg2: 475, savingsHg3: 475,
    condition: () => true,
  },
  {
    id: 'gas-wechsel',
    title: 'Gastarif wechseln',
    description: 'Wechselpilot prüft Ihren Gastarif automatisch jedes Jahr und wechselt für Sie zum günstigsten Anbieter — ohne dass Sie selbst aktiv werden müssen. Komplett kostenlos und ohne Aufwand.',
    actionLabel: 'Jetzt Zähler anlegen',
    actionUrl: 'https://konto.wechselpilot.com/neuer-zähler',
    howTo: [
      'Auf "Jetzt Zähler anlegen" klicken und im Wechselpilot-Konto den Gas-Zähler hinzufügen.',
      'Zählernummer und Jahresverbrauch (kWh) aus der letzten Jahresabrechnung übernehmen.',
      'Wechselpilot übernimmt ab sofort den jährlichen Tarifvergleich und Wechsel — kein weiteres Zutun nötig.',
    ],
    partner: 'Vattenfall, E.ON, EnBW',
    priority: 3, category: 'energie', icon: IconFlame,
    savingsHg2: 361, savingsHg3: 361,
    condition: () => true,
  },
  {
    id: 'thermostate',
    title: 'Smarte Thermostate',
    description: 'Smarte Thermostate heizen automatisch nur, wenn Sie zuhause sind. Das reduziert Ihre Heizkosten um bis zu 30 % — ohne dass Sie an Komfort verlieren.',
    howTo: [
      'Starter-Set für ca. 100–150 € bestellen (Bridge + Thermostate je nach Heizkörperzahl).',
      'Alte Thermostat-Köpfe abschrauben und die neuen werkzeuglos aufsetzen (ca. 5 Min pro Heizkörper).',
      'In der App Heiz-Zeitpläne anlegen oder Geofencing aktivieren — Heizung läuft nur, wenn Sie zuhause sind.',
      'Räume gezielt absenken (Bad warm, Schlafzimmer kühl) — Heizkosten sinken um 20–30 %.',
    ],
    partner: 'tado°, Homematic IP',
    priority: 3, category: 'heizung', icon: IconTemperature,
    savingsHg2: 180, savingsHg3: 220,
    condition: () => true,
  },
  {
    id: 'waermepumpe',
    title: 'Wärmepumpe',
    description: 'Eine Wärmepumpe nutzt Umweltwärme statt Gas oder Öl und ist langfristig deutlich günstiger. Bis zu 70 % Förderung vom Staat machen die Umstellung attraktiv.',
    howTo: [
      'Vor-Ort-Beratung buchen — die Dimensionierung der Wärmepumpe hängt von Wärmebedarf und Heizflächen ab.',
      'BEG-Förderung über BAFA prüfen: bis zu 70 % Zuschuss (Einkommens-Bonus + Effizienz-Bonus addiert).',
      'Zwei bis drei Festpreis-Angebote einholen — Preisspanne 18.000–35.000 € inkl. Einbau und Förderung.',
      'Auftrag erteilen — Einbau dauert meist 2–5 Werktage. Alte Heizung wird gleich mit ausgebaut.',
    ],
    partner: 'Thermondo, 1KOMMA5°',
    priority: 2, category: 'heizung', icon: IconLeaf,
    savingsHg2: 700, savingsHg3: 700,
    condition: (p) => p.tenure === 'eigentum' && p.propertyType === 'haus' && p.heatingType !== 'waermepumpe',
  },
  {
    id: 'solaranlage',
    title: 'Solaranlage',
    description: 'Eigener Solarstrom vom Dach senkt die Stromrechnung dauerhaft. Mit Speicher decken Sie bis zu 80 % Ihres Bedarfs selbst — und produzieren wetterunabhängig den günstigsten Strom.',
    howTo: [
      'Dach-Eignung prüfen: Ausrichtung Süd/Ost-West, Neigung 20–60°, möglichst keine Verschattung.',
      'Anlagengröße kalkulieren: ca. 1 kWp pro 1.000 kWh Jahresverbrauch + 50 % Reserve für E-Auto/Wärmepumpe.',
      'Drei Festpreis-Angebote vergleichen (Kauf, Finanzierung oder Pacht) — auf 25 Jahre Modul-Garantie achten.',
      'Auftrag erteilen — Installation 1–2 Tage, Anmeldung bei Netzbetreiber und Marktstammdatenregister läuft mit.',
    ],
    partner: 'Enpal, Zolar',
    priority: 2, category: 'solar', icon: IconSun,
    savingsHg2: 300, savingsHg3: 300,
    condition: (p) => p.tenure === 'eigentum' && p.propertyType === 'haus',
  },
  {
    id: 'balkonkraftwerk',
    title: 'Balkonkraftwerk',
    description: 'Eine Mini-Solaranlage am Balkon kostet wenig, ist einfach zu installieren und produziert kostenlosen Strom für Ihren Haushalt — auch in Mietwohnungen erlaubt.',
    howTo: [
      'Mieter: kurze Info an Vermieter — seit 2024 in der Regel nicht mehr genehmigungspflichtig.',
      '800-Watt-Komplettset (2 Module + Wechselrichter) bestellen — Preis ca. 400–700 €.',
      'Montage: Module am Balkongeländer befestigen, Wechselrichter anschließen, Schuko-Stecker in die Steckdose.',
      'Im Marktstammdatenregister online anmelden — dauert 5 Minuten, ist Pflicht.',
      'Amortisation: 4–6 Jahre, danach 15+ Jahre kostenloser Strom.',
    ],
    partner: 'Yuma, Priwatt',
    priority: 2, category: 'solar', icon: IconSun,
    savingsHg2: 180, savingsHg3: 200,
    condition: (p) => !(p.tenure === 'eigentum' && p.propertyType === 'haus'),
  },
  {
    id: 'kfz-versicherung',
    title: 'KFZ-Versicherung wechseln',
    description: 'KFZ-Tarife unterscheiden sich oft um mehrere hundert Euro. Ein Vergleich dauert nur Minuten und der Wechsel zum 1. Januar ist unkompliziert.',
    howTo: [
      'Aktuelle Jahresprämie und Vertragsende prüfen (steht auf der Rechnung) — Standard-Kündigungsfrist ist 30. November.',
      'Online-Tarifvergleich in ca. 5 Minuten durchführen — Fahrzeugschein und Schadenfreiheitsklasse bereithalten.',
      'Bei besserem Angebot: aktuelle Versicherung schriftlich kündigen und neuen Vertrag zum 1. Januar abschließen.',
      'Schadenfreiheitsklasse wird automatisch vom alten Versicherer übertragen.',
    ],
    partner: 'Clark, Tarifcheck, HUK24',
    priority: 3, category: 'mobilitaet', icon: IconCar,
    savingsHg2: 800, savingsHg3: 800,
    condition: (p) => p.autoType !== 'keins' && p.autoType !== '',
  },
  {
    id: 'thg-praemie',
    title: 'THG-Prämie',
    description: 'Als E-Auto-Fahrer haben Sie Anspruch auf die staatliche THG-Prämie — einfach online beantragen und das Geld jährlich kassieren.',
    howTo: [
      'THG-Quoten-Vermittler mit Festpreis-Garantie wählen — Auszahlung 2025 liegt bei ca. 70–110 € je E-Auto.',
      'Fahrzeugschein-Foto (Vorder- und Rückseite) und IBAN online hochladen — dauert ca. 2 Minuten.',
      'Vermittler reicht die Quote beim Umweltbundesamt ein. Auszahlung erfolgt nach 6–10 Wochen aufs Konto.',
      'Antrag jedes Kalenderjahr erneut stellen — viele Vermittler erinnern automatisch.',
    ],
    partner: 'Geld für eAuto',
    priority: 1, category: 'mobilitaet', icon: IconBatteryCharging,
    savingsHg2: 630, savingsHg3: 630,
    condition: (p) => (p.vehicles?.eauto ?? 0) > 0 || p.autoType === 'eauto',
  },
  {
    id: 'wallbox',
    title: 'Wallbox / Laden zuhause',
    description: 'Mit einer Wallbox laden Sie zuhause deutlich günstiger und schneller als an öffentlichen Säulen. In Kombination mit Solarstrom maximieren Sie die Ersparnis.',
    howTo: [
      '11 kW Wallbox auswählen — genehmigungsfrei beim Netzbetreiber, ab 22 kW genehmigungspflichtig.',
      'Elektriker für Anschluss buchen (eigene Leitung mit FI Typ B notwendig) — Materialpreis ca. 600–1.000 €.',
      'Wallbox anmelden beim Netzbetreiber (Pflicht, online in ca. 5 Min möglich).',
      'Mit PV-Anlage koppeln: Überschussladen aktivieren — lädt nur, wenn Solarstrom übrig ist.',
    ],
    partner: 'Enpal, charge.cloud',
    priority: 1, category: 'mobilitaet', icon: IconBatteryCharging,
    savingsHg2: 280, savingsHg3: 280,
    condition: (p) => (p.vehicles?.hybrid ?? 0) > 0 || (p.vehicles?.eauto ?? 0) > 0 || p.autoType === 'hybrid',
  },
  {
    id: 'haftpflicht-versicherung',
    title: 'Privathaftpflicht abschließen',
    description: 'Die Privathaftpflicht schützt vor existenzbedrohenden Schadensersatzforderungen — bereits ab wenigen Euro pro Monat. Praktisch unverzichtbar für jeden Haushalt.',
    howTo: [
      'Deckungssumme von mindestens 10 Mio. € wählen — höher kostet kaum mehr und sichert auch Großschäden ab.',
      'Familientarif wählen, falls Partner oder Kinder mit abgesichert werden sollen.',
      'Auf Forderungsausfalldeckung und mindestens 6 Monate rückwirkenden Schutz für unverschuldete Schäden achten.',
      'Online-Abschluss in ca. 5 Min — Versicherungsschutz beginnt am selben Tag.',
    ],
    partner: 'Clark, Check24',
    priority: 3, category: 'versicherung', icon: IconShieldCheck,
    savingsHg2: 80, savingsHg3: 80,
    condition: () => true,
  },
  {
    id: 'hausrat-versicherung',
    title: 'Hausratversicherung optimieren',
    description: 'Veraltete Hausrat-Tarife kosten unnötig Geld. Ein Vergleich zeigt schnell, ob Sie bei gleicher Leistung günstigere Anbieter finden.',
    howTo: [
      'Versicherungssumme berechnen: Faustregel ca. 650 € pro qm Wohnfläche (Standard-Ausstattung) bzw. höher bei wertvollerer Einrichtung.',
      'Tarifvergleich online starten — auf Elementarschäden (Hochwasser, Starkregen) und Fahrraddiebstahl-Klausel achten.',
      'Mindestens 5 Mio. € Deckung bei Hausrat + Glasversicherung wählen, falls relevant.',
      'Kündigung erfolgt zum nächsten Ablaufdatum (3 Monate Frist) oder per Sonderkündigung nach Beitragserhöhung.',
    ],
    partner: 'Clark, Check24',
    priority: 2, category: 'versicherung', icon: IconHomeShield,
    savingsHg2: 120, savingsHg3: 120,
    condition: () => true,
  },
  {
    id: 'berufsunfaehigkeit-versicherung',
    title: 'Berufsunfähigkeitsversicherung',
    description: 'Eine BU-Versicherung sichert Ihr Einkommen ab, falls Sie durch Krankheit oder Unfall nicht mehr arbeiten können — eine der wichtigsten Absicherungen überhaupt.',
    howTo: [
      'Beratungstermin mit einem unabhängigen Makler vereinbaren — BU ist beratungsintensiv, falsche Angaben führen zur Leistungsverweigerung.',
      'Gesundheitsfragen ehrlich und vollständig beantworten — Behandlungen, Diagnosen, Therapien der letzten 5–10 Jahre.',
      'Vertrag mit Verzicht auf abstrakte Verweisung und mindestens 60–70 % des Nettoeinkommens als BU-Rente wählen.',
      'Je jünger und gesünder, desto günstiger — Abschluss vor 30 spart oft 30–50 % Beitrag.',
    ],
    partner: 'Clark, MLP',
    priority: 2, category: 'versicherung', icon: IconHeartHandshake,
    savingsHg2: 0, savingsHg3: 0,
    condition: () => true,
  },
  {
    id: 'gebaeude-versicherung',
    title: 'Wohngebäudeversicherung optimieren',
    description: 'Eine Wohngebäudeversicherung ist für Hauseigentümer Pflicht. Ein Tarifvergleich spart oft mehrere hundert Euro pro Jahr — bei gleicher Absicherung.',
    howTo: [
      'Wert 1914 ermitteln — aus alter Police oder Bauunterlagen (Wohnfläche × ca. 800 ist als grobe Schätzung möglich).',
      'Tarifvergleich starten — auf Einschluss von Elementarschäden (Hochwasser, Erdrutsch, Starkregen) achten.',
      'Selbstbeteiligung von 250–500 € senkt die Prämie spürbar — empfehlenswert bei eigener Rücklage.',
      'Wechsel: zum Ablaufdatum (3 Monate Frist) oder per Sonderkündigung nach Beitragserhöhung.',
    ],
    partner: 'Clark, Check24',
    priority: 2, category: 'versicherung', icon: IconBuilding,
    savingsHg2: 280, savingsHg3: 280,
    condition: (p) => p.propertyType === 'haus' && p.tenure === 'eigentum',
  },
  {
    id: 'internet-wechsel',
    title: 'Internet-Anbieter wechseln',
    description: 'Stammkunden zahlen oft deutlich mehr als Neukunden. Mit einem Anbieterwechsel oder einem Anruf beim aktuellen Anbieter senken Sie monatlich Ihre Internetkosten.',
    howTo: [
      'Vertragsende und Kündigungsfrist prüfen — meist 3 Monate vor Ablauf der Mindestlaufzeit.',
      'Tarifvergleich nach Postleitzahl starten — Bandbreite, Mindestlaufzeit und Neukunden-Rabatt vergleichen.',
      'Wechselservice nutzen: der neue Anbieter übernimmt Kündigung und Anschlussschaltung automatisch.',
      'Alternative ohne Wechsel: bei aktuellem Anbieter Bestandskunden-Hotline anrufen und Neukunden-Tarif verhandeln — spart oft 30–40 %.',
    ],
    partner: 'Verivox, Check24',
    priority: 2, category: 'kommunikation', icon: IconWifi,
    savingsHg2: 240, savingsHg3: 240,
    condition: () => true,
  },
  {
    id: 'mobilfunk-wechsel',
    title: 'Mobilfunk-Tarif optimieren',
    description: 'Mobilfunkanbieter bieten Neukunden meist deutlich günstigere Konditionen. Tarifvergleich oder Nachverhandeln reduziert Ihre Handykosten spürbar.',
    howTo: [
      'Tatsächlichen Datenverbrauch der letzten 3 Monate in der App prüfen — meist deutlich unter dem gebuchten Volumen.',
      'Tarifvergleich starten — passendes Datenvolumen + benötigte Features (5G, EU-Roaming, ggf. Allnet-Flat).',
      'Rufnummer-Mitnahme im neuen Vertrag aktivieren — alter Vertrag wird automatisch zum Vertragsende gekündigt.',
      'Alternative: bei Bestandsanbieter Kündigungs-Hotline anrufen und Rabatt fordern — spart oft 30–50 % ohne Wechsel.',
    ],
    partner: 'Check24, Verivox',
    priority: 2, category: 'kommunikation', icon: IconDeviceMobile,
    savingsHg2: 180, savingsHg3: 180,
    condition: () => true,
  },
  {
    id: 'steuererklaerung',
    title: 'Steuererklärung einreichen',
    description: 'Mit einer Steuer-App geht es ganz einfach — auch ohne Steuerwissen. Antworten auf Fragen geben, fertig. Durchschnittliche Rückerstattung: über 1.000 €.',
    howTo: [
      'Unterlagen sammeln: Lohnsteuerbescheinigung, Krankenversicherungs-Beitrag, Quittungen für Werbungskosten, Spendenbelege.',
      'Steuer-App öffnen — Fragen Schritt für Schritt beantworten, ca. 30–60 Minuten.',
      'Vorberechnete Rückerstattung in der App ansehen — falls positiv, einreichen (digitale ELSTER-Signatur läuft automatisch).',
      'Bescheid kommt in 4–10 Wochen — Rückerstattung wird auf das Konto überwiesen.',
    ],
    partner: 'Taxfix, WISO, Zasta',
    partnerLinks: [
      { name: 'Taxfix', url: 'https://taxfix.de',           logo: '/apps/wpilot-home/assets/partners/taxfix.png' },
      { name: 'WISO',   url: 'https://www.wiso-steuer.de',  logo: '/apps/wpilot-home/assets/partners/wiso.png' },
      { name: 'Zasta',  url: 'https://www.zasta.de',        logo: '/apps/wpilot-home/assets/partners/zasta.png' },
    ],
    priority: 3, category: 'finanzen', icon: IconReceipt,
    savingsHg2: 1095, savingsHg3: 1095,
    condition: () => true,
  },
  {
    id: 'kostenloses-girokonto',
    title: 'Kostenloses Girokonto',
    description: 'Viele Banken berechnen 5–10 € Kontoführungsgebühren pro Monat. Ein kostenloses Girokonto bei einer Direktbank spart diese Gebühren komplett — bei gleicher Funktionalität.',
    howTo: [
      'Auf wirklich kostenlose Konditionen achten: keine Kontoführungsgebühr, kein Mindestgeldeingang, kostenlose Girocard.',
      'Online-Eröffnung per Video-Ident — Ausweis bereithalten, Dauer ca. 15 Minuten.',
      'Kontoumzugs-Service nutzen — alle Lastschriften und Daueraufträge werden automatisch übertragen.',
      'Altes Konto erst kündigen, wenn alle Zahlungen 1–2 Monate sauber auf dem neuen Konto laufen.',
    ],
    partner: 'ING, DKB',
    priority: 1, category: 'finanzen', icon: IconPig,
    savingsHg2: 120, savingsHg3: 120,
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
const BG        = '#F5F6F8';
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
  useEffect(() => {
    const duration = 1200;
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
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
    const isOpen = openField === field.key;
    const FieldIcon = field.icon;
    const strVal = getStrVal(field);
    const currentOpt = field.options.find(o => o.value === strVal);
    const CurrentIcon = currentOpt?.icon ?? IconCircle;

    return (
      <div
        key={field.key}
        style={{
          background: WHITE,
          border: isOpen ? `2px solid ${BLUE}` : `1px solid ${BORDER}`,
          borderRadius: 14,
          overflow: 'hidden',
          transition: 'border-color 0.2s',
        }}
      >
        <div
          style={{
            padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
            userSelect: 'none',
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: BLUE_LT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FieldIcon size={19} stroke={1.5} color={BLUE} />
          </div>
          <div style={{
            flex: 1, minWidth: 0,
            fontSize: 13, fontWeight: 600, color: TEXT,
          }}>
            {field.label}
          </div>
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
              flexShrink: 0,
              maxWidth: '60%',
            }}
          >
            <CurrentIcon size={14} stroke={1.8} color={isOpen ? WHITE : BLUE} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="options"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                padding: '12px',
                borderTop: `1px solid ${BORDER}`,
                display: 'flex', flexDirection: 'column', gap: 7,
              }}>
                {field.options.map(opt => {
                  const isSelected = strVal === opt.value;
                  const OptIcon = opt.icon;
                  return (
                    <motion.button
                      key={opt.value}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => selectOption(field.key, opt.value)}
                      style={{
                        width: '100%',
                        background: isSelected ? BLUE_LT : '#f9fafb',
                        border: isSelected ? `2px solid ${BLUE}` : `1.5px solid ${BORDER}`,
                        borderRadius: 10, padding: '11px 14px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        cursor: 'pointer', transition: 'all 0.12s',
                        textAlign: 'left' as const,
                      }}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                        background: isSelected ? BLUE : WHITE,
                        border: isSelected ? 'none' : `1px solid ${BORDER}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.12s',
                      }}>
                        <OptIcon size={18} stroke={1.5} color={isSelected ? WHITE : TEXT_MUTED} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: isSelected ? BLUE_DK : TEXT, flex: 1 }}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <div style={{
                          width: 22, height: 22, borderRadius: 11, background: BLUE, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <IconCheck size={14} stroke={2.5} color={WHITE} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(243,243,245,0.95)', backdropFilter: 'blur(12px)',
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

        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'linear-gradient(135deg, #243c47 0%, #3D5A80 100%)',
            color: WHITE, borderRadius: 18, padding: '22px 22px',
            display: 'flex', alignItems: 'center', gap: 18,
            marginBottom: 22,
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 6px 20px rgba(36,60,71,0.18)',
          }}
        >
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 140, height: 140, borderRadius: 70,
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'rgba(255,255,255,0.16)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, zIndex: 1,
          }}>
            <IconUser size={30} stroke={1.5} color={WHITE} />
          </div>
          <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
              opacity: 0.7, marginBottom: 4,
            }}>
              IHR PROFIL
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, margin: '0 0 6px' }}>
              {summaryParts.length > 0 ? summaryParts[0] : 'Ihre Angaben'}
            </h2>
            {summaryParts.length > 1 && (
              <p style={{ fontSize: 12, opacity: 0.8, margin: 0, lineHeight: 1.4 }}>
                {summaryParts.slice(1).join(' · ')}
              </p>
            )}
          </div>
        </motion.div>

        <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 18, lineHeight: 1.5 }}>
          Tippen Sie auf einen Wert, um Ihre Angabe zu ändern. Die Empfehlungen aktualisieren sich automatisch.
        </p>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {SECTIONS.map(section => {
            const sectionFields = section.fieldKeys
              .map(k => PROFILE_FIELDS.find(f => f.key === k))
              .filter(Boolean) as typeof PROFILE_FIELDS;
            if (sectionFields.length === 0) return null;
            const SectionIcon = section.icon;
            return (
              <div key={section.key}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 10,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: BLUE_LT,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <SectionIcon size={16} stroke={1.5} color={BLUE} />
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: TEXT,
                    letterSpacing: '0.01em',
                  }}>
                    {section.title}
                  </span>
                  <div style={{ flex: 1, height: 1, background: BORDER }} />
                </div>
                <div className="mvp-profile-section-grid" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sectionFields.map(field => renderRow(field))}
                </div>
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
    case 'auto':     return value === 'eauto' ? <IconBatteryCharging {...p} /> : value === 'hybrid' ? <IconPlug {...p} /> : value === 'verbrenner' ? <IconCar {...p} /> : <IconBike {...p} />;
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

  useEffect(() => {
    if (initialProfile) return;
    try {
      const raw = localStorage.getItem('wpilot_mvp_profile');
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem('wpilot_mvp_done',    JSON.stringify([...done]));    }, [done]);
  useEffect(() => { localStorage.setItem('wpilot_mvp_removed', JSON.stringify([...removed])); }, [removed]);

  const hg = profile?.hasChildren ? 3 : 2;
  const getSavings = (tip: MvpTip) => hg === 3 ? tip.savingsHg3 : tip.savingsHg2;

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
  const total     = useMemo(() => tips.reduce((s, t) => s + getSavings(t), 0), [tips, hg]);
  const doneCount = useMemo(() => tips.filter(t => done.has(t.id)).length, [tips, done]);
  const doneTotal = useMemo(() => tips.filter(t => done.has(t.id)).reduce((s, t) => s + getSavings(t), 0), [tips, done, hg]);
  const nextBestTip = useMemo(() => {
    const open = tips.filter(t => !done.has(t.id));
    if (open.length === 0) return null;
    return open.slice().sort((a, b) => getSavings(b) - getSavings(a))[0];
  }, [tips, done, hg]);

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
        background: 'rgba(243,243,245,0.95)', backdropFilter: 'blur(12px)',
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
            .mvp-clusters{display:block !important;column-count:2 !important;column-gap:28px !important;}
            .mvp-clusters > div{break-inside:avoid;-webkit-column-break-inside:avoid;page-break-inside:avoid;margin-bottom:20px !important;}
          }
        `}</style>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)',
            borderRadius: 18, padding: '24px 20px', color: WHITE,
            position: 'relative', overflow: 'hidden',
            marginBottom: 14,
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.06)' }} />

          <style>{`
            .mvp-hero-grid{display:flex;flex-direction:column;gap:16px;position:relative;z-index:1;}
            @media(min-width:760px){
              .mvp-hero-grid{flex-direction:row;align-items:stretch;}
              .mvp-hero-main{flex:1;min-width:0;}
              .mvp-hero-next{flex:0 0 320px;}
            }
          `}</style>

          <div className="mvp-hero-grid">
            <div className="mvp-hero-main">
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 8, letterSpacing: '0.05em' }}>Ihr Sparpotenzial pro Jahr</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}><AnimatedCounter value={total} /></span>
                <span style={{ fontSize: 20, fontWeight: 700, opacity: 0.8 }}>€</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16 }}>{tips.length} Empfehlungen basierend auf Ihren Antworten</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px', flex: '1 1 0' }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}><AnimatedCounter value={doneTotal} suffix=" €" /></div>
                  <div style={{ fontSize: 10, opacity: 0.8 }}>Erledigt</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px', flex: '1 1 0' }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{doneCount}/{tips.length}</div>
                  <div style={{ fontSize: 10, opacity: 0.8 }}>Tipps erledigt</div>
                </div>
              </div>
            </div>

            {/* Next best step — sits top-right inside hero, glass style */}
            {nextBestTip && (() => {
              const NextIcon = nextBestTip.icon;
              const nextSavings = getSavings(nextBestTip);
              return (
                <button
                  className="mvp-hero-next"
                  onClick={() => setOverlayTipId(nextBestTip.id)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 14,
                    padding: '14px 16px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    gap: 10, color: WHITE,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left' as const,
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; }}
                >
                  <div style={{
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.1em', opacity: 0.85,
                  }}>
                    EMPFOHLENER NÄCHSTER SCHRITT
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <NextIcon size={20} stroke={1.6} color={WHITE} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25 }}>
                        {nextBestTip.title}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                        bis zu {fmt(nextSavings)} € / Jahr
                      </div>
                    </div>
                    <IconArrowRight size={18} stroke={2.2} color={WHITE} style={{ flexShrink: 0, opacity: 0.85 }} />
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cluster.tips.map((tip, i) => {
                  const isDone = done.has(tip.id);
                  const isExpanded = expanded === tip.id;
                  const TipIcon = tip.icon;
                  const savings = getSavings(tip);
                  return (
                    <div key={tip.id} style={{ position: 'relative' }}>
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
                          style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                        >
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: BLUE_LT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <TipIcon size={22} stroke={1.5} color={BLUE} />
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
                                {tip.partner && !tip.actionUrl && (
                                  <p style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 12, fontWeight: 500 }}>
                                    Empfohlene Partner: {tip.partner}
                                  </p>
                                )}
                                {tip.partnerLinks && tip.partnerLinks.length > 0 && (
                                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                                    {tip.partnerLinks.map(pl => (
                                      <a key={pl.name} href={pl.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10,
                                        padding: '6px 12px', textDecoration: 'none',
                                      }}>
                                        <img src={pl.logo} alt={pl.name} height={20} style={{ objectFit: 'contain' }} />
                                      </a>
                                    ))}
                                  </div>
                                )}

                                {tip.id !== 'strom-wechsel' && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                                    <button
                                      onClick={e => { e.stopPropagation(); toggleDone(tip.id); setExpanded(null); }}
                                      style={{
                                        flexShrink: 0,
                                        background: isDone ? GREEN_LT : '#eef0f3',
                                        color: isDone ? GREEN : TEXT,
                                        border: 'none',
                                        borderRadius: 999, padding: '10px 16px',
                                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        fontFamily: 'inherit',
                                      }}
                                    >
                                      {isDone ? <><IconCheck size={14} stroke={2.5} /> Erledigt</> : 'Erledigt'}
                                    </button>
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
                                )}
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
                  background: WHITE, borderRadius: 20,
                  maxWidth: 760, width: '100%', maxHeight: '92vh', overflowY: 'auto',
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

                <div style={{ padding: '36px 36px 32px' }}>
                  {/* Title + icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, paddingRight: 36 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: BLUE_LT,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <TipIcon size={28} stroke={1.5} color={BLUE} />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT, lineHeight: 1.25, margin: 0 }}>
                      {tip.title}
                    </h2>
                  </div>

                  {tip.description && (
                    <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24 }}>
                      {tip.description}
                    </p>
                  )}

                  {/* How-to steps */}
                  {tip.howTo && tip.howTo.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <h3 style={{
                        fontSize: 12, fontWeight: 700, color: BLUE,
                        letterSpacing: '0.1em', margin: '0 0 14px',
                      }}>
                        SO SETZEN SIE DEN TIPP UM
                      </h3>
                      <ol style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                        {tip.howTo.map((step, i) => (
                          <li key={i} style={{
                            display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start',
                          }}>
                            <span style={{
                              flexShrink: 0,
                              width: 26, height: 26, borderRadius: 13,
                              background: BLUE, color: WHITE,
                              fontSize: 13, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              marginTop: 1,
                            }}>
                              {i + 1}
                            </span>
                            <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.6 }}>
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
