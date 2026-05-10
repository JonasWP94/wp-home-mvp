import React from 'react';
import { motion } from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';
import {
  PRIMARY, WHITE, BORDER, GREY_700,
  TEXT_SM, TEXT_MD,
  FW_SEMIBOLD,
} from './_tokens';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface Props {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
}

export default function WpButton({
  onClick, disabled, children,
  variant = 'primary',
  size = 'md',
  arrow = true,
  fullWidth = false,
  type = 'button',
}: Props) {
  const sizeStyles = size === 'lg'
    ? { padding: '14px 28px', fontSize: TEXT_MD, gap: 10, iconSize: 18 }
    : { padding: '11px 22px', fontSize: TEXT_SM, gap: 8, iconSize: 16 };

  let bg: string, color: string, border: string;
  if (variant === 'primary') {
    bg = disabled ? '#bfc1c8' : PRIMARY;
    color = WHITE;
    border = 'none';
  } else if (variant === 'secondary') {
    bg = WHITE;
    color = PRIMARY;
    border = `1.5px solid ${BORDER}`;
  } else {
    bg = 'transparent';
    color = GREY_700;
    border = 'none';
  }

  return (
    <motion.button
      type={type}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        background: bg,
        color,
        border,
        borderRadius: 999,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        fontWeight: FW_SEMIBOLD,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeStyles.gap,
        width: fullWidth ? '100%' : 'auto',
        transition: 'background 0.15s, opacity 0.15s',
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: '-0.005em',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{children}</span>
      {arrow && <IconArrowRight size={sizeStyles.iconSize} stroke={2.2} />}
    </motion.button>
  );
}
