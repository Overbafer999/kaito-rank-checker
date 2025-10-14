import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'chip' | 'chip-active';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => (
  <button
    {...props}
    className={clsx(
      {
        'btn-primary': variant === 'primary',
        'chip': variant === 'chip',
        'chip chip-active': variant === 'chip-active',
      },
      className
    )}
  >
    {children}
  </button>
);

export default Button;
