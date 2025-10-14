import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, glow, glass, ...props }) => (
  <div
    {...props}
    className={clsx(
      'card hover-lift transition-all',
      {
        'ring-glow': glow,
        'glass': glass,
      },
      className
    )}
  >
    {children}
  </div>
);

export default Card;
