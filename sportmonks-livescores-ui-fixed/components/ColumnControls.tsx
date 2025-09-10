'use client';
import { useEffect, useState } from 'react';

export type ColumnKey =
  | 'match' | 'scoreHome' | 'scoreAway' | 'time' | 'period'
  | 'cornersHome1HT' | 'cornersAway1HT'
  | 'possHome' | 'possAway'
  | 'daHome1HT' | 'daAway1HT' | 'daHome2HT' | 'daAway2HT'
  | 'daDeltaHome' | 'daDeltaAway';

const ALL_COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'match', label: 'Match' },
  { key: 'scoreHome', label: 'Score home' },
  { key: 'scoreAway', label: 'Score away' },
  { key: 'time', label: 'Time' },
  { key: 'period', label: 'Period' },
  { key: 'cornersHome1HT', label: 'Corners Home 1HT' },
  { key: 'cornersAway1HT', label: 'Corners Away 1HT' },
  { key: 'possHome', label: 'Ball Posses % home' },
  { key: 'possAway', label: 'Ball Posses % away' },
  { key: 'daHome1HT', label: 'D. Attacks home 1HT' },
  { key: 'daAway1HT', label: 'D. Attacks away 1HT' },
  { key: 'daHome2HT', label: 'D. Attacks home 2HT' },
  { key: 'daAway2HT', label: 'D. Attacks away 2HT' },
  { key: 'daDeltaHome', label: 'D. Attack Delta Home' },
  { key: 'daDeltaAway', label: 'D. Attack Delta Away' },
];

export default function ColumnControls({ onChange }: { onChange: (hidden: Partial<Record<ColumnKey, boolean>>) => void }) {
  const [hidden, setHidden] = useState<Partial<Record<ColumnKey, boolean>>>({});

  useEffect(() => {
    const saved = localStorage.getItem('hiddenColumns');
    if (saved) setHidden(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('hiddenColumns', JSON.stringify(hidden));
    onChange(hidden);
  }, [hidden, onChange]);

  function toggle(key: ColumnKey) {
    setHidden(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="checkbox-group">
      {ALL_COLUMNS.map(({ key, label }) => (
        <label key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={!hidden[key]} onChange={() => toggle(key)} />
          <small className="muted">{label}</small>
        </label>
      ))}
    </div>
  );
}
