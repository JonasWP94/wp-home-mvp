/**
 * FloorPlan.tsx - Visueller Grundriss-Editor
 * Portiert von Jonas' Code → wpilot-home Room-Interface
 * Nutzt dieselben rooms[] aus localStorage
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Room } from "./RoomsEditor";

// ── Typen ────────────────────────────────────────────────────────
interface VisualRoom {
  id: string; name: string; icon: string; color: string;
  x: number; y: number; w: number; h: number;
  size: number; // Original m² — bleibt während drag erhalten
}

// ── Presets & Templates ──────────────────────────────────────────
const ROOM_TEMPLATES_V = [
  { name: "Wohnzimmer", icon: "🛋️", color: "#e2e8f0", w: 70, h: 55, size: 14 },
  { name: "Schlafzimmer", icon: "🛏️", color: "#e8e2f0", w: 55, h: 48, size: 10 },
  { name: "Küche", icon: "🍳", color: "#f0ece2", w: 45, h: 40, size: 6 },
  { name: "Bad", icon: "🚿", color: "#e2ecf0", w: 40, h: 35, size: 5 },
  { name: "Kinderzimmer", icon: "🧸", color: "#fce9d2", w: 52, h: 46, size: 8 },
  { name: "Arbeitszimmer", icon: "💻", color: "#d3ede5", w: 45, h: 40, size: 6 },
  { name: "Flur", icon: "🚪", color: "#e8e9ec", w: 80, h: 25, size: 4 },
  { name: "Balkon", icon: "🌿", color: "#d4e2ed", w: 65, h: 22, size: 3 },
];

const PRESET_2Z: VisualRoom[] = [
  { id: "p101", name: "Wohnzimmer", icon: "🛋️", color: "#e2e8f0", x: 10, y: 10, w: 70, h: 55, size: 18 },
  { id: "p102", name: "Schlafzimmer", icon: "🛏️", color: "#e8e2f0", x: 10, y: 70, w: 60, h: 50, size: 14 },
  { id: "p103", name: "Küche", icon: "🍳", color: "#f0ece2", x: 75, y: 10, w: 50, h: 45, size: 10 },
  { id: "p104", name: "Bad", icon: "🚿", color: "#e2ecf0", x: 75, y: 60, w: 45, h: 38, size: 6 },
  { id: "p105", name: "Flur", icon: "🚪", color: "#e8e9ec", x: 10, y: 125, w: 110, h: 25, size: 6 },
];

const PRESET_3Z: VisualRoom[] = [
  { id: "p201", name: "Wohnzimmer", icon: "🛋️", color: "#e2e8f0", x: 10, y: 10, w: 80, h: 60, size: 18 },
  { id: "p202", name: "Schlafzimmer", icon: "🛏️", color: "#e8e2f0", x: 95, y: 10, w: 60, h: 50, size: 14 },
  { id: "p203", name: "Kinderzimmer", icon: "🧸", color: "#fce9d2", x: 95, y: 65, w: 58, h: 48, size: 12 },
  { id: "p204", name: "Küche", icon: "🍳", color: "#f0ece2", x: 10, y: 75, w: 50, h: 45, size: 10 },
  { id: "p205", name: "Bad", icon: "🚿", color: "#e2ecf0", x: 65, y: 118, w: 45, h: 38, size: 6 },
  { id: "p206", name: "Flur", icon: "🚪", color: "#e8e9ec", x: 10, y: 125, w: 145, h: 25, size: 6 },
];

const ROOM_COLORS = ["#e2e8f0","#e8e2f0","#f0ece2","#e2ecf0","#e8e9ec","#fce9d2","#d3ede5","#feeecc","#fdcece","#d4e2ed"];

// ── Style Constants ──────────────────────────────────────────────
const S = {
  primary: "#243c47", accent: "#24a47d", green: "#16a34a",
  g200: "#f3f3f5", g300: "#e3e3e6", g500: "#c4c4ca",
  g700: "#6b6b7b", g800: "#3a3a4a", g900: "#595962",
  bg: "#f8f8fa", white: "#fff", ltBlue: "#d4e2ed",
  red: "#e93a3a", orange: "#ef7520",
};

const SNAP_T = 10;
const FEAT_SZ = 30;

// ── Konvertierung rooms[] ↔ visual[] ────────────────────────────
// m² → Pixel: w = sqrt(size) * 14, h = sqrt(size) * 12
const SQRT_SCALE_W = 18;
const SQRT_SCALE_H = 16;

function roomsToVisual(rooms: Room[]): VisualRoom[] {
  // Use a smart grid layout that distributes rooms evenly
  const cols = Math.ceil(Math.sqrt(rooms.length));
  const colW = 160;
  const rowH = 140;
  return rooms.map((r, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      id: r.id,
      name: r.name,
      icon: r.icon,
      color: r.color,
      x: 30 + col * colW,
      y: 30 + row * rowH,
      w: Math.max(60, Math.round(Math.sqrt(r.size) * SQRT_SCALE_W)),
      h: Math.max(50, Math.round(Math.sqrt(r.size) * SQRT_SCALE_H)),
      size: r.size,
    };
  });
}

function visualToRooms(visual: VisualRoom[]): Room[] {
  // m² are NEVER derived from pixels — they stay as-is from the slider/template
  // Resize only changes visual proportions, not the m² value
  return visual.map(r => ({
    id: r.id,
    name: r.name,
    icon: r.icon,
    color: r.color,
    size: r.size,
  }));
}

// ── Helper ──────────────────────────────────────────────────────
function sn(v: number) { return Math.round(v / 10) * 10; }

// ── Haupt-Komponente ────────────────────────────────────────────
interface Props {
  rooms: Room[];
  onChange: (rooms: Room[]) => void;
  onClose: () => void;
  onSwitchToList?: () => void;
}

export default function FloorPlan({ rooms, onChange, onClose, onSwitchToList }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [visual, setVisual] = useState<VisualRoom[]>(() => roomsToVisual(rooms));
  const [features, setFeatures] = useState<{id: string; type: string; rid: string; wall: string; pos: number}[]>([]);
  const [sel, setSel] = useState<string[]>([]);
  const [selFeat, setSelFeat] = useState<string | null>(null);
  const [editName, setEditName] = useState<string | null>(null);
  const [colorPk, setColorPk] = useState<string | null>(null);
  const [addFeat, setAddFeat] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPan, setIsPan] = useState(false);
  const [guides, setGuides] = useState<any[]>([]);
  const [hovWall, setHovWall] = useState<any>(null);
  const [onboard, setOnboard] = useState(true);
  const [hist, setHist] = useState<VisualRoom[][]>([]);
  const [fut, setFut] = useState<VisualRoom[][]>([]);

  const [drag, setDrag] = useState<any>(null);
  const [resize, setResize] = useState<any>(null);

  const panSt = useRef<any>(null);
  const spRef = useRef(false);
  const zR = useRef(1);
  const pR = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  zR.current = zoom; pR.current = pan;

  // Track if this component has been initialized with rooms
  const initializedRef = useRef(false);

  // Only sync from external rooms on initial load, not during drag/resize
  useEffect(() => {
    if (!initializedRef.current) {
      setVisual(roomsToVisual(rooms));
      initializedRef.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rooms.length > 0 && onboard) {
      const t = setTimeout(() => setOnboard(false), 2500);
      return () => clearTimeout(t);
    }
  }, [rooms.length, onboard]);

  function pushH() {
    setHist(h => h.slice(-30).concat([visual]));
    setFut([]);
  }

  function syncToParent(v: VisualRoom[]) {
    onChange(visualToRooms(v));
  }

  function undo() {
    if (!hist.length) return;
    const prev = hist[hist.length - 1];
    setFut(f => [visual, ...f.slice(0, 30)]);
    setVisual(prev);
    syncToParent(prev);
    setHist(h => h.slice(0, -1));
  }

  function redo() {
    if (!fut.length) return;
    const nxt = fut[0];
    setHist(h => h.concat([visual]));
    setVisual(nxt);
    syncToParent(nxt);
    setFut(f => f.slice(1));
  }

  function delFeat(fid: string) {
    pushH();
    setFeatures(f => f.filter(x => x.id !== fid));
    setSelFeat(null);
  }

  function toCnv(cx: number, cy: number) {
    const rc = ref.current ? ref.current.getBoundingClientRect() : null;
    if (!rc) return { x: 0, y: 0 };
    return {
      x: (cx - rc.left - pR.current.x) / zR.current,
      y: (cy - rc.top - pR.current.y) / zR.current,
    };
  }

  function calcSnap(mIds: string[], tR: VisualRoom[]) {
    const mv = tR.filter(r => mIds.indexOf(r.id) >= 0);
    const ot = tR.filter(r => mIds.indexOf(r.id) < 0);
    const g: any[] = [];
    if (!mv.length || !ot.length) return { g, dx: 0, dy: 0 };

    let bDx = 0, bDistX = SNAP_T + 1, bDy = 0, bDistY = SNAP_T + 1;
    const mxE: number[] = [], myE: number[] = [];
    mv.forEach(r => { mxE.push(r.x, r.x + r.w, r.x + r.w / 2); myE.push(r.y, r.y + r.h, r.y + r.h / 2); });
    ot.forEach(o => {
      const oxE = [o.x, o.x + o.w, o.x + o.w / 2];
      const oyE = [o.y, o.y + o.h, o.y + o.h / 2];
      mxE.forEach(mx => oxE.forEach(ox => {
        const d = Math.abs(mx - ox);
        if (d < bDistX) { bDistX = d; bDx = ox - mx; }
      }));
      myE.forEach(my => oyE.forEach(oy => {
        const d = Math.abs(my - oy);
        if (d < bDistY) { bDistY = d; bDy = oy - my; }
      }));
    });

    const sdx = bDistX <= SNAP_T ? bDx : 0;
    const sdy = bDistY <= SNAP_T ? bDy : 0;

    if (sdx !== 0) {
      const all = mv.map(r => ({ ...r, x: r.x + sdx })).concat(ot);
      const minY = Math.min(...all.map(r => r.y)) - 30;
      const maxY = Math.max(...all.map(r => r.y + r.h)) + 30;
      const seen: Record<string, boolean> = {};
      mv.forEach(mr => {
        [mr.x + sdx, mr.x + mr.w + sdx, mr.x + mr.w / 2 + sdx].forEach(mx => {
          ot.forEach(o => {
            [o.x, o.x + o.w, o.x + o.w / 2].forEach(ox => {
              if (Math.abs(mx - ox) < 1 && !seen["v" + Math.round(ox)]) {
                seen["v" + Math.round(ox)] = true;
                g.push({ t: "v", x: ox, y1: minY, y2: maxY });
              }
            });
          });
        });
      });
    }
    if (sdy !== 0) {
      const all2 = mv.map(r => ({ ...r, y: r.y + sdy })).concat(ot);
      const minX = Math.min(...all2.map(r => r.x)) - 30;
      const maxX = Math.max(...all2.map(r => r.x + r.w)) + 30;
      const seen2: Record<string, boolean> = {};
      mv.forEach(mr => {
        [mr.y + sdy, mr.y + mr.h + sdy, mr.y + mr.h / 2 + sdy].forEach(my => {
          ot.forEach(o => {
            [o.y, o.y + o.h, o.y + o.h / 2].forEach(oy => {
              if (Math.abs(my - oy) < 1 && !seen2["h" + Math.round(oy)]) {
                seen2["h" + Math.round(oy)] = true;
                g.push({ t: "h", y: oy, x1: minX, x2: maxX });
              }
            });
          });
        });
      });
    }
    return { g, dx: sdx, dy: sdy };
  }

  const onWheel = useCallback((e: any) => {
    e.preventDefault();
    const rc = ref.current ? ref.current.getBoundingClientRect() : null;
    if (!rc) return;
    const mx = e.clientX - rc.left, my = e.clientY - rc.top;
    const d = e.deltaY > 0 ? 0.9 : 1.1;
    const oldZ = zR.current;
    const newZ = Math.min(3, Math.max(0.2, oldZ * d));
    setZoom(newZ);
    setPan({ x: mx - (mx - pR.current.x) * (newZ / oldZ), y: my - (my - pR.current.y) * (newZ / oldZ) });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.code === "Space") { spRef.current = true; e.preventDefault(); }
      if (e.key === "Escape") { setAddFeat(null); setHovWall(null); setSelFeat(null); }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); redo(); }
      if ((e.key === "Delete" || e.key === "Backspace") && selFeat) { delFeat(selFeat); }
      if ((e.key === "Delete" || e.key === "Backspace") && sel.length && !selFeat) {
        pushH();
        const idsToRemove = new Set(sel);
        const newVisual = visual.filter(r => !idsToRemove.has(r.id));
        setVisual(newVisual);
        syncToParent(newVisual);
        setSel([]);
      }
    }
    function up(e: KeyboardEvent) { if (e.code === "Space") spRef.current = false; }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  });

  // Touch event listeners for mobile drag — attached directly to canvas div
  // (useEffect approach caused stale closure issues with onMM/onMU deps)

  function onCnvDown(e: any) {
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    if (spRef.current || e.button === 1) {
      setIsPan(true);
      panSt.current = { x: cx - pR.current.x, y: cy - pR.current.y };
      return;
    }
    if (e.target === ref.current) {
      setSel([]); setSelFeat(null); setColorPk(null);
    }
  }

  function onRmDown(e: any, id: string) {
    e.stopPropagation();
    if (addFeat) return;
    const ns = e.shiftKey
      ? (sel.indexOf(id) >= 0 ? sel.filter(x => x !== id) : sel.concat([id]))
      : [id];
    setSel(ns);
    pushH();
    const or: Record<string, any> = {};
    visual.forEach(r => { or[r.id] = { x: r.x, y: r.y, size: r.size }; });
    // Support both mouse and touch
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    setDrag({ ids: ns, sx: cx, sy: cy, or });
    isDraggingRef.current = true;
  }

  function onMM(e: any) {
    // Support both mouse and touch
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    if (isPan && panSt.current) {
      setPan({ x: cx - panSt.current.x, y: cy - panSt.current.y });
      return;
    }
    if (drag) {
      const rx = (cx - drag.sx) / zR.current;
      const ry = (cy - drag.sy) / zR.current;
      // Kein Snap während Drag → flüssiges Verschieben
      const newVisual = visual.map(r =>
        drag.ids.indexOf(r.id) >= 0
          ? { ...r, x: Math.round(drag.or[r.id].x + rx), y: Math.round(drag.or[r.id].y + ry) }
          : r
      );
      setVisual(newVisual);
      // Kein onChange während drag → m² bleiben stabil
    }
    if (resize) {
      const newW = sn(Math.max(40, resize.sw + (cx - resize.sx) / zR.current));
      const newH = sn(Math.max(30, resize.sh + (cy - resize.sy) / zR.current));
      const newVisual = visual.map(r =>
        r.id === resize.id ? { ...r, w: newW, h: newH } : r  // keep size as-is
      );
      setVisual(newVisual);
      syncToParent(newVisual);
    }
    if (addFeat) {
      const pos = toCnv(cx, cy);
      let best: any = null, bestD = 30;
      visual.forEach(r => {
        ([
          { wall: "top", wy: r.y, ax: "x", st: r.x, ln: r.w },
          { wall: "bottom", wy: r.y + r.h, ax: "x", st: r.x, ln: r.w },
          { wall: "left", wx: r.x, ax: "y", st: r.y, ln: r.h },
          { wall: "right", wx: r.x + r.w, ax: "y", st: r.y, ln: r.h },
        ] as any[]).forEach(wl => {
          const d = wl.ax === "x" ? Math.abs(pos.y - wl.wy) : Math.abs(pos.x - wl.wx);
          const al = wl.ax === "x" ? pos.x : pos.y;
          if (d < bestD && al > wl.st && al < wl.st + wl.ln) { bestD = d; best = { rid: r.id, wall: wl.wall, ax: wl.ax }; }
        });
      });
      setHovWall(best);
    }
  }

  // Resolve overlaps: push rooms apart so they don't overlap, snapping to edges
  function resolveOverlaps(rooms: VisualRoom[]): VisualRoom[] {
    const result = rooms.map(r => ({ ...r }));
    const maxIter = 20;
    for (let iter = 0; iter < maxIter; iter++) {
      let moved = false;
      for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          const a = result[i], b = result[j];
          // Check overlap
          const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (overlapX > 0 && overlapY > 0) {
            // They overlap — find the smallest push direction
            // Calculate push amounts for all 4 directions
            const pushRight = (b.x + b.w) - a.x; // push a right
            const pushLeft = (a.x + a.w) - b.x;  // push a left  
            const pushDown = (b.y + b.h) - a.y;   // push a down
            const pushUp = (a.y + a.h) - b.y;     // push a up

            const minPush = Math.min(pushRight, pushLeft, pushDown, pushUp);

            if (minPush === pushRight) {
              result[i] = { ...a, x: sn(b.x + b.w) };
            } else if (minPush === pushLeft) {
              result[i] = { ...a, x: sn(b.x - a.w) };
            } else if (minPush === pushDown) {
              result[i] = { ...a, y: sn(b.y + b.h) };
            } else {
              result[i] = { ...a, y: sn(b.y - a.h) };
            }
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    return result;
  }

  // Snap edges to nearby room edges (magnetic snap)
  function snapToEdges(room: VisualRoom, others: VisualRoom[]): { x: number; y: number } {
    const SNAP_DIST = 12;
    let bestDx = 0, bestDy = 0, bestDistX = SNAP_DIST + 1, bestDistY = SNAP_DIST + 1;
    const edges: number[] = [room.x, room.x + room.w, room.y, room.y + room.h];

    others.forEach(o => {
      const oEdges = [o.x, o.x + o.w, o.y, o.y + o.h];
      // X snapping
      [room.x, room.x + room.w].forEach(myEdge => {
        oEdges.filter((_, i) => i < 2).forEach(oEdge => { // only x edges
          const d = Math.abs(myEdge - oEdge);
          if (d < bestDistX) { bestDistX = d; bestDx = oEdge - myEdge; }
        });
      });
      // Y snapping
      [room.y, room.y + room.h].forEach(myEdge => {
        oEdges.filter((_, i) => i >= 2).forEach(oEdge => { // only y edges
          const d = Math.abs(myEdge - oEdge);
          if (d < bestDistY) { bestDistY = d; bestDy = oEdge - myEdge; }
        });
      });
    });

    return {
      x: bestDistX <= SNAP_DIST ? sn(room.x + bestDx) : sn(room.x),
      y: bestDistY <= SNAP_DIST ? sn(room.y + bestDy) : sn(room.y),
    };
  }

  function onMU() {
    if (drag) {
      // 1. Grid snap
      let snappedVisual = visual.map(r =>
        drag.ids.indexOf(r.id) >= 0
          ? { ...r, x: sn(r.x), y: sn(r.y) }
          : r
      );
      // 2. Magnetic edge snap for dragged rooms
      const others = snappedVisual.filter(r => drag.ids.indexOf(r.id) < 0);
      snappedVisual = snappedVisual.map(r => {
        if (drag.ids.indexOf(r.id) >= 0) {
          const snapped = snapToEdges(r, others);
          return { ...r, x: snapped.x, y: snapped.y };
        }
        return r;
      });
      // 3. Resolve any remaining overlaps
      snappedVisual = resolveOverlaps(snappedVisual);
      setVisual(snappedVisual);
      syncToParent(snappedVisual);
    }
    if (resize) {
      // Also resolve overlaps after resize
      const resolved = resolveOverlaps(visual);
      setVisual(resolved);
      syncToParent(resolved);
    }
    setDrag(null);
    setResize(null);
    setIsPan(false);
    isDraggingRef.current = false;
    panSt.current = null;
    setGuides([]);
  }

  function onCnvClick(e: any) {
    if (!addFeat || !hovWall) return;
    const r = visual.find(r => r.id === hovWall.rid);
    if (!r) return;
    const cx = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const cy = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const p = (hovWall.wall === "top" || hovWall.wall === "bottom")
      ? (toCnv(cx, cy).x - r.x) / r.w
      : (toCnv(cx, cy).y - r.y) / r.h;
    pushH();
    setFeatures(f => f.concat([{ id: Date.now().toString(), type: addFeat, rid: r.id, wall: hovWall.wall, pos: Math.max(0.05, Math.min(0.95, p)) }]));
  }

  function onDrop(e: any) {
    e.preventDefault();
    const d = e.dataTransfer.getData("rp");
    if (!d) return;
    const p = JSON.parse(d);
    const pos = toCnv(e.clientX, e.clientY);
    pushH();
    const newRoom: VisualRoom = {
      id: Date.now().toString(), name: p.name, icon: p.icon, color: p.color,
      x: sn(pos.x - p.w / 2), y: sn(pos.y - p.h / 2),
      w: p.w, h: p.h, size: p.size,
    };
    const newVisual = [...visual, newRoom];
    setVisual(newVisual);
    syncToParent(newVisual);
    setOnboard(false);
  }

  function zoomFit() {
    if (!visual.length || !ref.current) return;
    const rc = ref.current.getBoundingClientRect();
    const x0 = Math.min(...visual.map(r => r.x));
    const x1 = Math.max(...visual.map(r => r.x + r.w));
    const y0 = Math.min(...visual.map(r => r.y));
    const y1 = Math.max(...visual.map(r => r.y + r.h));
    const cw = x1 - x0 + 80, ch = y1 - y0 + 80;
    const z = Math.min(1.6, Math.min(rc.width / cw, rc.height / ch));
    setZoom(z);
    setPan({ x: (rc.width - cw * z) / 2 - (x0 - 40) * z, y: (rc.height - ch * z) / 2 - (y0 - 40) * z });
  }

  function loadPreset(preset: VisualRoom[]) {
    pushH();
    const mapped = preset.map((r, i) => ({ ...r, id: "preset" + Date.now() + i }));
    setVisual(mapped);
    syncToParent(mapped);
    setOnboard(false);
  }

  const totalM2 = visual.reduce((s, r) => s + r.size, 0).toFixed(0);

  function TB(p: { label: string; onClick: () => void; disabled?: boolean; active?: boolean }) {
    return (
      <button onClick={p.onClick} disabled={p.disabled}
        style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: p.disabled ? "default" : "pointer",
          border: "1px solid " + (p.active ? S.accent : "#d4d4d7"),
          background: p.active ? S.accent : p.disabled ? "#f3f3f5" : "#fff",
          color: p.active ? "#fff" : p.disabled ? S.g500 : S.g900, opacity: p.disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 3 }}>
        {p.label}
      </button>
    );
  }

  // Feature-Elemente (Türen/Fenster auf Wänden)
  const featEls = features.map(f => {
    const rm = visual.find(r => r.id === f.rid);
    if (!rm) return null;
    let fx: number, fy: number, fw: number, fh: number;
    if (f.wall === "top") { fy = rm.y - 2; fx = rm.x + rm.w * f.pos - FEAT_SZ / 2; fw = FEAT_SZ; fh = 6; }
    else if (f.wall === "bottom") { fy = rm.y + rm.h - 4; fx = rm.x + rm.w * f.pos - FEAT_SZ / 2; fw = FEAT_SZ; fh = 6; }
    else if (f.wall === "left") { fx = rm.x - 2; fy = rm.y + rm.h * f.pos - FEAT_SZ / 2; fh = FEAT_SZ; fw = 6; }
    else { fx = rm.x + rm.w - 4; fy = rm.y + rm.h * f.pos - FEAT_SZ / 2; fh = FEAT_SZ; fw = 6; }
    const col = f.type === "door" ? S.accent : S.green;
    const isSl = selFeat === f.id;
    return (
      <g key={f.id} style={{ pointerEvents: "all" }}>
        <rect x={fx} y={fy} width={fw} height={fh} rx={f.type === "door" ? 2 : 0}
          fill={col} opacity={isSl ? 1 : 0.85} stroke={isSl ? S.orange : "none"} strokeWidth={isSl ? 2 : 0}
          style={{ cursor: "pointer", pointerEvents: "all" }}
          onClick={(e: any) => { e.stopPropagation(); setSelFeat(isSl ? null : f.id); }} />
        {isSl && (
          <g onClick={(e: any) => { e.stopPropagation(); delFeat(f.id); }} style={{ cursor: "pointer", pointerEvents: "all" }}>
            <circle cx={fx + fw} cy={fy} r={8} fill={S.red} />
            <text x={fx + fw} y={fy + 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">×</text>
          </g>
        )}
        {isSl && <text x={fx + fw / 2} y={fy - 6} textAnchor="middle" fill={col} fontSize="8" fontWeight="600">
          {f.type === "door" ? "Tür" : "Fenster"}
        </text>}
      </g>
    );
  });

  // Wand-Highlight wenn Feature platziert wird
  let wallHLEl: any = null;
  if (hovWall && addFeat) {
    const hr = visual.find(r => r.id === hovWall.rid);
    if (hr) {
      let lx1: number, ly1: number, lx2: number, ly2: number;
      if (hovWall.wall === "top") { lx1 = hr.x; ly1 = hr.y; lx2 = hr.x + hr.w; ly2 = hr.y; }
      else if (hovWall.wall === "bottom") { lx1 = hr.x; ly1 = hr.y + hr.h; lx2 = hr.x + hr.w; ly2 = hr.y + hr.h; }
      else if (hovWall.wall === "left") { lx1 = hr.x; ly1 = hr.y; lx2 = hr.x; ly2 = hr.y + hr.h; }
      else { lx1 = hr.x + hr.w; ly1 = hr.y; lx2 = hr.x + hr.w; ly2 = hr.y + hr.h; }
      wallHLEl = <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={addFeat === "door" ? S.accent : S.green} strokeWidth="5" opacity="0.45" strokeLinecap="round" />;
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed" as const, inset: 0, background: S.bg, zIndex: 1001, display: "flex", flexDirection: "column" as const, fontFamily: "Poppins, sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 12px", borderBottom: "1px solid #e3e3e6", background: S.white, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: S.primary }}>🏠 Grundriss-Editor</div>
          {onSwitchToList && (
            <button onClick={onSwitchToList}
              style={{ fontSize: 11, padding: "6px 12px", borderRadius: 8, border: "1px solid #d4d4d7", background: "#f5f5f7", color: S.g800, cursor: "pointer", fontWeight: 600 }}>
              📋 Liste
            </button>
          )}
        </div>
        <button onClick={onClose} style={{ fontSize: 12, padding: "8px 16px", borderRadius: 10, border: "1px solid #d4d4d7", background: S.white, color: S.primary, cursor: "pointer", fontWeight: 600 }}>
          ← Fertig
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ padding: "6px 10px", borderBottom: "1px solid #e3e3e6", display: "flex", flexWrap: "wrap" as const, gap: 4, alignItems: "center", background: "#fafafb" }}>
        {ROOM_TEMPLATES_V.map((p, i) => (
          <div key={i} draggable onDragStart={(e: any) => e.dataTransfer.setData("rp", JSON.stringify(p))}
            style={{ padding: "3px 8px", borderRadius: 7, fontSize: 10, cursor: "grab", fontWeight: 600, background: p.color, border: "1px solid #d4d4d7", color: S.primary, userSelect: "none" as const, display: "flex", alignItems: "center", gap: 3 }}>
            {p.icon} {p.name}
          </div>
        ))}
        <div style={{ width: 1, height: 18, background: "#e3e3e6", margin: "0 3px" }} />
        <TB label="🚪 Tür" active={addFeat === "door"} onClick={() => setAddFeat(v => v === "door" ? null : "door")} />
        <TB label="🪟 Fenster" active={addFeat === "window"} onClick={() => setAddFeat(v => v === "window" ? null : "window")} />
        <div style={{ width: 1, height: 18, background: "#e3e3e6", margin: "0 3px" }} />
        <TB label="↩ Undo" onClick={undo} disabled={!hist.length} />
        <TB label="↪ Redo" onClick={redo} disabled={!fut.length} />
        <TB label="⊡ Fit" onClick={zoomFit} />
        <span style={{ fontSize: 9, color: S.g700, marginLeft: 4 }}>{Math.round(zoom * 100)}% · ~{totalM2} m²</span>
        {features.length > 0 && (
          <span style={{ fontSize: 9, color: S.g700, marginLeft: 4 }}>
            · {features.filter(f => f.type === "door").length}🚪 {features.filter(f => f.type === "window").length}🪟
          </span>
        )}
      </div>

      {/* Preset bar */}
      <div style={{ padding: "4px 10px", borderBottom: "1px solid #f3f3f5", display: "flex", gap: 6, alignItems: "center", background: "#fff" }}>
        <span style={{ fontSize: 9, color: S.g700, fontWeight: 600 }}>Vorlagen:</span>
        {[["2-Zimmer", PRESET_2Z], ["3-Zimmer", PRESET_3Z]].map(([label, preset]) => (
          <button key={label} onClick={() => loadPreset(preset as VisualRoom[])}
            style={{ padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", border: "1px solid #d4e2ed", background: "#f0f6fb", color: S.accent }}>
            {label}
          </button>
        ))}
        {visual.length > 0 && (
          <button onClick={() => { pushH(); onChange([]); setVisual([]); setFeatures([]); }}
            style={{ padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 500, cursor: "pointer", border: "1px solid #fdcece", background: "#fff5f5", color: S.red, marginLeft: "auto" }}>
            Leeren
          </button>
        )}
      </div>

      {/* Canvas */}
      <div ref={ref} onDrop={onDrop} onDragOver={(e: any) => e.preventDefault()}
        onMouseDown={onCnvDown} onMouseMove={onMM} onMouseUp={onMU}
        onTouchStart={onCnvDown} onClick={onCnvClick}
        onTouchMove={(e: any) => { e.preventDefault(); if (isDraggingRef.current || resize || isPan) onMM(e); }}
        onTouchEnd={(e: any) => { if (isDraggingRef.current || resize || isPan) { e.preventDefault(); onMU(); } }}
        style={{ flex: 1, position: "relative", overflow: "hidden", touchAction: "none" as const,
          cursor: spRef.current || isPan ? "grab" : addFeat ? "crosshair" : drag ? "grabbing" : "default",
          backgroundImage: "radial-gradient(circle,#d4d4d7 0.5px,transparent 0.5px)",
          backgroundSize: (10 * zoom) + "px " + (10 * zoom) + "px",
          backgroundPosition: pan.x + "px " + pan.y + "px", backgroundColor: S.g200 }}>

        {onboard && visual.length === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, pointerEvents: "none" as const }}>
            <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 16, padding: "28px 36px", textAlign: "center" as const, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", maxWidth: 320 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏠</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: S.primary, marginBottom: 6 }}>Grundriss erstellen</div>
              <div style={{ fontSize: 12, color: S.g800, lineHeight: 1.5 }}>Ziehe Räume aus der Leiste oder wähle eine Vorlage.</div>
            </div>
          </div>
        )}

        <div style={{ position: "absolute", left: pan.x, top: pan.y, transformOrigin: "0 0", transform: "scale(" + zoom + ")" }}>

          <svg style={{ position: "absolute", left: 0, top: 0, width: 4000, height: 4000, pointerEvents: "none" as const, overflow: "visible", zIndex: 8 }}>
            {guides.map((g, i) =>
              g.t === "v" ? <line key={"g" + i} x1={g.x} y1={g.y1} x2={g.x} y2={g.y2} stroke={S.orange} strokeWidth="1.2" strokeDasharray="5 4" opacity="0.8" />
                : <line key={"g" + i} x1={g.x1} y1={g.y} x2={g.x2} y2={g.y} stroke={S.orange} strokeWidth="1.2" strokeDasharray="5 4" opacity="0.8" />
            )}
            {wallHLEl}
          </svg>

          <svg style={{ position: "absolute", left: 0, top: 0, width: 4000, height: 4000, overflow: "visible", zIndex: 12, pointerEvents: "none" as const }}>
            {featEls}
          </svg>

          {visual.map(r => {
            const isSl = sel.indexOf(r.id) >= 0;
            return (
              <div key={r.id} onMouseDown={(e: any) => onRmDown(e, r.id)} onTouchStart={(e: any) => onRmDown(e, r.id)}
                style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h,
                  background: r.color || "#e2e8f0",
                  border: isSl ? "2px solid #24a47d" : "1.5px solid #c4c4ca",
                  borderRadius: 6, cursor: addFeat ? "crosshair" : "grab",
                  display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
                  userSelect: "none" as const, zIndex: isSl ? 5 : 1,
                  boxShadow: isSl ? "0 0 0 3px rgba(36,164,125,0.15)" : "none" }}>
                <span style={{ fontSize: 18, lineHeight: 1, pointerEvents: "none" as const }}>{r.icon}</span>
                {editName === r.id ? (
                  <input autoFocus value={r.name} onChange={(e: any) => {
                    const newVisual = visual.map(x => x.id === r.id ? { ...x, name: e.target.value } : x);
                    setVisual(newVisual); syncToParent(newVisual);
                  }} onBlur={() => setEditName(null)} onKeyDown={(e: any) => e.key === "Enter" && setEditName(null)}
                    onClick={(e: any) => e.stopPropagation()}
                    style={{ width: r.w - 12, fontSize: 9, fontWeight: 700, textAlign: "center" as const, border: "none", background: "transparent", outline: "none", color: S.primary }} />
                ) : (
                  <span onDoubleClick={(e: any) => { e.stopPropagation(); setEditName(r.id); }}
                    style={{ fontSize: 10, fontWeight: 700, color: S.primary, cursor: "text", textAlign: "center" as const, padding: "0 3px", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                    {r.name}
                  </span>
                )}
                <span style={{ fontSize: 10, color: S.g700, pointerEvents: "none" as const, fontWeight: 600 }}>{r.size} m²</span>
                {isSl && sel.length === 1 && (
                  <div style={{ position: "absolute", top: -14, left: 0, width: "100%", textAlign: "center" as const, fontSize: 8, color: S.accent, fontWeight: 700, pointerEvents: "none" as const }}>
                    {r.w}×{r.h} px
                  </div>
                )}
                {isSl && !addFeat && (
                  <div>
                    <div onMouseDown={(e: any) => { e.stopPropagation(); pushH(); setResize({ id: r.id, sx: e.clientX, sy: e.clientY, sw: r.w, sh: r.h }); }}
                      onTouchStart={(e: any) => { e.stopPropagation(); e.preventDefault(); pushH(); const t = e.touches[0]; setResize({ id: r.id, sx: t.clientX, sy: t.clientY, sw: r.w, sh: r.h }); }}
                      style={{ position: "absolute", right: -5, bottom: -5, width: 12, height: 12, background: S.accent, borderRadius: 3, cursor: "nwse-resize", zIndex: 10, border: "1.5px solid #fff" }} />
                    <div onClick={(e: any) => { e.stopPropagation(); pushH(); const newVisual = visual.filter(x => x.id !== r.id); setVisual(newVisual); syncToParent(newVisual); setSel([]); }}
                      style={{ position: "absolute", top: -8, right: -8, width: 18, height: 18, background: S.red, color: "#fff", borderRadius: 9, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700, zIndex: 10, border: "1.5px solid #fff" }}>×</div>
                    <div onClick={(e: any) => { e.stopPropagation(); pushH(); const newVisual = visual.map(x => x.id === r.id ? { ...x, w: x.h, h: x.w } : x); setVisual(newVisual); syncToParent(newVisual); }}
                      style={{ position: "absolute", top: -8, left: -8, width: 18, height: 18, background: S.accent, color: "#fff", borderRadius: 9, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, border: "1.5px solid #fff" }}>↻</div>
                    <div onClick={(e: any) => { e.stopPropagation(); setColorPk(colorPk === r.id ? null : r.id); }}
                      style={{ position: "absolute", bottom: -8, left: -8, width: 18, height: 18, background: r.color || "#e2e8f0", border: "2px solid #828288", borderRadius: 9, cursor: "pointer", zIndex: 10 }} />
                  </div>
                )}
                {colorPk === r.id && (
                  <div onClick={(e: any) => e.stopPropagation()}
                    style={{ position: "absolute", bottom: -40, left: 0, background: "#fff", border: "1px solid #e3e3e6", borderRadius: 8, padding: "5px 6px", display: "flex", gap: 4, zIndex: 30, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                    {ROOM_COLORS.map(c => (
                      <div key={c} onClick={() => {
                        pushH(); const newVisual = visual.map(x => x.id === r.id ? { ...x, color: c } : x);
                        setVisual(newVisual); syncToParent(newVisual); setColorPk(null);
                      }}
                        style={{ width: 14, height: 14, borderRadius: 3, background: c, border: r.color === c ? "2px solid #24a47d" : "1px solid #c4c4ca", cursor: "pointer" }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ position: "absolute", bottom: 8, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {addFeat && <span style={{ fontSize: 10, color: "#fff", background: addFeat === "door" ? S.accent : S.green, padding: "3px 10px", borderRadius: 6, fontWeight: 600 }}>
            {addFeat === "door" ? "🚪 Tür" : "🪟 Fenster"} auf Wand klicken · ESC
          </span>}
          {selFeat && <span style={{ fontSize: 10, color: "#fff", background: S.orange, padding: "3px 10px", borderRadius: 6, fontWeight: 600 }}>
            Entf = löschen · ESC = abwählen
          </span>}
          <span style={{ fontSize: 9, color: S.g700, background: "rgba(255,255,255,0.9)", padding: "2px 8px", borderRadius: 5, marginLeft: "auto" }}>
            Scroll=Zoom · Space+Drag=Pan · Ctrl+Z/Y
          </span>
        </div>
      </div>
    </motion.div>
  );
}
