// ── Wechselpilot Design Tokens ──
// Synchronisiert mit /Downloads/wechselpilot-design-tokens.json (W3C Design Tokens)
// Quelle: offizielles Brand-System Wechselpilot

// ── Brand Colors ────────────────────────────────────────────────
export const PRIMARY     = '#3D5261';   // brand.primary — Dunkelblau, Headings, Header
export const SECONDARY   = '#EEF1F6';   // legacy alias (very light)
export const TERTIARY    = '#44607F';   // brand.text — Fließtext-Farbe
export const ACCENT      = '#F9AA00';   // brand.accent — Gelb/Orange (CTA-Akzent!)
export const DISABLED    = '#C2C7CB';   // semantic.muted / border

// Theme
export const WHITE         = '#FFFFFF';
export const WHITE_TINTED  = '#FAFAFB';
export const BLACK         = '#0A0A0A';

// Yellow / Orange (Accent-Familie)
export const YELLOW        = '#F9AA00';
export const YELLOW_BRIGHT = '#FEEECC';
export const ORANGE        = '#E0651F';
export const ORANGE_BRIGHT = '#FCE9D2';

// Red
export const RED           = '#EF4444';
export const RED_BRIGHT    = '#FDCECE';

// Green (Sage-/Brand-Green — gedämpft, nicht knallig)
export const GREEN         = '#558D6D';   // brand.green
export const GREEN_DARK    = '#436F56';   // brand.greenDark
export const GREEN_LIGHT   = '#6C977C';   // brand.greenLight
export const GREEN_BRIGHT  = '#E2EEE7';   // sehr heller Tint (für Backgrounds)

// Blue (light — Gas-Claim Blau)
export const BLUE              = '#5782B0';   // brand.blueLight
export const BLUE_DARK         = '#3D5261';
export const BLUE_BRIGHT       = '#D4E2ED';
export const BLUE_VERY_BRIGHT  = '#EEF1F6';

// Greys (aligned mit Muted #C2C7CB als Pivot)
export const GREY_100  = '#FAFAFB';
export const GREY_200  = '#F3F3F5';
export const GREY_300  = '#E0E3E6';
export const GREY_400  = '#D4D7DA';
export const GREY_500  = '#C2C7CB';   // = semantic.muted/border
export const GREY_600  = '#A8AEB3';
export const GREY_700  = '#7E8990';
export const GREY_800  = '#5E6B73';
export const GREY_900  = '#44607F';   // = brand.text
export const GREY_1000 = '#2C3C4A';

// Aliases used in components
export const TEXT       = TERTIARY;      // brand.text #44607F
export const TEXT_MUTED = GREY_700;
export const TEXT_DIM   = GREY_600;
export const BORDER     = GREY_500;      // #C2C7CB
export const BG         = '#F4F4F4';     // brand.background

// ── Radii ───────────────────────────────────────────────────────
export const RADIUS_XS   = 2;    // borderRadius.sm
export const RADIUS_SM   = 4;    // borderRadius.md
export const RADIUS_MD   = 6;    // borderRadius.lg — Projekt-Standard
export const RADIUS_LG   = 6;
export const RADIUS_XL   = 6;
export const RADIUS_FULL = 9999; // borderRadius.full

// ── Typography (px) ─────────────────────────────────────────────
export const TEXT_META = 11;   // xs
export const TEXT_XS   = 11;
export const TEXT_SM   = 14;   // small / labels
export const TEXT_MD   = 16;   // body / h4
export const TEXT_MLD  = 18;   // h3 / card-title
export const TEXT_LG   = 22;   // h2 / section-title
export const TEXT_XL   = 28;   // h1
export const TEXT_2XL  = 30;   // große Beträge
export const TEXT_3XL  = 40;
export const TEXT_4XL  = 48;

// Weights
export const FW_REGULAR  = 400;
export const FW_MEDIUM   = 500;
export const FW_SEMIBOLD = 600;
export const FW_BOLD     = 700;

// Letter-Spacing (für Eyebrows + Section-Labels)
export const LS_WIDE     = '0.05em';
export const LS_WIDER    = '0.12em';   // section labels
export const LS_WIDEST   = '0.15em';   // eyebrow / mini-labels

// ── Shadow ──────────────────────────────────────────────────────
export const SHADOW_SM      = '0 1px 2px 0 rgba(0,0,0,0.10)';
export const SHADOW_MD      = '0 4px 12px 0 rgba(0,0,0,0.06)';   // card
export const SHADOW_ELEGANT = '0 10px 30px -10px rgba(61,82,97,0.20)';

// ── Motion ──────────────────────────────────────────────────────
export const DUR_FAST   = 200;
export const DUR_BASE   = 300;
export const EASE_OUT   = [0.22, 1, 0.36, 1] as const;
export const EASE_INOUT = [0.4, 0, 0.2, 1] as const;
