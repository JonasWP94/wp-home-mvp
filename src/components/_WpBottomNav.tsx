import React from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import {
  BORDER, WHITE, PRIMARY, GREY_800,
  FW_SEMIBOLD,
} from './_tokens';
import WpButton from './_WpButton';

interface Props {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  middle?: React.ReactNode;
}

export default function WpBottomNav({
  onBack, onNext, nextLabel = 'Weiter', nextDisabled, middle,
}: Props) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
      borderTop: `1px solid ${BORDER}`,
      padding: '14px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    }}>
      {onBack ? (
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none',
            padding: '8px 12px',
            fontSize: 14, fontWeight: FW_SEMIBOLD, color: GREY_800,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 0.15s', fontFamily: "'Poppins', sans-serif",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = PRIMARY; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = GREY_800; }}
        >
          <IconArrowLeft size={16} stroke={2} /> Zurück
        </button>
      ) : <div />}

      {middle ?? <div />}

      {onNext ? (
        <WpButton onClick={onNext} disabled={nextDisabled} size="md">
          {nextLabel}
        </WpButton>
      ) : <div />}
    </div>
  );
}
