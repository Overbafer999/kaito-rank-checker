import React from 'react';

export const Badge: React.FC<{ text: string }> = ({ text }) => (
  <span className="chip text-[11px] bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-300/20">
    🏆 {text}
  </span>
);

export default Badge;
