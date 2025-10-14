import React from 'react';

interface TableProps {
  columns: string[];
  rows: React.ReactNode[][];
}

export const Table: React.FC<TableProps> = ({ columns, rows }) => (
  <table className="w-full text-sm">
    <thead>
      <tr className="text-slate-400 border-b border-white/5">
        {columns.map((c, i) => (
          <th key={i} className="text-left py-2">{c}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i} className="border-b border-white/5">
          {row.map((cell, j) => (
            <td key={j} className="py-2">{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
