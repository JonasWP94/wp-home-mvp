# Wizard Fragenkatalog — Wechselpilot Home

## Ziel
Der Wizard erfasst alle relevanten Daten, um personalisierte Spartipps zu berechnen. Jede Frage wird einzeln gestellt (eine Frage pro Screen), mit der gleichen Optik wie das WP Home Dashboard (Poppins Font, dunkle Header-Gradients, weiße Cards, abgerundete Ecken).

---

## Block 1: Wohnsituation 🏠

| # | Frage | Eingabe-Typ | Optionen / Hinweis |
|---|-------|-------------|-------------------|
| 1.1 | **Wie ist deine Postleitzahl?** | Textfeld (5-stellig) | Bestimmt regionale Tarife + Anbieter |
| 1.2 | **Wie viele Personen leben in deinem Haushalt?** | Slider (1–6+) | Beeinflusst Durchschnittsverbrauch |
| 1.3 | **Wohnst du in einer Wohnung oder einem Haus?** | 2 große Karten (Wohnung / Haus) | Bestimmt verfügbare Tipps (Garten, Dach, etc.) |
| 1.4 | **Wie groß ist deine Wohnfläche?** | Slider (20–250 m²) | Optional, aber verbessert Heizkostenberechnung |

## Block 2: Strom ⚡

| # | Frage | Eingabe-Typ | Optionen / Hinweis |
|---|-------|-------------|-------------------|
| 2.1 | **Wer ist dein Stromanbieter?** | Autocomplete / Dropdown | Top-20 vorgeladen, Rest per Suche |
| 2.2 | **Kennst du deinen jährlichen Stromverbrauch?** | 2 Optionen: "Ja, ungefähr X kWh" / "Nein, schätze für mich" | Bei "Nein": Schätzung aus Personen + m² |
| 2.3 | **Was zahlst du monatlich für Strom?** | Textfeld (€) | Kernfrage für Sparpotenzial-Berechnung |
| 2.4 | **Welchen Tarif hast du?** | 3 Karten: Grundversorgung / Festpreis / Ökostrom | Grundversorgung = höchstes Sparpotenzial |
| 2.5 | **Wann endet dein Stromvertrag?** | Monat/Jahr Picker | Optional — für Kündigungsfrist-Countdown |

## Block 3: Gas / Heizung 🔥

| # | Frage | Eingabe-Typ | Optionen / Hinweis |
|---|-------|-------------|-------------------|
| 3.1 | **Womit heizt du?** | 6 Karten: Gas / Öl / Wärmepumpe / Fernwärme / Strom / Sonstige | Bestimmt ob Gas-Block relevant ist |
| 3.2 | **Wer ist dein Gasanbieter?** | Autocomplete (nur bei Gas) | Überspringen wenn Heizung ≠ Gas |
| 3.3 | **Was zahlst du monatlich für Gas?** | Textfeld (€) | Nur bei Gas-Heizung |
| 3.4 | **Kennst du deinen Gasverbrauch?** | Ja (kWh) / Nein (Schätzung) | Schätzung aus m² + Gebäudealter |
| 3.5 | **Wann endet dein Gasvertrag?** | Monat/Jahr Picker | Optional |

## Block 4: Gebäude & Dämmung 🧱

| # | Frage | Eingabe-Typ | Optionen / Hinweis |
|---|-------|-------------|-------------------|
| 4.1 | **Wann wurde dein Gebäude gebaut?** | 3 Karten: Vor 1990 / 1990–2010 / Nach 2010 | Bestimmt Dämmniveau + Heizbedarf |
| 4.2 | **Wie ist der Dämmzustand?** | 3 Karten: Schlecht (Altbau, ungedämmt) / Mittel (teilsaniert) / Gut (energetisch saniert) | Beeinflusst Heiz-Spartipps |
| 4.3 | **Hast du Zugang zu einem Dach oder Balkon?** | 3 Optionen: Dach / Balkon / Keines | Relevant für Solar/Balkonkraftwerk |

## Block 5: Lifestyle & Gewohnheiten 💡

| # | Frage | Eingabe-Typ | Optionen / Hinweis |
|---|-------|-------------|-------------------|
| 5.1 | **Wie hoch ist dein Haushaltseinkommen ungefähr?** | 4 Karten: <2.000€ / 2.000–3.500€ / 3.500–5.000€ / >5.000€ | Für Investitions-Tipps (lohnt sich Balkonkraftwerk?) |
| 5.2 | **Arbeitest du überwiegend von zu Hause?** | Ja / Nein | Höherer Tagesverbrauch → andere Tarifempfehlung |
| 5.3 | **Hast du ein Elektroauto oder planst du eins?** | Nein / Ja / Geplant | Relevant für Wallbox + speziellen Autostrom-Tarif |
| 5.4 | **Nutzt du einen Wäschetrockner?** | Ja, regelmäßig / Selten / Nein | Einer der größten Stromfresser |
| 5.5 | **Wie alt sind deine Haushaltsgeräte im Schnitt?** | 3 Karten: <5 Jahre / 5–10 Jahre / >10 Jahre | Alte Geräte = riesiges Sparpotenzial |

## Block 6: Wechselpilot-Service 🚀

| # | Frage | Eingabe-Typ | Optionen / Hinweis |
|---|-------|-------------|-------------------|
| 6.1 | **Möchtest du Verträge automatisch wechseln lassen?** | Ja (Autopilot) / Nein (selber machen) | Aktiviert/deaktiviert Autopilot-Feature |
| 6.2 | **Was ist dir beim Anbieter am wichtigsten?** | Ranking (Drag & Drop): Preis / Ökostrom / Kundenservice / Bekannter Anbieter | Personalisiert Tarifempfehlung |

---

## Zusammenfassung (letzter Screen)

Nach Abschluss: Animierte Zusammenfassung mit:
- Geschätztes Gesamtsparpotenzial (€/Jahr)
- Anzahl passender Spartipps
- "Dein Dashboard wird erstellt..." → Weiterleitung zum Dashboard

---

## Design-Vorgaben

- **Eine Frage pro Screen** — kein Scrollen nötig
- **Große, tappbare Karten** für Auswahl-Optionen (min 48px Höhe)
- **Progress-Bar** oben (6 Blöcke, animiert)
- **Zurück/Weiter Buttons** unten fixiert
- **Gleiche Farben wie Dashboard:** Primary #243c47, Accent #24a47d, Gradient Header
- **Font:** Poppins
- **Skip-Option** bei optionalen Fragen ("Überspringen →")
- **Validierung:** Inline, freundlich ("Bitte gib deine PLZ ein")

## Aktuelle Fragen im Wizard (Bestand)

Zum Vergleich — diese Fragen existieren bereits:
- PLZ, Personen, Wohnform, Wohnfläche
- Stromanbieter, Verbrauch, Kosten, Tarifart, Vertragsende
- Gasanbieter, Verbrauch, Kosten, Vertragsende
- Gebäudealter, Dämmung, Heizungsart
- Einkommen

**Neu hinzuzufügen:**
- Home Office (5.2)
- E-Auto (5.3)
- Wäschetrockner (5.4)
- Gerätealter (5.5)
- Dach/Balkon (4.3)
- Autopilot-Präferenz (6.1)
- Anbieter-Priorität (6.2)
- Intelligente Verbrauchs-Schätzung bei "weiß ich nicht" (2.2, 3.4)
