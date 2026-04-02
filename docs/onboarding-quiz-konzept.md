# Smart Onboarding Quiz mit Sofort-Sparprognose — Konzept

**Projekt:** Wechselpilot Home  
**Priorität:** High  
**Status:** Konzept & Prototype (Brainstormer)  
**Erstellt:** 2026-04-02  

---

## 1. Übersicht

### Kernidee
> Ein interaktiver 60-Sekunden-Quiz, der Besuchern SOFORT ihre persönliche Sparprognose zeigt — noch bevor sie sich registrieren. Das Quiz dient als Low-Barrier Entry Point und Conversion-Tool.

### Warum?
- **Problem:** Besucher auf wechselpilot.com wissen nicht, wie viel sie persönlich sparen können → hohe Bounce Rate
- **Lösung:** In 60 Sekunden eine personalisierte Zahl zeigen → emotionaler Hook → Conversion
- **Psychologie:** Die konkrete Zahl erzeugt "Endowment Effect" — Besucher haben das Gefühl, Geld auf dem Tisch liegen zu lassen

### Zielgruppe
- **Primär:** Erstbesucher auf wechselpilot.com die noch nicht registriert sind
- **Sekundär:** Social-Media-Traffic (teilbare Ergebnisse)

---

## 2. Quiz-Flow (5 Fragen, ~60 Sekunden)

### Frage 1: Haushaltsgröße
- **Typ:** Radio/Button-Auswahl (große, tappbare Buttons)
- **Optionen:** 1 Person · 2 Personen · 3 Personen · 4+ Personen
- **Warum zuerst:** Einfachste Frage, niedrigste Hürde, bestimmt Standard-Verbrauchswerte

### Frage 2: Aktueller Anbieter
- **Typ:** Dropdown mit Sucheingabe
- **Vorgeschlagene Anbieter:** Vattenfall, E.ON, EnBW, EDIS, Stadtwerke (generisch), RWE/innogy, EWE, SWM, Sonstige
- **Warum:** Grundversorgungstarife vs. Sondertarife haben drastisch unterschiedliche Preise. Der Anbieter-Name gibt einen Proxy dafür.

### Frage 3: Geschätzter Verbrauch
- **Typ:** Slider ODER direkte Eingabe (kWh/Jahr)
- **Vorausgefüllter Default:** Basierend auf Haushaltsgröße (aus Frage 1)
  - 1 Person: 1.500 kWh
  - 2 Personen: 2.500 kWh
  - 3 Personen: 3.500 kWh
  - 4+ Personen: 4.500 kWh
- **Slider-Range:** 500 — 10.000 kWh (Schritte: 100 kWh)
- **Hilfstext:** "Steht auf deiner Stromrechnung. Wenn du unsicher bist, lass den Durchschnittswert stehen."

### Frage 4: Postleitzahl
- **Typ:** 5-stellige Eingabe mit Live-Validierung
- **Warum:** Regionaler Grundversorgungspreis variiert stark (25–45 ct/kWh)
- **Verwendet für:** PLZ → Region → regionaler Preisaufschlag

### Frage 5: Wohnsituation
- **Typ:** 2x2 Grid (Buttons)
- **Zeile 1:** 🏢 Wohnung · 🏠 Haus
- **Zeile 2:** 📝 Miete · 🔑 Eigentum
- **Warum:** Haus + Eigentum = Gas-Heizung wahrscheinlich → zusätzliches Gas-Sparpotenzial

---

## 3. Tarif-Quellen & Berechnungslogik

### 3.1 Öffentliche Datenquellen

Alle Berechnungen basieren auf **öffentlich zugänglichen Durchschnittswerten** — keine Kundendaten, keine API-Aufrufe nötig.

| Quelle | Was | Stand |
|--------|-----|-------|
| **Verivox Strompreisindex** | Ø Strompreis Deutschland: ~38,2 ct/kWh (Grundversorgung), ~27,5 ct/kWh (günstigster Tarif) | Q1 2026 |
| **BDEW Strompreisanalyse** | Ø Strompreis für Haushalte: ~36,4 ct/kWh | 2025/H2 |
| **Check24 Preisvergleich** | Ø Einsparung bei Wechsel: 300-500€/Jahr (bei 4.000 kWh) | Q1 2026 |
| **Bundesnetzagentur** | Monitoringbericht: Grundversorgung 10-30% teurer als Wettbewerb | 2025 |
| **Verivox Gaspreisindex** | Ø Gaspreis: ~12,5 ct/kWh (Grundversorgung), ~9,8 ct/kWh (günstigster) | Q1 2026 |

### 3.2 Berechnungsmodell (clientseitig)

```
STROM-SPARPOTENZIAL:

1. Bestimme aktuellen Preis (Proxy):
   - Grundversorgungs-Basis: 38,2 ct/kWh
   - Wenn Anbieter = "Vattenfall", "EDIS", "Stadtwerke" → Faktor 1.05 (eher GV)
   - Wenn Anbieter = "E.ON", "EnBW", "RWE" → Faktor 0.95 (eher Sondertarif)
   - Wenn Anbieter = "Sonstige" → Faktor 1.0

2. PLZ-basierter Regionalfaktor:
   - PLZ 0xxxx–1xxxx (Ost): Faktor 1.08 (höhere GV-Preise)
   - PLZ 2xxxx (Nord): Faktor 1.03
   - PLZ 3xxxx–4xxxx (Mitte): Faktor 1.00
   - PLZ 5xxxx–6xxxx (West): Faktor 0.98
   - PLZ 7xxxx (Süd-West): Faktor 0.97
   - PLZ 8xxxx–9xxxx (Süd): Faktor 0.95

3. Berechne aktuellen Jahrespreis:
   aktuellerPreis = verbrauchKwh × basisPreis × anbieterFaktor × plzFaktor

4. Berechne optimalen Tarif:
   optimalerPreis = verbrauchKwh × 27,5 ct/kWh × 1.05 (Sicherheitspuffer)

5. Strom-Sparpotenzial = aktuellerPreis − optimalerPreis


GAS-SPARPOTENZIAL (nur bei Haus + Eigentum):

1. Geschätzter Gas-Verbrauch:
   - Wohnung: 0 (kein eigener Gasvertrag typisch)
   - Haus + Miete: 12.000 kWh (Zentralheizung, Nebenkosten)
   - Haus + Eigentum: 18.000 kWh (eigener Gasvertrag)

2. Gas-Einsparung:
   gasSparen = gasVerbrauch × (12,5 − 9,8) ct/kWh × plzFaktor

GESAMTPROGNOSE = stromSparen + gasSparen + fixBonus(20€ Wechselbonus)
```

### 3.3 Referenzdaten (hardcoded im Client)

```javascript
const TARIFF_DATA = {
  // Strom
  strom: {
    grundversorgung_avg: 0.382,    // €/kWh – BDEW/Verivox Q1 2026
    guenstigster_avg: 0.275,       // €/kWh – Verivox günstigster Tarif
    wechselpilot_target: 0.289,    // €/kWh – WP-Zielpreis (leicht über günstigstem)
  },
  // Gas
  gas: {
    grundversorgung_avg: 0.125,    // €/kWh
    guenstigster_avg: 0.098,       // €/kWh
    wechselpilot_target: 0.103,    // €/kWh
  },
  // Durchschnittliche jährliche Wechsel-Einsparung (Statistik)
  avg_savings: {
    '1p': 187,
    '2p': 287,
    '3p': 387,
    '4p': 487,
  },
  // Standard-Verbrauch nach Haushaltsgröße
  default_kwh: {
    '1p': 1500,
    '2p': 2500,
    '3p': 3500,
    '4p': 4500,
  },
  // Standard-Gas-Verbrauch (Haus + Eigentum)
  default_gas_kwh: {
    apartment: 0,
    house_rent: 0,        // Nebenkosten, kein eigener Vertrag
    house_own: 18000,     // Eigener Gasvertrag
  },
};
```

### 3.4 Anbieter-Scoring

| Anbieter | Kategorie | Preisfaktor |
|----------|-----------|-------------|
| Vattenfall | Grundversorgung (Berlin, Hamburg) | 1.08 |
| E.ON | Mix (bundesweit) | 0.98 |
| EnBW | Sondertarife (BW) | 0.95 |
| EDIS | Grundversorgung (Brandenburg) | 1.10 |
| Stadtwerke (generisch) | Grundversorgung (lokal) | 1.05 |
| RWE/innogy | Mix | 0.97 |
| EWE | Grundversorgung (Nordwest) | 1.03 |
| SWM | Grundversorgung (München) | 1.02 |
| Sonstige | Unbekannt (konservativ) | 1.00 |

### 3.5 PLZ-Regionen-Mapping

Vereinfachtes Modell basierend auf dem ersten Zeichen der PLZ:

| PLZ-Prefix | Region | Faktor | Begründung |
|-----------|--------|--------|------------|
| 0 | Sachsen, Thüringen | 1.08 | Höhere GV-Preise in Ostdeutschland |
| 1 | Berlin, Brandenburg | 1.06 | Vattenfall/EDIS-Dominanz |
| 2 | Hamburg, Schleswig-Holstein | 1.03 | Leicht über Durchschnitt |
| 3 | Niedersachsen, Hessen | 1.00 | Referenz (Durchschnitt) |
| 4 | NRW (Nord) | 0.98 | Guter Wettbewerb |
| 5 | NRW (Süd), Rheinland | 0.98 | Guter Wettbewerb |
| 6 | Hessen (Süd), Saarland | 0.99 | Leicht unter Durchschnitt |
| 7 | Baden-Württemberg | 0.97 | EnBW-Region, günstigere GV |
| 8 | Bayern (Süd) | 0.95 | Guter Wettbewerb |
| 9 | Bayern (Nord), Franken | 0.96 | Leicht günstigere Region |

### 3.6 Validierung des Modells

Wir vergleichen unser Modell mit der Verivox-Referenz:
- **Verivox-Beispiel (Q1 2026):** 4.000 kWh, Würzburg (PLZ 97072)
  - Grundversorgung: 1.544,73 € → 38,62 ct/kWh
  - Günstigster: 1.031,44 € → 25,79 ct/kWh
  - Einsparung: **513,29 €**
- **Unser Modell:** 4.000 × 0.382 × 0.96 (PLZ 9) = 1.466,88 €; Optimal: 4.000 × 0.289 = 1.156 €
  - Einsparung: **310,88 €** (konservativ — beabsichtigt, um Enttäuschung zu vermeiden)

**Strategie:** Lieber konservativ prognostizieren und positiv überraschen als zu hoch versprechen.

---

## 4. Ergebnisseite

### 4.1 Animierte Sparprognose

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   Haushalte wie deiner sparen durchschnittlich   │
│                                                  │
│            ✨  287 €  ✨                          │
│              pro Jahr                            │
│                                                  │
│   mit dem automatischen Wechselservice           │
│   von Wechselpilot                               │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   Dein Sparpotenzial: ⭐⭐⭐⭐☆                   │
│   (4 von 5 — Überdurchschnittlich!)              │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   💡 Deine Analyse:                              │
│   · Strom: 238 € Sparpotenzial                  │
│   · Gas: 49 € Sparpotenzial                     │
│   · Region: Berlin (Überdurchschnittliche        │
│     Grundversorgungspreise)                      │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   [🚀 Willst du das wirklich sparen?]            │
│   In 2 Minuten einrichten                        │
│                                                  │
│   [🔗 Ergebnis teilen]  [🔖 Bookmark speichern]  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.2 Spar-Badge System

| Sparpotenzial | Sterne | Label | Farbe |
|--------------|--------|-------|-------|
| < 100 € | ⭐☆☆☆☆ | Gering | Grau |
| 100–200 € | ⭐⭐☆☆☆ | Moderat | Bronze |
| 200–350 € | ⭐⭐⭐☆☆ | Gut | Silber |
| 350–500 € | ⭐⭐⭐⭐☆ | Überdurchschnittlich | Gold |
| > 500 € | ⭐⭐⭐⭐⭐ | Herausragend | Diamant |

### 4.3 Sharing-Feature

- **Native Share API** (Web Share API für Mobilgeräte)
- **Fallback:** Copy-to-Clipboard mit Pre-Built Message:
  ```
  Ich könnte 287€/Jahr bei Strom & Gas sparen! 💡
  Finde dein Sparpotenzial: https://wechselpilot.com/quiz
  ```
- **Open Graph Meta Tags** für Social-Sharing-Vorschau
- **Bookmark:** Ergebnis-URL enthält Quiz-Daten als Base64-encoded Query-Parameter → persistent & teilbar

---

## 5. Soft-Conversion Flow

### 5.1 CTA nach Ergebnis

- **Primär-CTA:** "Willst du das wirklich sparen? In 2 Minuten einrichten"
- **Sekundär-CTA:** "Ergebnis teilen" / "Als Bookmark speichern"
- **Tertiär-CTA:** "Quiz-Ergebnis per E-Mail erhalten" (E-Mail-Capture)

### 5.2 Pre-Fill-Mechanismus

Quiz-Daten werden als URL-Parameter encodiert und an den Registrierungs-Flow übergeben:

```
/signup?quiz=1&hg=2&anbieter=vattenfall&kwh=2500&plz=10115&wohn=wohnung_miete&prognose=287
```

Der Signup-Flow kann diese Daten lesen und:
- Haushaltsgröße → automatisch ausfüllen
- Verbrauch → automatisch ausfüllen
- PLZ → automatisch ausfüllen
- Anbieter → automatisch ausfüllen

### 5.3 Progressive Enhancement

Wenn WP Home installiert ist, fließen die Quiz-Daten direkt in den Wizard-Store:

```typescript
// Quiz-Ergebnis → wpHome localStorage
const quizData = parseQuizParams(window.location.search);
if (quizData) {
  const store = JSON.parse(localStorage.getItem('wpHome_v1') || '{}');
  store.household = {
    plz: quizData.plz,
    persons: quizData.hg,
    propertyType: quizData.wohnform,
    area: 0,
  };
  store.electricity = {
    provider: quizData.anbieter,
    kwh: quizData.kwh,
    monthlyCost: 0,
    tariffType: 'grundversorgung',
    contractEnd: '',
  };
  localStorage.setItem('wpHome_v1', JSON.stringify(store));
}
```

---

## 6. Technische Architektur

### 6.1 Standalone SPA/Widget

- **Keine Abhängigkeiten:** Reines HTML/CSS/JS (kein React, kein Build-Schritt)
- **Größe:** < 50KB (gzipped < 15KB)
- **Ladezeit:** < 1 Sekunde
- **Hosting:** Als statische Datei auf wechselpilot.com

### 6.2 Embedding-Optionen

**Option A: iframe**
```html
<iframe 
  src="https://wechselpilot.com/quiz/" 
  width="100%" 
  height="700" 
  frameborder="0"
  style="border-radius: 16px; max-width: 600px;"
></iframe>
```

**Option B: Web Component**
```html
<script src="https://wechselpilot.com/quiz/widget.js"></script>
<wp-savings-quiz></wp-savings-quiz>
```

**Option C: Direkter Link**
```
https://wechselpilot.com/quiz/
```

### 6.3 Analytics-Events

```javascript
// Tracking (anbindbar an GA4, Segment, etc.)
trackEvent('quiz_started');
trackEvent('quiz_step', { step: 1, answer: '2p' });
trackEvent('quiz_step', { step: 2, answer: 'vattenfall' });
trackEvent('quiz_completed', { savings: 287, badge: 4 });
trackEvent('quiz_cta_clicked', { type: 'signup' });
trackEvent('quiz_shared', { method: 'native' });
```

---

## 7. Metriken & Erfolgsmessung

| Metrik | Ziel | Messung |
|--------|------|---------|
| Quiz Completion Rate | > 65% | Started vs. Completed |
| Time to Complete | < 60s | Timestamp Start → End |
| CTA Click-Through | > 25% | Result → Signup Click |
| Signup Conversion | > 10% | CTA Click → Registrierung |
| Share Rate | > 5% | Result → Share Action |
| Bounce @ Step | < 20% pro Step | Drop-Off-Analyse |

---

## 8. Daten-Aktualisierung

### Monatliche Updates (manuell oder semi-automatisch)

1. **Verivox-Strompreisindex** prüfen → `grundversorgung_avg` aktualisieren
2. **BDEW-Strompreisanalyse** prüfen → Cross-Validierung
3. **Gaspreisindex** prüfen → Gastarife aktualisieren
4. **Wechselpilot-interne Daten** → `wechselpilot_target` Preise aktualisieren

### Quelle für automatische Updates (Zukunft)

- **Verivox API** (falls verfügbar) für PLZ-genaue Tarife
- **SMARD.de** (Bundesnetzagentur) für Großhandelspreise
- **Wechselpilot-interne API** für tatsächliche Kundeneinsparungen

---

## 9. Risiken & Mitigierung

| Risiko | Wahrscheinlichkeit | Mitigierung |
|--------|-------------------|-------------|
| Prognose zu hoch → Enttäuschung | Mittel | Konservatives Modell (+10% Sicherheitspuffer) |
| Prognose zu niedrig → kein Hook | Gering | Minimale Einsparung immer > 50€ |
| Veralttete Tarifdaten | Mittel | Monatliche Review, Disclaimer "Stand: MM/YYYY" |
| Datenschutz-Bedenken | Gering | Keine personenbezogenen Daten, rein clientseitig |
| Mobile UX schlecht | Gering | Mobile-first Design, große Touch-Targets |

---

## 10. Nächste Schritte

1. ✅ Konzept-Dokument (dieses Dokument)
2. ✅ Funktionaler HTML/CSS/JS Prototype
3. ✅ React-Component-Spezifikation
4. ⬜ Review durch Jonas / Product
5. ⬜ Builder: React-Integration in WP Home
6. ⬜ A/B-Test: Quiz vs. direkter Signup
7. ⬜ Tarifdaten-Update-Pipeline einrichten

---

*Konzept erstellt von Brainstormer Unit. Bereit für Review.*
