import React from 'react';
import clsx from 'clsx';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Chip: React.FC<ChipProps> = ({ active, children, className, ...props }) => (
  <button
    {...props}
    className={clsx('chip', { 'chip-active': active }, className)}
  >
    {children}
  </button>
);

export default Chip;
