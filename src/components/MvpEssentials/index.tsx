import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconCheck,
  IconX,
  IconReceiptTax,
  IconBolt,
  IconCreditCard,
} from '@tabler/icons-react';
import {
  ACCENT, PRIMARY, BG, WHITE, BORDER, GREY_200, GREY_700, GREY_800,
  GREEN, GREY_500,
  RADIUS_MD, RADIUS_SM,
  TEXT_XS, TEXT_SM, TEXT_LG,
  FW_REGULAR, FW_SEMIBOLD, FW_BOLD,
} from '../_tokens';
import WpHeader from '../_WpHeader';
import WpBottomNav from '../_WpBottomNav';

export interface EssentialsData {
  steuererklaerung: 'ja' | 'nein' | '';
  energievertraege: 'ja' | 'nein' | '';
  girokonto:        'ja' | 'nein' | '';
}

interface Props {
  onDone: (data: EssentialsData) => void;
  onBack: () => void;
}

const QUESTIONS: { key: keyof EssentialsData; label: string; sub: string; Icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }> }[] = [
  { key: 'steuererklaerung', label: 'Steuererklärung schon erledigt?',     sub: 'Ø 1.095 € Rückerstattung pro Jahr',           Icon: IconReceiptTax },
  { key: 'energievertraege', label: 'Energieverträge optimiert?',          sub: 'Strom & Gas regelmäßig wechseln spart hunderte €', Icon: IconBolt },
  { key: 'girokonto',        label: 'Haben Sie ein kostenloses Girokonto?', sub: 'Bis zu 60 € Kontoführungsgebühren / Jahr',     Icon: IconCreditCard },
];

function YesNoRow({
  icon: Icon, label, sub, value, onChange,
}: {
  icon: React.ComponentType<{ size?: number; stroke?: number; color?: string }>;
  label: string; sub: string;
  value: 'ja' | 'nein' | '';
  onChange: (v: 'ja' | 'nein') => void;
}) {
  return (
    <div style={{
      background: WHITE,
      border: `1.5px solid ${BORDER}`,
      borderRadius: RADIUS_MD,
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
      transition: 'all 0.15s',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: RADIUS_SM, flexShrink: 0,
        background: GREY_200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} stroke={1.8} color={GREY_800} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: TEXT_SM, fontWeight: FW_SEMIBOLD, color: PRIMARY, lineHeight: 1.25 }}>{label}</div>
        <div style={{ fontSize: TEXT_XS, fontWeight: FW_REGULAR, color: GREY_800, marginTop: 2, lineHeight: 1.4 }}>{sub}</div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onChange('ja')}
          style={{
            minWidth: 50, height: 34, borderRadius: RADIUS_SM,
            background: value === 'ja' ? GREEN : WHITE,
            border: `1.5px solid ${value === 'ja' ? GREEN : BORDER}`,
            color: value === 'ja' ? WHITE : GREY_700,
            fontSize: TEXT_XS, fontWeight: FW_SEMIBOLD,
            cursor: 'pointer', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <IconCheck size={13} stroke={2.5} /> Ja
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onChange('nein')}
          style={{
            minWidth: 56, height: 34, borderRadius: RADIUS_SM,
            background: value === 'nein' ? GREY_500 : WHITE,
            border: `1.5px solid ${value === 'nein' ? GREY_500 : BORDER}`,
            color: value === 'nein' ? WHITE : GREY_700,
            fontSize: TEXT_XS, fontWeight: FW_SEMIBOLD,
            cursor: 'pointer', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <IconX size={13} stroke={2.5} /> Nein
        </motion.button>
      </div>
    </div>
  );
}

export default function MvpEssentials({ onDone, onBack }: Props) {
  const [data, setData] = useState<EssentialsData>({
    steuererklaerung: '', energievertraege: '', girokonto: '',
  });

  const allAnswered = QUESTIONS.every(q => data[q.key] !== '');

  return (
    <div style={{
      minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <WpHeader showProgress progressPct={35} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px 120px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                fontSize: 11, fontWeight: FW_BOLD, color: ACCENT,
                letterSpacing: '0.1em', marginBottom: 8,
              }}>
                ESSENTIELLE TIPPS
              </div>
              <h1 style={{
                fontSize: TEXT_LG + 4, fontWeight: FW_SEMIBOLD,
                color: PRIMARY, lineHeight: 1.25, marginBottom: 8,
                letterSpacing: '-0.01em',
              }}>
                Haben Sie die Basics schon erledigt?
              </h1>
              <p style={{ fontSize: TEXT_SM, color: GREY_800, lineHeight: 1.55, fontWeight: FW_REGULAR }}>
                Diese vier Themen bringen den meisten Haushalten jährlich vierstellige Beträge.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUESTIONS.map(q => (
                <YesNoRow
                  key={q.key}
                  icon={q.Icon}
                  label={q.label}
                  sub={q.sub}
                  value={data[q.key]}
                  onChange={v => setData(d => ({ ...d, [q.key]: v }))}
                />
              ))}
            </div>

          </motion.div>
        </div>
      </div>

      <WpBottomNav
        onBack={onBack}
        onNext={() => allAnswered && onDone(data)}
        nextDisabled={!allAnswered}
      />
    </div>
  );
}
