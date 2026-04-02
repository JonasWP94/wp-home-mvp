# React-Implementierung: SavingsProgress Komponente

## Dateien zu erstellen/ändern

### 1. Neue Datei: `src/components/SavingsProgress.tsx`

Enthält:
- `SavingsProgress` — Hauptkomponente (Fortschrittsbalken + Badge-Grid)
- `BadgeCard` — Einzelne Badge-Karte
- `BadgeToast` — Toast-Notification bei Freischaltung
- `MilestoneMarker` — Marker auf dem Fortschrittsbalken

### 2. Änderung: `src/store/wpHomeStore.tsx`

Erweiterung des `WpHomeData` Interface:

```typescript
interface WpHomeData {
  // ... bestehende Felder ...
  doneTips: number[];
  badges: {
    sparStarter: boolean;
    sparfuchs: boolean;
    sparProfi: boolean;
    sparChampion: boolean;
  };
  badgeUnlockedAt: {
    sparStarter?: string;
    sparfuchs?: string;
    sparProfi?: string;
    sparChampion?: string;
  };
}
```

Neue Context-Methoden:
```typescript
markTipDone: (tipId: number) => void;
markTipUndone: (tipId: number) => void;
```

### 3. Änderung: `src/App.tsx`

Einfügen von `<SavingsProgress />` nach dem Hero-Row div und vor den Kategorie-Cards:

```tsx
{/* Hero Row */}
<div className="wp-hero-row" ...>...</div>

{/* 🆕 Spar-Fortschrittsbalken */}
<SavingsProgress
  tips={tips}
  done={done}
  onMarkDone={markDone}
/>

{/* Kategorie-Cards */}
<div style={{ marginBottom: 24 }}>...</div>
```

## Props-Interface

```typescript
interface SavingsProgressProps {
  tips: Tip[];           // Alle verfügbaren Tipps
  done: Set<number>;     // IDs der erledigten Tipps
  onMarkDone: (id: number) => void;
}
```

## Berechnung

```typescript
const doneCount = done.size;
const totalCount = tips.length;
const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
const savedAmount = tips.filter(t => done.has(t.id)).reduce((s, t) => s + t.sav, 0);
const totalAmount = tips.reduce((s, t) => s + t.sav, 0);
```

## Badge-Check Logic

```typescript
const MILESTONES = [
  { pct: 25, key: 'sparStarter', name: 'Spar-Starter', emoji: '🌱' },
  { pct: 50, key: 'sparfuchs',   name: 'Sparfuchs',    emoji: '⚡' },
  { pct: 75, key: 'sparProfi',   name: 'Spar-Profi',   emoji: '🔥' },
  { pct: 100, key: 'sparChampion', name: 'Spar-Champion', emoji: '🏆' },
];

// In useEffect, triggered when `done` changes:
useEffect(() => {
  const pct = (done.size / tips.length) * 100;
  MILESTONES.forEach(ms => {
    if (pct >= ms.pct && !badges[ms.key]) {
      // Unlock badge, show toast, fire confetti for 100%
    }
  });
}, [done]);
```

## Animation Libraries

Nutzt die bereits importierte `framer-motion`:
- `motion.div` für Badge-Unlock Scale-Animation
- `AnimatePresence` für Toast Ein/Ausblendung
- `motion.div` mit `initial/animate` für Fortschrittsbalken

Confetti: Inline Canvas-basiert (kein extra Package nötig, siehe Prototype).

## Styling

Inline-Styles wie der Rest der App (konsistent mit bestehendem Code-Stil). Verwendet die bestehenden Farb-Konstanten aus `S` (App.tsx).
