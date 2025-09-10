'use client';
import { useState, useEffect } from 'react';

export default function SearchBar({ onChange }: { onChange: (q: string) => void }) {
  const [q, setQ] = useState('');

  useEffect(() => {
    const t = setTimeout(() => onChange(q.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [q, onChange]);

  return (
    <input
      className="input"
      placeholder="Search teams..."
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
  );
}
