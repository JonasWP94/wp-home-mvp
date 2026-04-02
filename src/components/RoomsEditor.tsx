import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Room Types ──
const ROOM_TEMPLATES = [
  { name: "Wohnzimmer", icon: "🛋️", color: "#e2e8f0", defaultSize: 25 },
  { name: "Schlafzimmer", icon: "🛏️", color: "#e8e2f0", defaultSize: 16 },
  { name: "Küche", icon: "🍳", color: "#f0ece2", defaultSize: 12 },
  { name: "Bad", icon: "🚿", color: "#e2ecf0", defaultSize: 8 },
  { name: "Kinderzimmer", icon: "🧸", color: "#fce9d2", defaultSize: 14 },
  { name: "Arbeitszimmer", icon: "💻", color: "#d3ede5", defaultSize: 12 },
  { name: "Flur", icon: "🚪", color: "#e8e9ec", defaultSize: 8 },
  { name: "Balkon", icon: "🌿", color: "#d4e2ed", defaultSize: 6 },
];

export interface Room {
  id: string;
  name: string;
  icon: string;
  color: string;
  size: number; // m²
}

interface Props {
  rooms: Room[];
  onChange: (rooms: Room[]) => void;
  onClose: () => void;
}

const S = {
  primary: "#243c47",
  accent: "#24a47d",
  green: "#16a34a",
  g100: "#f5f5f7",
  g300: "#d4d4d7",
  g700: "#6b6b7b",
  g800: "#3a3a4a",
  bg: "#f8f8fa",
  white: "#fff",
};

export function RoomsEditorCompact({ rooms, onClick }: { rooms: Room[]; onClick: () => void }) {
  const totalSize = rooms.reduce((s, r) => s + r.size, 0);

  return (
    <div
      onClick={onClick}
      style={{
        background: S.white, borderRadius: 16, padding: "16px",
        border: "1px solid #e3e3e6", cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s, transform 0.15s",
        touchAction: "manipulation",
      }}
      onMouseEnter={(e: any) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e: any) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: S.primary }}>🏠 Meine Wohnung</div>
        <span style={{ fontSize: 12, color: S.accent, fontWeight: 600 }}>Bearbeiten →</span>
      </div>
      {rooms.length === 0 ? (
        <div style={{ fontSize: 13, color: S.g700 }}>Tippe hier um deine Räume einzurichten</div>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 8 }}>
            {rooms.map(r => (
              <span key={r.id} style={{
                fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 200,
                background: r.color, color: S.primary, display: "flex", alignItems: "center", gap: 4,
              }}>
                {r.icon} {r.name} ({r.size}m²)
              </span>
            ))}
          </div>
          <div style={{ fontSize: 12, color: S.g700 }}>
            {rooms.length} Räume · {totalSize} m² gesamt
          </div>
        </>
      )}
    </div>
  );
}

export default function RoomsEditor({ rooms, onChange, onClose }: Props) {
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const totalSize = rooms.reduce((s, r) => s + r.size, 0);

  function addRoom(template: typeof ROOM_TEMPLATES[0]) {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: template.name,
      icon: template.icon,
      color: template.color,
      size: template.defaultSize,
    };
    onChange([...rooms, newRoom]);
  }

  function removeRoom(id: string) {
    onChange(rooms.filter(r => r.id !== id));
    if (editRoom?.id === id) setEditRoom(null);
  }

  function updateSize(id: string, size: number) {
    onChange(rooms.map(r => r.id === id ? { ...r, size } : r));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed" as const, inset: 0, background: S.bg, zIndex: 1000,
        display: "flex", flexDirection: "column" as const,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 16px 12px", borderBottom: "1px solid #e3e3e6",
        background: S.white,
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: S.primary }}>🏠 Räume bearbeiten</div>
        <button
          onClick={onClose}
          style={{
            fontSize: 12, padding: "8px 16px", borderRadius: 10,
            border: "1px solid #d4d4d7", background: S.white,
            color: S.primary, cursor: "pointer", fontWeight: 600,
          }}
        >
          ← Fertig
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {/* Summary */}
          <div style={{
            background: "linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)",
            borderRadius: 16, padding: "16px 18px", color: "#fff", marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, marginBottom: 4 }}>Gesamtfläche</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{totalSize} m²</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{rooms.length} Räume</div>
          </div>

          {/* Current rooms */}
          {rooms.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.primary, marginBottom: 10 }}>Deine Räume</div>
              {rooms.map(r => (
                <div key={r.id} style={{
                  background: S.white, borderRadius: 14, padding: "12px 14px",
                  border: "1px solid #e3e3e6", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: r.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>{r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: S.primary }}>{r.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <input
                        type="range"
                        min={4}
                        max={80}
                        value={r.size}
                        onChange={(e) => updateSize(r.id, parseInt(e.target.value))}
                        style={{ flex: 1, accentColor: S.accent }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 700, color: S.accent, minWidth: 45, textAlign: "right" as const }}>
                        {r.size} m²
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeRoom(r.id)}
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: "1px solid #e3e3e6",
                      background: "none", cursor: "pointer", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#ef4444", flexShrink: 0,
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Add room templates */}
          <div style={{ fontSize: 13, fontWeight: 700, color: S.primary, marginBottom: 10 }}>Raum hinzufügen</div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8,
          }}>
            {ROOM_TEMPLATES.map(t => (
              <button
                key={t.name}
                onClick={() => addRoom(t)}
                style={{
                  background: S.white, borderRadius: 14, padding: "14px 12px",
                  border: "1px solid #e3e3e6", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 10,
                  transition: "all 0.15s", touchAction: "manipulation",
                }}
                onMouseEnter={(e: any) => { e.currentTarget.style.background = t.color; }}
                onMouseLeave={(e: any) => { e.currentTarget.style.background = S.white; }}
              >
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <div style={{ textAlign: "left" as const }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: S.primary }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: S.g700 }}>~{t.defaultSize} m²</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
