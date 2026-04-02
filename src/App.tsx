import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { WpHomeProvider, useWpHome, WpHomeData, HeatingType, BuildingAge, InsulationQuality, IncomeLevel } from "./store/wpHomeStore";
import ALL_TIPS from "./data/tips.json";
import RoomsEditor, { RoomsEditorCompact, Room } from "./components/RoomsEditor";

// ── Tip-Mapping: JSON → TIPS format ──────────────────────────────
type Tip = {
  id: number;
  t: string;       // title
  c: string;       // category
  ti: string;       // timing label
  wp: string;       // wp_plan
  s: Record<number, number>; // hg → savings
  desc: string;
};

function timingLabel(t: string): string {
  if (t === "sofort") return "Sofort";
  if (t === "mittel") return "Mittel";
  return "Langfristig";
}

function mapTips(allTips: any[], hg: number): Tip[] {
  return allTips
    .filter((t: any) => {
      if (!t.hg_levels || !Array.isArray(t.hg_levels)) return false;
      const minHg = Math.min(...t.hg_levels);
      const maxHg = Math.max(...t.hg_levels);
      return hg >= minHg && hg <= maxHg;
    })
    .map((t: any) => {
      const savings: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      const byHg = t.savings_by_hg || {};
      if (byHg.hg1 != null) savings[1] = byHg.hg1 || 0;
      if (byHg.hg2 != null) savings[2] = byHg.hg2 || 0;
      if (byHg.hg3 != null) savings[3] = byHg.hg3 || 0;
      if (byHg.hg4 != null) savings[4] = byHg.hg4 || 0;
      return {
        id: t.id,
        t: t.title,
        c: t.category,
        ti: timingLabel(t.timing),
        wp: t.wp_plan || "nein",
        s: savings,
        desc: t.description || "",
      };
    })
    .filter((t: Tip) => t.s[hg] > 0)
    .sort((a, b) => b.s[hg] - a.s[hg]);
}

// ── Personalization: filter + multiplier ──────────────────────────
const INCOME_ORDER: IncomeLevel[] = ['low', 'medium', 'high', 'very_high'];

function filterTipsByProfile(allTips: any[], profile: Pick<WpHomeData, 'heatingType' | 'buildingAge' | 'insulationQuality' | 'income' | 'hasGarden' | 'hasSolarPotential'>): any[] {
  return allTips.filter((t: any) => {
    if (t.heating_types && Array.isArray(t.heating_types)) {
      if (!t.heating_types.includes(profile.heatingType)) return false;
    }
    if (t.building_age_relevant && Array.isArray(t.building_age_relevant)) {
      if (!t.building_age_relevant.includes(profile.buildingAge)) return false;
    }
    if (t.income_level_min) {
      var tipMinIdx = INCOME_ORDER.indexOf(t.income_level_min);
      var userIdx = INCOME_ORDER.indexOf(profile.income);
      if (userIdx < tipMinIdx) return false;
    }
    if (t.requires_garden && !profile.hasGarden) return false;
    if (t.requires_solar && !profile.hasSolarPotential) return false;
    return true;
  });
}

function getSavingsMultiplier(buildingAge: BuildingAge, insulation: InsulationQuality): number {
  var ageFactor = buildingAge === 'pre1990' ? 1.3 : buildingAge === '1990to2010' ? 1.0 : 0.8;
  var insulFactor = insulation === 'poor' ? 1.25 : insulation === 'medium' ? 1.0 : 0.85;
  return ageFactor * insulFactor;
}

// ── Legacy fallback (hardcoded) ──────────────────────────────────
var TIPS_LEGACY = [
 {id:1,t:"Strom+Gas automatisch wechseln",c:"Energie",ti:"Sofort",wp:"Core",s:{1:200,2:696,3:1104,4:1500},desc:"Automatischer Wechselservice spart ohne Aufwand."},
 {id:2,t:"Gasanbieter wechseln",c:"Energie",ti:"Sofort",wp:"Core",s:{1:150,2:623,3:852,4:1075},desc:"Gastarif jährlich vergleichen und wechseln."},
 {id:3,t:"Stromanbieter wechseln",c:"Energie",ti:"Sofort",wp:"Core",s:{1:200,2:366,3:434,4:500},desc:"Stromtarif optimieren."},
 {id:4,t:"Smarte Thermostate",c:"Energie",ti:"Sofort",wp:"Plus",s:{1:60,2:133,3:167,4:200},desc:"Heizung automatisch regeln."},
 {id:5,t:"LED-Lampen einsetzen",c:"Energie",ti:"Sofort",wp:"Free",s:{1:80,2:200,3:250,4:300},desc:"Alle Glühbirnen durch LEDs ersetzen."},
 {id:6,t:"Standby eliminieren",c:"Energie",ti:"Sofort",wp:"Free",s:{1:50,2:80,3:100,4:115},desc:"Steckerleisten mit Schalter nutzen."},
 {id:7,t:"Heizung 1°C runter",c:"Energie",ti:"Sofort",wp:"Free",s:{1:40,2:60,3:90,4:120},desc:"1 Grad weniger spart ~6% Heizkosten."},
 {id:8,t:"Stosslüften",c:"Energie",ti:"Sofort",wp:"Free",s:{1:60,2:100,3:150,4:200},desc:"5 Min. Fenster auf statt Kipplüftung."},
 {id:9,t:"Sparduschkopf",c:"Energie",ti:"Sofort",wp:"Free",s:{1:80,2:120,3:160,4:200},desc:"Halbiert Wasserverbrauch beim Duschen."},
 {id:10,t:"CO2-Erstattung Vermieter",c:"Energie",ti:"Sofort",wp:"Plus",s:{1:30,2:50,3:80,4:120},desc:"Vermieter muss CO2-Kosten anteilig tragen."},
 {id:11,t:"Dynamischer Stromtarif",c:"Energie",ti:"Mittel",wp:"Plus",s:{1:0,2:100,3:200,4:400},desc:"Strom nutzen wenn er günstig ist."},
 {id:12,t:"Wärmepumpe",c:"Energie",ti:"Langfristig",wp:"Plus",s:{1:0,2:0,3:1800,4:2500},desc:"Langfristig die günstigste Heizung."},
 {id:13,t:"Solaranlage 10 kWp",c:"Energie",ti:"Langfristig",wp:"Plus",s:{1:0,2:0,3:1500,4:2200},desc:"Eigenstrom vom Dach."},
 {id:14,t:"Balkonkraftwerk",c:"Energie",ti:"Mittel",wp:"Plus",s:{1:100,2:130,3:160,4:180},desc:"Mini-Solar für die Steckdose."},
 {id:15,t:"Abos ausmisten",c:"Vertraege",ti:"Sofort",wp:"Plus",s:{1:100,2:150,3:200,4:300},desc:"Streaming, Fitness, Zeitschriften prüfen."},
 {id:16,t:"Handyvertrag wechseln",c:"Vertraege",ti:"Sofort",wp:"Plus",s:{1:60,2:120,3:180,4:240},desc:"Günstigere Tarife mit gleichem Netz."},
 {id:17,t:"Versicherungen vergleichen",c:"Versicherungen",ti:"Sofort",wp:"Plus",s:{1:100,2:200,3:300,4:500},desc:"Haftpflicht, Hausrat, KFZ jährlich checken."},
 {id:18,t:"Dispo umschulden",c:"Finanzen",ti:"Sofort",wp:"Plus",s:{1:200,2:300,3:400,4:600},desc:"Ratenkredit statt teurer Überziehung."},
 {id:19,t:"Tagesgeldkonto",c:"Finanzen",ti:"Sofort",wp:"Plus",s:{1:30,2:60,3:100,4:150},desc:"Geld auf Tagesgeld statt Girokonto."},
 {id:20,t:"Steuererklärung",c:"Steuern",ti:"Mittel",wp:"Plus",s:{1:100,2:300,3:500,4:800},desc:"Im Schnitt >1.000 € Erstattung."},
 {id:21,t:"Nebenkostenabr. prüfen",c:"Wohnen",ti:"Sofort",wp:"Plus",s:{1:50,2:80,3:120,4:200},desc:"Jede 2. Abrechnung ist fehlerhaft."},
 {id:22,t:"E-Auto-Förderung",c:"Mobilitaet",ti:"Sofort",wp:"Plus",s:{1:4000,2:4000,3:5000,4:5000},desc:"Staatliche Prämie für Elektroautos."},
 {id:23,t:"Carsharing",c:"Mobilitaet",ti:"Mittel",wp:"Nein",s:{1:1500,2:2500,3:3000,4:3500},desc:"Kein eigenes Auto nötig."},
 {id:24,t:"Deutschlandticket",c:"Mobilitaet",ti:"Sofort",wp:"Nein",s:{1:1200,2:1000,3:800,4:600},desc:"49€/Monat für den gesamten ÖPNV."},
 {id:25,t:"Mittagessen mitnehmen",c:"Essen",ti:"Sofort",wp:"Nein",s:{1:800,2:800,3:600,4:500},desc:"Meal-Prep statt Kantine."},
 {id:26,t:"Leitungswasser",c:"Essen",ti:"Sofort",wp:"Nein",s:{1:150,2:250,3:300,4:400},desc:"Kein Flaschenwasser mehr kaufen."},
 {id:27,t:"Fenster abdichten",c:"Energie",ti:"Sofort",wp:"Free",s:{1:30,2:50,3:70,4:100},desc:"Dichtungsband stoppt Zugluft."},
 {id:28,t:"Stromspar-Check",c:"Energie",ti:"Sofort",wp:"Plus",s:{1:90,2:120,3:180,4:250},desc:"Messgerät zeigt Stromfresser."},
 {id:29,t:"Wasserperlatoren",c:"Energie",ti:"Sofort",wp:"Plus",s:{1:30,2:40,3:60,4:80},desc:"Kleine Aufsätze für Wasserhähne."},
 {id:30,t:"Waschmaschine 30°C",c:"Energie",ti:"Sofort",wp:"Free",s:{1:25,2:40,3:55,4:70},desc:"Kaltwäsche reicht für normale Wäsche."}
];

// Category colors + icons
var CC: Record<string, string> = {
 Energie:"#2a6fa6",Invest:"#f9aa00",Wasser:"#0891b2",
 Vertraege:"#7c3aed",Finanzen:"#db2777",Wohnen:"#18466a",
 Mobilitaet:"#24a47d",Foerderung:"#167a52",Alltag:"#ef7520",
 Essen:"#d97706",Freizeit:"#a855f7",Steuern:"#6366f1",
 Gesundheit:"#10b981",Strom:"#3b82f6",
 Heizung:"#e65100",Warmwasser:"#0891b2",Gebaeude:"#795548",
 Solar:"#ff9800",Garten:"#4caf50",Versicherungen:"#9c27b0",
};

var CAT_ICONS: Record<string, string> = {
 Energie:"⚡",Strom:"⚡",Heizung:"🔥",Warmwasser:"🚿",Gebaeude:"🏠",
 Solar:"☀️",Garten:"🌿",Versicherungen:"🛡️",Vertraege:"📋",
 Finanzen:"💰",Wohnen:"🏠",Mobilitaet:"🚗",Foerderung:"🏛️",
 Alltag:"🏷️",Essen:"🍽️",Freizeit:"🎭",Steuern:"📊",
 Gesundheit:"❤️",Invest:"📈",Wasser:"💧",
};

var S = {bg:"#eef1f6",white:"#fff",primary:"#243c47",accent:"#2a6fa6",g100:"#fafafb",g200:"#f3f3f5",g300:"#e3e3e6",g400:"#d4d4d7",g500:"#c4c4ca",g600:"#b4b4bb",g700:"#a3a3a8",g800:"#828288",g900:"#595962",green:"#24a47d",dkGreen:"#167a52",ltGreen:"#d3ede5",yellow:"#f9aa00",ltYellow:"#feeecc",orange:"#ef7520",red:"#e93a3a",ltRed:"#fdcece",ltBlue:"#d4e2ed",dkBlue:"#18466a"};
function fmt(n: number) { return n.toLocaleString("de-DE"); }
function getPill(ti: string) {
 var b: any = {fontSize:10,padding:"2px 8px",borderRadius:200,fontWeight:600,display:"inline-block"};
 if (ti==="Sofort") return Object.assign({},b,{background:S.ltGreen,color:S.dkGreen});
 if (ti==="Mittel") return Object.assign({},b,{background:S.ltYellow,color:"#854d0e"});
 return Object.assign({},b,{background:S.ltRed,color:S.red});
}

var HEATING_LABELS: Record<string,string> = {
  gas:"Gas", oil:"Öl", heat_pump:"Wärmepumpe",
  district:"Fernwärme", electric:"Elektro", other:"Andere",
};
var BUILDING_LABELS: Record<string,string> = {
  pre1990:"Vor 1990", "1990to2010":"1990–2010", post2010:"Nach 2010",
};

// ── Animated Counter ────────────────────────────────────────────
function AnimatedCounter({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    const startTime = performance.now();
    const ms = duration * 1000;

    function tick(now: number) {
      const elapsed = now - startTime;
      const pct = Math.min(elapsed / ms, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - pct, 3);
      const current = Math.round(start + diff * ease);
      setDisplay(current);
      if (pct < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        ref.current = value;
      }
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <>{fmt(display)}</>;
}

// ── Progress Ring (SVG) ─────────────────────────────────────────
function ProgressRing({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - pct * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e3e3e6" strokeWidth="4" />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

// ── Tip Detail Modal (Mobile Bottom-Sheet) ─────────────────────
function TippModal(props: {tip: any, onClose: ()=>void, onDone?: (id: number)=>void}) {
 var tip=props.tip; if(!tip)return null;
 return(
 <motion.div
  onClick={props.onClose}
  initial={{opacity:0}}
  animate={{opacity:1}}
  exit={{opacity:0}}
  style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:0,WebkitOverflowScrolling:"touch"}}
 >
 <motion.div
  onClick={function(e){e.stopPropagation();}}
  initial={{y:"100%"}}
  animate={{y:0}}
  exit={{y:"100%"}}
  transition={{type:"spring",damping:30,stiffness:300}}
  style={{background:"#fff",borderRadius:"24px 24px 0 0",padding:"clamp(16px, 4vw, 20px)",maxWidth:640,width:"100%",boxShadow:"0 -8px 32px rgba(0,0,0,0.15)",maxHeight:"85vh",overflowY:"auto",WebkitOverflowScrolling:"touch"}}
 >
 {/* Handle bar */}
 <div style={{width:48,height:4,background:"#d4d4d7",borderRadius:2,margin:"0 auto 20px",flexShrink:0}}/>

 <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,alignItems:"flex-start"}}>
 <div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}><div style={{width:8,height:8,borderRadius:4,background:CC[tip.c as keyof typeof CC],flexShrink:0}}/><span style={{fontSize:11,color:S.g700,fontWeight:600}}>{tip.c}</span><span style={getPill(tip.ti)}>{tip.ti}</span></div><div style={{fontSize:18,fontWeight:700,color:S.primary,lineHeight:1.3}}>{tip.t}</div></div>
 <button onClick={props.onClose} style={{background:"#f1f5f9",border:"none",fontSize:20,cursor:"pointer",color:S.g600,width:44,height:44,minWidth:44,minHeight:44,borderRadius:12,flexShrink:0,marginLeft:8,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
 </div>
 <div style={{fontSize:14,color:S.g800,lineHeight:1.7,marginBottom:20}}>{tip.desc}</div>
 <div style={{display:"flex",gap:16,padding:"18px 0",borderTop:"1px solid #e3e3e6",borderBottom:"1px solid #e3e3e6",marginBottom:20}}>
 <div style={{flex:1,textAlign:"center" as const}}><div style={{fontSize:28,fontWeight:800,color:S.primary}}>{fmt(tip.sav)} €</div><div style={{fontSize:12,color:S.g700,marginTop:4}}>Ersparnis / Jahr</div></div>
 <div style={{width:1,background:"#e3e3e6"}}/>
 <div style={{flex:1,textAlign:"center" as const}}><div style={{fontSize:16,fontWeight:700,color:tip.wp==="Core"?S.green:S.accent}}>{tip.wp}</div><div style={{fontSize:12,color:S.g700,marginTop:4}}>Tarif</div></div>
 </div>
 <button onClick={function(){if(props.onDone)props.onDone(tip.id);props.onClose();}} style={{width:"100%",padding:"16px 0",borderRadius:14,border:"none",background:S.accent,color:"#fff",fontSize:"clamp(14px, 3.5vw, 15px)",fontWeight:700,cursor:"pointer",minHeight:56,touchAction:"manipulation"}}>Tipp umsetzen →</button>
 </motion.div>
 </motion.div>
 );
}

// ── Category Detail View ────────────────────────────────────────
function CategoryDetail({ cat, tips, done, onBack, onTipClick }: {
  cat: string; tips: any[]; done: Set<number>;
  onBack: () => void; onTipClick: (t: any) => void;
}) {
  var catTips = tips.filter(t => t.c === cat);
  var total = catTips.reduce((s, t) => s + t.sav, 0);
  var doneCount = catTips.filter(t => done.has(t.id)).length;
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: S.bg, padding: "clamp(12px, 3vw, 16px)", boxSizing: "border-box" as const, overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <button onClick={onBack} style={{
          fontSize: "clamp(12px, 3vw, 13px)", padding: "12px 20px", borderRadius: 12, border: "1px solid #d4d4d7",
          background: "#fff", color: S.g900, cursor: "pointer", fontWeight: 600, marginBottom: 16, minHeight: 52, touchAction: "manipulation",
        }}>← Zurück zum Dashboard</button>

        <div style={{
          background: "#fff", borderRadius: 16, padding: "18px 18px", marginBottom: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e3e3e6",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 0, flexWrap: "wrap" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: (CC[cat] || S.accent) + "18",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>{CAT_ICONS[cat] || "📌"}</div>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: S.primary }}>{cat}</div>
              <div style={{ fontSize: 12, color: S.g700 }}>{catTips.length} Tipps · {doneCount} erledigt</div>
            </div>
            <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: S.green }}>{fmt(total)} €</div>
              <div style={{ fontSize: 11, color: S.g700 }}>pro Jahr</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {catTips.map((t, i) => {
            var isDone = done.has(t.id);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onTipClick(t)}
                style={{
                  background: "#fff", borderRadius: 14, padding: "16px 16px",
                  border: "1px solid #e3e3e6", cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  opacity: isDone ? 0.55 : 1,
                  display: "flex", alignItems: "flex-start", gap: 12,
                  transition: "box-shadow 0.15s",
                  minHeight: 80, touchAction: "manipulation",
                }}
                onMouseEnter={(e: any) => e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.1)"}
                onMouseLeave={(e: any) => e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)"}
              >
                <span style={{ fontSize: 15, color: isDone ? S.green : S.g500, width: 24, flexShrink: 0, fontWeight: 700, textAlign: "center" }}>
                  {isDone ? "✓" : (i + 1)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: S.primary, textDecoration: isDone ? "line-through" : "none", marginBottom: 4, lineHeight: 1.4 }}>{t.t}</div>
                  <div style={{ fontSize: 12, color: S.g700, lineHeight: 1.5 }}>{t.desc?.slice(0, 90)}{t.desc?.length > 90 ? "..." : ""}</div>
                </div>
                <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: S.primary, marginBottom: 4 }}>{fmt(t.sav)} €</div>
                  <span style={getPill(t.ti)}>{t.ti}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──
function Dashboard() {
 var _mt=useState<any>(null),modalTip=_mt[0],setModalTip=_mt[1];
 var _done=useState<Set<number>>(new Set()),done=_done[0],setDone=_done[1];
 var _catView=useState<string|null>(null),catView=_catView[0],setCatView=_catView[1];
 var _rooms=useState<Room[]>(() => {
  try { const saved = localStorage.getItem('wp_rooms'); return saved ? JSON.parse(saved) : []; } catch { return []; }
 }),rooms=_rooms[0],setRoomsRaw=_rooms[1];
 function setRooms(r: Room[]) { setRoomsRaw(r); localStorage.setItem('wp_rooms', JSON.stringify(r)); }
 var _showRooms=useState(false),showRooms=_showRooms[0],setShowRooms=_showRooms[1];

 function markDone(id: number) {
  setDone(function(prev) { var n = new Set(prev); n.add(id); return n; });
 }

 // Wizard store
 var wpCtx = useWpHome();
 var wData = wpCtx.data;
 var wWizardDone = wData.wizardDone;

 var wPersons = wData.household.persons;
 function personsToHG(p: number) { if (p<=1) return 1; if (p===2) return 2; if (p<=4) return 3; return 4; }
 var effectiveHG = personsToHG(wPersons);

 var profileData = {
   heatingType: wData.heatingType || 'gas' as HeatingType,
   buildingAge: wData.buildingAge || '1990to2010' as BuildingAge,
   insulationQuality: wData.insulationQuality || 'medium' as InsulationQuality,
   income: wData.income || 'medium' as IncomeLevel,
   hasGarden: wData.hasGarden || false,
   hasSolarPotential: wData.hasSolarPotential || false,
 };
 var savingsMultiplier = getSavingsMultiplier(profileData.buildingAge as BuildingAge, profileData.insulationQuality as InsulationQuality);

 var tips = useMemo(function(){
   var filtered = filterTipsByProfile(ALL_TIPS, profileData as any);
   var computed = mapTips(filtered, effectiveHG);
   if (computed.length === 0) {
     return TIPS_LEGACY.map(function(t){return Object.assign({},t,{sav:t.s[effectiveHG as keyof typeof t.s]||0});}).filter(function(t){return t.sav>0;}).sort(function(a,b){return b.sav-a.sav;});
   }
   return computed.map(function(t){
     var baseSav = t.s[effectiveHG] || 0;
     var cat = t.c;
     var multiplied = (cat === 'Heizung' || cat === 'Gebaeude' || cat === 'Energie') ? Math.round(baseSav * savingsMultiplier) : baseSav;
     return Object.assign({}, t, {sav: multiplied});
   }).filter(function(t){return t.sav>0;}).sort(function(a,b){return b.sav-a.sav;});
 }, [effectiveHG, profileData.heatingType, profileData.buildingAge, profileData.insulationQuality, profileData.income, profileData.hasGarden, profileData.hasSolarPotential]);

 var total = useMemo(function(){return tips.reduce(function(s,t){return s+t.sav;},0);}, [tips]);

 // Category breakdown for cards
 var catData = useMemo(function() {
  var m: Record<string, { total: number; done: number; sav: number; tips: any[] }> = {};
  tips.forEach(function(t) {
   if (!m[t.c]) m[t.c] = { total: 0, done: 0, sav: 0, tips: [] };
   m[t.c].total++;
   m[t.c].sav += t.sav;
   m[t.c].tips.push(t);
   if (done.has(t.id)) m[t.c].done++;
  });
  return Object.entries(m)
   .sort(function(a, b) { return b[1].sav - a[1].sav; })
   .map(function(arr) {
    return { cat: arr[0], total: arr[1].total, done: arr[1].done, sav: arr[1].sav, pct: arr[1].total > 0 ? arr[1].done / arr[1].total : 0 };
   });
 }, [tips, done]);

 // Sofort tips (top 3)
 var sofortTips = useMemo(function() {
  return tips.filter(function(t) { return t.ti === "Sofort" && !done.has(t.id); }).slice(0, 3);
 }, [tips, done]);

 // ── Wizard redirect ─────────────────────────────────────────────
 if (!wWizardDone) {
  window.location.href = '/apps/wpilot-home/wizard.html';
  return null;
 }

 // ── Category detail view ────────────────────────────────────────
 if (catView) {
  return (
   <>
    <CategoryDetail cat={catView} tips={tips} done={done} onBack={() => setCatView(null)} onTipClick={setModalTip} />
    <TippModal tip={modalTip} onDone={markDone} onClose={() => setModalTip(null)} />
   </>
  );
 }

 // ── Spar-Dashboard ──────────────────────────────────────────────
 return (
 <div style={{width:"100%",minHeight:"100vh",background:S.bg,boxSizing:"border-box" as const,overflowX:"hidden"}}>
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');*{font-family:Poppins,sans-serif;box-sizing:border-box;margin:0;padding:0;}
  html,body{overflow-x:hidden;max-width:100vw;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;}
  *{-webkit-tap-highlight-color:transparent;}
  .wp-cat-grid{display:grid;gap:10px;grid-template-columns:repeat(2,1fr);}
  @media(min-width:480px){.wp-cat-grid{grid-template-columns:repeat(3,1fr);}}
  @media(min-width:768px){.wp-cat-grid{grid-template-columns:repeat(4,1fr);}}
  @media(min-width:1024px){.wp-cat-grid{grid-template-columns:repeat(5,1fr);}}
  .wp-sofort-grid{display:grid;gap:12px;grid-template-columns:1fr;}
  @media(min-width:640px){.wp-sofort-grid{grid-template-columns:repeat(2,1fr);}}
  @media(min-width:900px){.wp-sofort-grid{grid-template-columns:repeat(3,1fr);}}
  button,a,[role="button"]{-webkit-tap-highlight-color:transparent;touch-action:manipulation;cursor:pointer;}
  button:active,a:active,[role="button"]:active{opacity:0.7;}
  input,select,textarea{font-size:16px!important;-webkit-appearance:none;border-radius:12px;}
  img{max-width:100%;height:auto;}
  `}</style>

  <div style={{maxWidth:900,margin:"0 auto",padding:"16px 12px 40px"}}>

   {/* Header */}
   <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
    <div>
     <div style={{fontSize:"clamp(9px, 2.5vw, 10px)",fontWeight:700,color:S.accent,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Wechselpilot Home</div>
     <div style={{fontSize:"clamp(18px, 5vw, 20px)",fontWeight:800,color:S.primary}}>Dein Spar-Dashboard</div>
    </div>
   </div>

   {/* ── Hero Row: Savings + Flugspiel ──────────────────────────── */}
   <div className="wp-hero-row" style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" as const }}>
   <style>{`@media(max-width:600px){.wp-hero-row{flex-direction:column;}}`}</style>
   <motion.div
    className="wp-hero-main"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{
     background: "linear-gradient(135deg, #0f4c3a 0%, #1a6b52 40%, #24a47d 100%)",
     borderRadius: 18, padding: "clamp(20px, 5vw, 24px)", flex: "1 1 60%", minWidth: 260,
     color: "#fff", position: "relative" as const, overflow: "hidden",
     boxShadow: "0 8px 32px rgba(36,164,125,0.25)",
    }}
   >
    {/* Decorative circles */}
    <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: 60, background: "rgba(255,255,255,0.06)" }} />
    <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: 40, background: "rgba(255,255,255,0.04)" }} />

    <div style={{ position: "relative" as const, zIndex: 1 }}>
     <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, marginBottom: 8, letterSpacing: "0.05em" }}>
      Dein gesamtes Sparpotenzial pro Jahr
     </div>
     <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
      <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, letterSpacing: "-2px" }}>
       <AnimatedCounter value={total} />
      </span>
      <span style={{ fontSize: 20, fontWeight: 700, opacity: 0.8 }}>€</span>
     </div>
     <div style={{ fontSize: 12, opacity: 0.7 }}>
      basierend auf {tips.length} personalisierten Tipps
     </div>

     {/* ── Nächster Spartipp (in Hero Box) ─────────────────────── */}
     {sofortTips.length > 0 && (
      <div
       onClick={() => setModalTip(sofortTips[0])}
       style={{
        background: "rgba(255,255,255,0.13)", borderRadius: 14, padding: "12px 14px",
        marginTop: 16, cursor: "pointer", backdropFilter: "blur(4px)",
        border: "1px solid rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", gap: 12,
        transition: "background 0.15s",
       }}
       onMouseEnter={(e: any) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
       onMouseLeave={(e: any) => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; }}
      >
       <div style={{
        width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
       }}>💡</div>
       <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.75, marginBottom: 2, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
         Nächster Spartipp
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
         {sofortTips[0].t}
        </div>
       </div>
       <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>{fmt(sofortTips[0].sav)} €</div>
        <div style={{ fontSize: 10, opacity: 0.7 }}>pro Jahr</div>
       </div>
      </div>
     )}

     <div style={{
      display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" as const,
     }}>
      <div style={{
       background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px",
       backdropFilter: "blur(4px)", flex: "1 1 0", minWidth: "100px",
      }}>
       <div style={{ fontSize: 18, fontWeight: 700 }}>
        <AnimatedCounter value={tips.filter(t => t.ti === "Sofort").reduce((s, t) => s + t.sav, 0)} />
        <span style={{ fontSize: 13, marginLeft: 2 }}>€</span>
       </div>
       <div style={{ fontSize: 10, opacity: 0.8 }}>Sofort umsetzbar</div>
      </div>
      <div style={{
       background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px",
       backdropFilter: "blur(4px)", flex: "1 1 0", minWidth: "80px",
      }}>
       <div style={{ fontSize: 18, fontWeight: 700 }}>{catData.length}</div>
       <div style={{ fontSize: 10, opacity: 0.8 }}>Kategorien</div>
      </div>
      <div style={{
       background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px",
       backdropFilter: "blur(4px)", flex: "1 1 0", minWidth: "100px",
      }}>
       <div style={{ fontSize: 18, fontWeight: 700 }}>{tips.filter(t => done.has(t.id)).length}/{tips.length}</div>
       <div style={{ fontSize: 10, opacity: 0.8 }}>Erledigt</div>
      </div>
     </div>
    </div>
   </motion.div>

   {/* ── Flugspiel Home-Lager (Live) ─────────────────────────── */}
   <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    style={{
     borderRadius: 18, flex: "1 1 35%", minWidth: 200, minHeight: 250,
     position: "relative" as const, overflow: "hidden",
     boxShadow: "0 8px 32px rgba(15,52,96,0.3)",
     cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
     background: "#1a1a2e",
    }}
    onClick={() => { window.location.href = "/apps/flugspiel/"; }}
    onMouseEnter={(e: any) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(15,52,96,0.4)"; }}
    onMouseLeave={(e: any) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(15,52,96,0.3)"; }}
   >
    {/* Live game iframe */}
    <iframe
     src="/apps/flugspiel/?embed"
     style={{
      width: "100%", height: "100%",
      border: "none", pointerEvents: "none",
      position: "absolute", top: 0, left: 0,
     }}
     title="Flugspiel"
     loading="lazy"
    />
    {/* Overlay with label + click catcher */}
    <div style={{
     position: "absolute", inset: 0, zIndex: 2,
     background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)",
     display: "flex", flexDirection: "column" as const, justifyContent: "flex-end",
     padding: "14px 16px", color: "#fff", minHeight: 220,
    }}>
     <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 2 }}>
      Home-Lager
     </div>
     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontSize: 15, fontWeight: 700 }}>✈️ Flugspiel</div>
      <div style={{
       fontSize: 11, fontWeight: 600, background: "rgba(255,255,255,0.15)",
       borderRadius: 8, padding: "4px 10px", backdropFilter: "blur(4px)",
      }}>
       Spielen →
      </div>
     </div>
    </div>
   </motion.div>

   </div>{/* end hero row */}

   {/* ── Kategorie-Cards ──────────────────────────────────────── */}
   <div style={{ marginBottom: 24 }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: S.primary, marginBottom: 12 }}>
     Sparen nach Kategorie
    </div>
    <div className="wp-cat-grid">
     {catData.map((cp, i) => (
      <motion.div
       key={cp.cat}
       initial={{ opacity: 0, y: 15 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: i * 0.05, duration: 0.3 }}
       onClick={() => setCatView(cp.cat)}
       style={{
        background: "#fff", borderRadius: 14, padding: "16px 12px",
        border: "1px solid #e3e3e6", cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column" as const, alignItems: "center",
        gap: 6, transition: "box-shadow 0.2s, transform 0.15s",
        minHeight: 140, touchAction: "manipulation",
       }}
       onMouseEnter={(e: any) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
       onMouseLeave={(e: any) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
       {/* Progress Ring + Icon */}
       <div style={{ position: "relative" as const, width: 48, height: 48 }}>
        <ProgressRing pct={cp.pct} color={CC[cp.cat] || S.accent} size={48} />
        <div style={{
         position: "absolute", inset: 0, display: "flex", alignItems: "center",
         justifyContent: "center", fontSize: 18,
        }}>
         {CAT_ICONS[cp.cat] || "📌"}
        </div>
       </div>

       <div style={{ fontSize: 12, fontWeight: 700, color: S.primary, textAlign: "center" as const }}>
        {cp.cat}
       </div>
       <div style={{ fontSize: 10, color: S.g700 }}>
        {cp.total} Tipps
       </div>
       <div style={{
        fontSize: 14, fontWeight: 800, color: S.green,
       }}>
        {fmt(cp.sav)} €
       </div>
       <div style={{ fontSize: 9, color: S.g700, fontWeight: 500 }}>
        {cp.done}/{cp.total} erledigt
       </div>
      </motion.div>
     ))}
    </div>
   </div>

   {/* ── Wohnung / Räume-Editor ──────────────────────────────── */}
   <div style={{ marginBottom: 20 }}>
    <RoomsEditorCompact rooms={rooms} onClick={() => setShowRooms(true)} />
   </div>
   {showRooms && <RoomsEditor rooms={rooms} onChange={setRooms} onClose={() => setShowRooms(false)} />}

   {/* ── Sofort-Tipps Sektion ─────────────────────────────────── */}
   {sofortTips.length > 0 && (
    <div style={{ marginBottom: 24 }}>
     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
      <div style={{
       width: 32, height: 32, borderRadius: 10,
       background: S.ltGreen, display: "flex", alignItems: "center",
       justifyContent: "center", fontSize: 16,
      }}>⚡</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: S.primary }}>
       Sofort umsetzbar
      </div>
      <span style={{ fontSize: 12, color: S.g700 }}>— starte hier!</span>
     </div>

     <div className="wp-sofort-grid">
      {sofortTips.map((tip, i) => (
       <motion.div
        key={tip.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + i * 0.08 }}
        onClick={() => setModalTip(tip)}
        style={{
         background: "#fff", borderRadius: 16, padding: "16px 16px 14px",
         border: "1px solid #e3e3e6", cursor: "pointer",
         boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
         transition: "box-shadow 0.2s, transform 0.15s",
         display: "flex", flexDirection: "column" as const, gap: 10,
         minHeight: 160, touchAction: "manipulation",
        }}
        onMouseEnter={(e: any) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e: any) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
       >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
         <div style={{
          width: 10, height: 10, borderRadius: 5,
          background: CC[tip.c] || S.accent, flexShrink: 0,
         }} />
         <span style={{ fontSize: 11, fontWeight: 600, color: S.g700 }}>{tip.c}</span>
         <span style={getPill(tip.ti)}>{tip.ti}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: S.primary, lineHeight: 1.4 }}>
         {tip.t}
        </div>
        <div style={{ fontSize: 12, color: S.g800, lineHeight: 1.5 }}>
         {tip.desc?.slice(0, 95)}{tip.desc?.length > 95 ? "..." : ""}
        </div>
        <div style={{
         marginTop: "auto",
         display: "flex", justifyContent: "space-between", alignItems: "center",
         paddingTop: 12, borderTop: "1px solid #f3f3f5",
        }}>
         <span style={{ fontSize: 20, fontWeight: 800, color: S.green }}>{fmt(tip.sav)} €</span>
         <span style={{ fontSize: 11, color: S.accent, fontWeight: 600 }}>Details →</span>
        </div>
       </motion.div>
      ))}
     </div>
    </div>
   )}

   {/* ── Personalisierungs-Badge ──────────────────────────────── */}
   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    style={{
     background: "linear-gradient(135deg, #f0f6fb 0%, #fff 100%)",
     borderRadius: 16, padding: "16px 16px", marginBottom: 20,
     border: "1px solid #d4e2ed",
     display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" as const,
    }}
   >
    <div style={{
     width: 40, height: 40, borderRadius: 10,
     background: S.ltBlue, display: "flex", alignItems: "center",
     justifyContent: "center", fontSize: 18, flexShrink: 0,
    }}>🎯</div>
    <div style={{ flex: 1, minWidth: "200px" }}>
     <div style={{ fontSize: 13, fontWeight: 700, color: S.primary, marginBottom: 6 }}>
      Basierend auf deinem Profil
     </div>
     <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
      {[
       { l: "Heizung", v: HEATING_LABELS[profileData.heatingType] || profileData.heatingType },
       { l: "Baujahr", v: BUILDING_LABELS[profileData.buildingAge] || profileData.buildingAge },
       { l: wData.household.persons + " Personen" },
       { l: wData.household.propertyType === "house" ? "Haus" : "Wohnung" },
       ...(profileData.hasGarden ? [{ l: "Garten" }] : []),
       ...(profileData.hasSolarPotential ? [{ l: "Solar" }] : []),
      ].map((tag, i) => (
       <span key={i} style={{
        fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 200,
        background: "#fff", border: "1px solid #d4e2ed", color: S.accent,
       }}>
        {tag.v ? `${tag.l}: ${tag.v}` : tag.l}
       </span>
      ))}
     </div>
    </div>
   </motion.div>

   {/* ── Wizard wiederholen Button ────────────────────────────── */}
   <div style={{ textAlign: "center" as const, paddingTop: 8 }}>
    <button
     onClick={() => { wpCtx.resetWizard(); window.location.href = '/apps/wpilot-home/wizard.html'; }}
     style={{
      fontSize: 13, fontWeight: 600, color: S.g700,
      background: "none", border: "1px solid #d4d4d7",
      borderRadius: 12, padding: "12px 24px", cursor: "pointer",
      transition: "all 0.15s", minHeight: 52, touchAction: "manipulation",
     }}
     onMouseEnter={(e: any) => { e.currentTarget.style.background = "#f3f3f5"; }}
     onMouseLeave={(e: any) => { e.currentTarget.style.background = "none"; }}
    >
     Wizard wiederholen
    </button>
   </div>

  </div>

  {/* Tip Modal */}
  <TippModal tip={modalTip} onDone={markDone} onClose={() => setModalTip(null)} />
 </div>
 );
}

export default function App() {
 return (
  <WpHomeProvider>
   <Dashboard />
  </WpHomeProvider>
 );
}
