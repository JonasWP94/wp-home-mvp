# Spar-Fortschrittsbalken mit Gamification — Konzept & Spezifikation

**Projekt:** Wechselpilot Home  
**Priorität:** Medium  
**Status:** Konzept & Prototype (Brainstormer)  
**Erstellt:** 2026-04-02  

---

## 1. Übersicht

Ein visueller Fortschrittsbalken mit Gamification-Elementen, der den Nutzer motiviert, alle personalisierten Spartipps umzusetzen. Meilensteine bei 25%, 50%, 75% und 100% schalten Badges frei und erzeugen visuelles Feedback.

### Kernidee
> "Zeige dem Nutzer nicht nur WAS er sparen kann, sondern WIE WEIT er schon ist — und belohne ihn für jeden Fortschritt."

### Placement
Der Fortschrittsbalken wird **direkt unter dem Hero-Bereich** im Dashboard eingebaut — nach Wizard-Completion sichtbar, prominente Position für tägliche Motivation.

---

## 2. Visueller Fortschrittsbalken

### 2.1 Design-Spezifikation

```
┌──────────────────────────────────────────────────────────────┐
│  🏆 Dein Spar-Fortschritt                    12/30 Tipps    │
│                                                              │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░  40%             │
│        🌱          ⚡          🔥         🏆               │
│       25%         50%         75%        100%               │
│     Starter    Sparfuchs   Spar-Profi  Spar-Champion        │
│                                                              │
│  Bereits gespart: 3.240 € / 8.100 € möglich                │
│  Nächster Badge: ⚡ Sparfuchs (noch 3 Tipps)                │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Balken-Komponente

- **Breite:** 100% des Containers, responsive
- **Höhe:** 12px (Desktop) / 10px (Mobile)
- **Farbe:** Gradient von `#24a47d` (Wechselpilot-Grün) → `#16a34a` (dunkleres Grün)
- **Hintergrund:** `#e3e3e6` (unfilled)
- **Border-Radius:** 6px (abgerundet)
- **Animation:** CSS `transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1)` — smooth fill
- **Glow-Effekt:** Subtiler Box-Shadow bei Fortschritt: `0 0 8px rgba(36,164,125,0.4)`

### 2.3 Meilenstein-Marker

Auf dem Balken positionierte Punkte bei 25%, 50%, 75%, 100%:
- **Erreicht:** Ausgefüllter Kreis (16px) mit Badge-Emoji, leichter Glow
- **Nicht erreicht:** Grauer Outline-Kreis (12px)
- **Aktueller nächster:** Pulsierender Kreis (Animation)

### 2.4 Berechnung

```
Fortschritt (%) = (Anzahl umgesetzter Tipps / Gesamtanzahl Tipps) × 100
Ersparter Betrag = Σ(Sparbetrag aller umgesetzten Tipps)
Maximaler Betrag = Σ(Sparbetrag aller verfügbaren Tipps)
```

---

## 3. Gamification-System: 4 Badges

### 3.1 Badge-Definitionen

| Meilenstein | Badge-Name | Emoji | Beschreibung | Schwelle |
|-------------|-----------|-------|--------------|----------|
| 25% | **Spar-Starter** | 🌱 | Erster Schritt gemacht! Du hast ein Viertel deiner Tipps umgesetzt. | 25% der Tipps |
| 50% | **Sparfuchs** | ⚡ | Halbzeit! Du sparst schon ordentlich. Weiter so! | 50% der Tipps |
| 75% | **Spar-Profi** | 🔥 | Fast geschafft! Du bist ein echter Sparprofi. | 75% der Tipps |
| 100% | **Spar-Champion** | 🏆 | Alle Tipps umgesetzt! Du holst das Maximum raus. | 100% der Tipps |

### 3.2 Badge-Design

Jeder Badge besteht aus:
- **Icon-Ring:** 64px Kreis mit farbigem Hintergrund + Emoji
- **Name:** Bold, 14px
- **Status:** "Freigeschaltet" (grün) oder "Noch X Tipps" (grau)
- **Locked State:** Grayscale + reduzierte Opacity (0.4)
- **Unlocked State:** Volle Farbe + leichter Schatten + Checkmark-Overlay

### 3.3 Farben pro Badge

| Badge | Ring-Farbe (unlocked) | Ring-Farbe (locked) |
|-------|----------------------|---------------------|
| Spar-Starter | `#d3ede5` (ltGreen) | `#f3f3f5` |
| Sparfuchs | `#feeecc` (ltYellow) | `#f3f3f5` |
| Spar-Profi | `#fdcece` (ltRed/Orange) | `#f3f3f5` |
| Spar-Champion | `#d4e2ed` (ltBlue) → Gold-Gradient | `#f3f3f5` |

---

## 4. Visuelles Feedback bei Badge-Vergabe

### 4.1 Freischalt-Animation (Badge Unlock)

Wenn ein Nutzer einen Meilenstein erreicht:

1. **Confetti-Burst:** Kleine farbige Partikel explodieren vom Badge-Punkt (300ms)
2. **Badge-Scale:** Badge skaliert von 0 → 1.2 → 1.0 (spring animation, 500ms)
3. **Glow-Pulse:** Badge bekommt einen pulsierenden Glow-Ring (2 Zyklen, 1.5s)
4. **Toast-Notification:** Slide-in von unten:
   ```
   ┌─────────────────────────────────────┐
   │ 🌱 Badge freigeschaltet!            │
   │ "Spar-Starter" — Weiter so!        │
   └─────────────────────────────────────┘
   ```
   Auto-dismiss nach 4 Sekunden.

### 4.2 Fortschrittsbalken-Animation

Bei jedem "Tipp umsetzen":
- Balken füllt sich smooth auf neuen Wert
- Prozent-Zahl zählt animiert hoch (AnimatedCounter)
- Ersparter Betrag zählt animiert hoch

### 4.3 Spezial-Animation bei 100%

Bei Erreichen von 100%:
- Goldener Rahmen um den gesamten Fortschrittsbereich
- Confetti-Regen über dem ganzen Dashboard (2s)
- Spezieller Glückwunsch-Text: "🎉 Du hast alle Tipps umgesetzt! Maximale Ersparnis erreicht."

---

## 5. Datenspeicherung

### 5.1 LocalStorage (aktueller Ansatz, MVP)

Erweitert den bestehenden `wpHome_v1` localStorage-Key:

```typescript
interface WpHomeData {
  // ... existing fields ...
  
  // NEU: Gamification
  doneTips: number[];           // IDs der umgesetzten Tipps
  badges: {
    sparStarter: boolean;       // 25% Badge
    sparfuchs: boolean;         // 50% Badge  
    sparProfi: boolean;         // 75% Badge
    sparChampion: boolean;      // 100% Badge
  };
  badgeUnlockedAt: {            // Zeitstempel der Freischaltung
    sparStarter?: string;       // ISO-Date
    sparfuchs?: string;
    sparProfi?: string;
    sparChampion?: string;
  };
}
```

### 5.2 Migration (später, Backend)

Wenn WP Home ein Backend bekommt:
- Badge-Status per User in PostgreSQL
- API: `GET /api/progress`, `POST /api/tips/:id/done`
- Sync zwischen Geräten

---

## 6. Integration in WP Home Dashboard

### 6.1 Placement in App.tsx

Der Fortschrittsbalken wird als neue Komponente `<SavingsProgress />` eingefügt:

```
Dashboard Layout:
┌─ Header ──────────────────────────────────┐
├─ Hero Row (Sparpotenzial + Flugspiel) ────┤
├─ 🆕 Spar-Fortschrittsbalken ─────────────┤  ← HIER
├─ Kategorie-Cards ─────────────────────────┤
├─ Räume-Editor ────────────────────────────┤
├─ Sofort-Tipps ────────────────────────────┤
├─ Personalisierungs-Badge ─────────────────┤
└─ Wizard-Button ───────────────────────────┘
```

### 6.2 State-Management

- `done` Set in `Dashboard` wird zum Single Source of Truth
- Fortschrittsberechnung: `done.size / tips.length`
- Badge-Check bei jedem State-Update
- Toast-Queue für Badge-Notifications

### 6.3 Interaktion mit bestehendem Code

Der bestehende `markDone(id)` wird erweitert:
```typescript
function markDone(id: number) {
  setDone(prev => {
    const next = new Set(prev);
    next.add(id);
    // Badge-Check
    const pct = next.size / tips.length;
    checkBadges(pct);
    // Persist to localStorage
    saveDoneTips(Array.from(next));
    return next;
  });
}
```

---

## 7. Mobile-Responsive Design

### 7.1 Breakpoints

| Breakpoint | Verhalten |
|-----------|-----------|
| < 400px | Badges als 2×2 Grid, kompakte Ansicht |
| 400-640px | Badges als horizontale Scroll-Row |
| > 640px | Badges nebeneinander, volle Breite |

### 7.2 Touch-Optimierung

- Alle Badges mindestens 48px Touch-Target
- Swipe-Geste auf Badge-Row (Mobile)
- Toast-Notifications: Full-Width auf Mobile, zentriert auf Desktop

---

## 8. Prototype

Der funktionale HTML/CSS/JS Prototype befindet sich unter:

```
~/apps/wpilot-home/docs/prototype-spar-fortschritt.html
```

Zeigt:
- ✅ Animierten Fortschrittsbalken (0-100%)
- ✅ 4 Meilenstein-Marker auf dem Balken
- ✅ 4 Badge-Cards (locked/unlocked States)
- ✅ Simulated Tip-Completion mit Fortschritts-Update
- ✅ Badge-Freischalt-Animation (Scale + Glow + Toast)
- ✅ Confetti bei 100%
- ✅ Mobile-responsive Layout
- ✅ Ersparter Betrag vs. Maximum

---

## 9. Implementierungs-Plan

### Phase 1: MVP (Brainstormer → Builder)
1. `SavingsProgress.tsx` Komponente erstellen
2. Badge-State in `wpHomeStore.tsx` integrieren
3. In `App.tsx` nach Hero-Row einfügen
4. `doneTips` in localStorage persistieren
5. Toast-Notification-System

### Phase 2: Animations
1. Confetti-Library (canvas-confetti oder custom)
2. Badge-Unlock-Animationen
3. 100%-Spezial-Animation

### Phase 3: Polish
1. Badge-Detail-View (klickbar, zeigt Freischalt-Datum)
2. Sharing: "Teile deinen Fortschritt" (optional)
3. Sound-Feedback (optional, user-toggleable)

---

## 10. Metriken (für Growth-Tracking)

| Metrik | Ziel | Messung |
|--------|------|---------|
| Daily Return Rate | +30% | Nutzer die täglich zurückkehren |
| Tip Completion Rate | +50% | Anteil umgesetzter Tipps |
| Time-to-First-Badge | < 5 min | Zeit bis erster Badge freigeschaltet |
| 100% Completion Rate | > 15% | Nutzer die alle Tipps umsetzen |

---

*Konzept erstellt von Brainstormer Unit. Nächster Schritt: Review + Builder-Zuweisung.*
