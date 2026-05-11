import React from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import {
  YELLOW, PRIMARY, BORDER, GREY_200, GREY_800,
  RADIUS_SM, FW_BOLD, FW_MEDIUM, FW_SEMIBOLD,
} from './_tokens';

interface Props {
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  showProgress?: boolean;
  progressPct?: number;
}

export default function WpHeader({ onBack, rightSlot, showProgress, progressPct = 0 }: Props) {
  return (
    <>
      <div className="wp-header" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(243,243,245,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        height: 56, boxSizing: 'border-box',
      }}>
        <style>{`@media(min-width:640px){.wp-header{padding:12px 24px !important;}}`}</style>
        <img
          src="/apps/wpilot-home/assets/logo-wp.png"
          alt="Wechselpilot"
          height={30}
          style={{ objectFit: 'contain' }}
        />
        <span style={{
          background: YELLOW, borderRadius: 6,
          padding: '2px 7px 3px',
          fontFamily: "'Poppins', sans-serif",
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1,
        }}>
          <span style={{ fontSize: 11, fontWeight: FW_BOLD, color: PRIMARY, letterSpacing: '0.06em' }}>HOME</span>
          <span style={{ fontSize: 7, fontWeight: FW_MEDIUM, color: PRIMARY, opacity: 0.7, letterSpacing: '0.04em' }}>beta</span>
        </span>

        <div style={{ flex: 1 }} />

        {rightSlot}

        {onBack && !rightSlot && (
          <button
            onClick={onBack}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 13, color: GREY_800, fontWeight: FW_SEMIBOLD,
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 8px', borderRadius: RADIUS_SM,
            }}
          >
            <IconArrowLeft size={15} stroke={2} /> Zurück
          </button>
        )}
      </div>

      {showProgress && (
        <div style={{ height: 3, background: BORDER }}>
          <div style={{
            height: '100%', background: PRIMARY,
            width: `${Math.min(100, Math.max(0, progressPct))}%`,
            transition: 'width 0.3s',
          }} />
        </div>
      )}
    </>
  );
}
