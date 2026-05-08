import React from 'react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import {
  ACCENT, BORDER, WHITE, PRIMARY, GREY_700,
  RADIUS_MD, FW_SEMIBOLD,
} from './_tokens';

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
            background: WHITE, border: `1.5px solid ${BORDER}`,
            borderRadius: RADIUS_MD, padding: '10px 16px',
            fontSize: 14, fontWeight: FW_SEMIBOLD, color: PRIMARY,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.15s',
          }}
        >
          <IconArrowLeft size={16} stroke={2} /> Zurück
        </button>
      ) : <div />}

      {middle ?? <div />}

      {onNext ? (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          style={{
            background: nextDisabled ? BORDER : ACCENT,
            border: 'none', borderRadius: RADIUS_MD, padding: '10px 20px',
            fontSize: 14, fontWeight: FW_SEMIBOLD, color: nextDisabled ? GREY_700 : WHITE,
            cursor: nextDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
            boxShadow: nextDisabled ? 'none' : `0 2px 8px rgba(42,111,166,0.30)`,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {nextLabel} <IconArrowRight size={16} stroke={2} />
        </button>
      ) : <div />}
    </div>
  );
}
