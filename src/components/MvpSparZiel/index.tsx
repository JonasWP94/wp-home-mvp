import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconTrendingDown,
  IconBolt,
  IconLeaf,
  IconRocket,
  IconClock,
  IconTool,
  IconMinus,
  IconCpu,
  IconBuildingCommunity,
  IconCheck,
} from '@tabler/icons-react';
import {
  ACCENT, BLUE_VERY_BRIGHT, BLUE_DARK,
  PRIMARY, BG, WHITE, BORDER, GREY_800, GREY_200,
  RADIUS_MD, RADIUS_SM,
  TEXT_XS, TEXT_SM, TEXT_MD, TEXT_LG,
  FW_REGULAR, FW_SEMIBOLD, FW_BOLD,
} from '../_tokens';
import WpHeader from '../_WpHeader';
import WpBottomNav from '../_WpBottomNav';

export interface SparZielData {
  sparziel: string;
  zeitaufwand: string;
  investitionen: string;
}

interface Props {
  onDone: (data: SparZielData) => void;
  onBack: () => void;
}

const SPARZIELE = [
  { value: 'Laufende Kosten senken', sub: 'Dauerhaft monatliche Ausgaben reduzieren', Icon: IconTrendingDown },
  { value: 'Einmalig viel sparen',   sub: 'Den größten Hebel jetzt identifizieren',    Icon: IconBolt },
  { value: 'Ökologisch & sparsam',   sub: 'Nachhaltigkeit und Kostenoptimierung',      Icon: IconLeaf },
];

const ZEITAUFWAND = [
  { value: 'Mühelos',  sub: 'Sofort umsetzbar',     Icon: IconRocket },
  { value: 'Moderat',  sub: 'Paar Stunden / Monat', Icon: IconClock },
  { value: 'Intensiv', sub: 'Maximale Ersparnis',   Icon: IconTool },
];

const INVESTITIONEN = [
  { value: 'Keine',           sub: 'Nur kostenfrei',          Icon: IconMinus },
  { value: 'Kleine Gadgets',  sub: 'Bis ca. 100 €',           Icon: IconCpu },
  { value: 'Große Projekte',  sub: 'Sanierung & Umbau',       Icon: IconBuildingCommunity },
];

function OptionCard({
  icon: Icon, label, sub, selected, onClick,
}: {
  icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
  label: string; sub: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: selected ? BLUE_VERY_BRIGHT : WHITE,
        border: `1.5px solid ${selected ? ACCENT : BORDER}`,
        borderRadius: RADIUS_MD,
        padding: '10px 12px',
        display: 'flex', flexDirection: 'row',
        alignItems: 'center', gap: 10,
        cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' as const,
        position: 'relative',
        fontFamily: "'Poppins', sans-serif",
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <Icon size={20} stroke={2} color={selected ? ACCENT : GREY_800} style={{ flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: FW_SEMIBOLD,
          color: selected ? BLUE_DARK : PRIMARY, lineHeight: 1.2,
        }}>{label}</div>
        <div style={{
          fontSize: 11, fontWeight: FW_REGULAR,
          color: GREY_800, marginTop: 2, lineHeight: 1.3,
        }}>{sub}</div>
      </div>

      <div style={{
        flexShrink: 0,
        width: 18, height: 18, borderRadius: 9,
        background: selected ? ACCENT : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
      }}>
        {selected && <IconCheck size={11} stroke={3} color={WHITE} />}
      </div>
    </button>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
      <div style={{
        fontSize: 10, fontWeight: FW_BOLD, color: ACCENT,
        letterSpacing: '0.1em',
      }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: FW_SEMIBOLD, color: PRIMARY, lineHeight: 1.3 }}>{title}</div>
    </div>
  );
}

export default function MvpSparZiel({ onDone, onBack }: Props) {
  const [sparziel, setSparziel]           = useState('');
  const [zeitaufwand, setZeitaufwand]     = useState('');
  const [investitionen, setInvestitionen] = useState('');
  const canContinue = sparziel !== '' && zeitaufwand !== '' && investitionen !== '';

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader showProgress progressPct={20} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px 100px' }}>
        <div style={{ width: '100%', maxWidth: 820 }}>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <h1 style={{
                fontSize: 22, fontWeight: FW_SEMIBOLD,
                color: PRIMARY, lineHeight: 1.2, marginBottom: 4,
                letterSpacing: '-0.01em',
              }}>
                Stellen Sie Ihren Sparplan ein
              </h1>
              <p style={{ fontSize: 13, color: GREY_800, lineHeight: 1.45, fontWeight: FW_REGULAR }}>
                Damit wir die Tipps optimal auf Sie zuschneiden können.
              </p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <SectionHeader label="SPARZIEL" title="Was ist Ihr Sparziel?" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {SPARZIELE.map(opt => (
                  <OptionCard
                    key={opt.value}
                    icon={opt.Icon}
                    label={opt.value}
                    sub={opt.sub}
                    selected={sparziel === opt.value}
                    onClick={() => setSparziel(opt.value)}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <SectionHeader
                label="ZEITAUFWAND"
                title="Wie viel Zeit möchten Sie investieren?"
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {ZEITAUFWAND.map(opt => (
                  <OptionCard
                    key={opt.value}
                    icon={opt.Icon}
                    label={opt.value}
                    sub={opt.sub}
                    selected={zeitaufwand === opt.value}
                    onClick={() => setZeitaufwand(opt.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionHeader label="INVESTITIONSBEREITSCHAFT" title="Was sind Sie bereit zu investieren?" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {INVESTITIONEN.map(opt => (
                  <OptionCard
                    key={opt.value}
                    icon={opt.Icon}
                    label={opt.value}
                    sub={opt.sub}
                    selected={investitionen === opt.value}
                    onClick={() => setInvestitionen(opt.value)}
                  />
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      <WpBottomNav
        onBack={onBack}
        onNext={() => canContinue && onDone({ sparziel, zeitaufwand, investitionen })}
        nextDisabled={!canContinue}
      />
    </div>
  );
}
