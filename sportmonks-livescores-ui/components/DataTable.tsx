'use client';
import useSWR from 'swr';
import { useMemo, useState, useCallback } from 'react';
import { buildRows, Row } from '@/lib/transform';
import { ColumnKey } from './ColumnControls';

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json());

const COLS: { key: ColumnKey; header: string; fmt?: (v: any) => string }[] = [
  { key: 'match', header: 'Match' },
  { key: 'scoreHome', header: 'Score home' },
  { key: 'scoreAway', header: 'Score away' },
  { key: 'time', header: 'Time' },
  { key: 'period', header: 'Period' },
  { key: 'cornersHome1HT', header: 'Corners\nHome 1HT' },
  { key: 'cornersAway1HT', header: 'Corners\nAway 1HT' },
  { key: 'possHome', header: 'Ball\nPosses % home', fmt: (v) => v == null ? '' : `${Math.round(Number(v))}%` },
  { key: 'possAway', header: 'Ball\nPosses % away', fmt: (v) => v == null ? '' : `${Math.round(Number(v))}%` },
  { key: 'daHome1HT', header: 'D. Attacks\nhome 1HT' },
  { key: 'daAway1HT', header: 'D. Attacks\naway 1HT' },
  { key: 'daHome2HT', header: 'D. Attacks\nhome 2HT' },
  { key: 'daAway2HT', header: 'D. Attacks\naway 2HT' },
  { key: 'daDeltaHome', header: 'D. Attack\nDelta Home' },
  { key: 'daDeltaAway', header: 'D. Attack\nDelta Away' },
];

export default function DataTable({
  searchQuery,
  hiddenColumns,
}: {
  searchQuery: string;
  hiddenColumns: Partial<Record<ColumnKey, boolean>>;
}) {
  const { data, error, isLoading } = useSWR('/api/livescores', fetcher, { refreshInterval: 3000 });

  const rows: Row[] = useMemo(() => {
    if (!data) return [];
    return buildRows(data);
  }, [data]);

  const filtered = useMemo(() => {
    const q = (searchQuery || '').toLowerCase();
    if (!q) return rows;
    return rows.filter(r => r.match.toLowerCase().includes(q));
  }, [rows, searchQuery]);

  const isHidden = useCallback((key: ColumnKey) => !!hiddenColumns[key], [hiddenColumns]);

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {COLS.map(col => (
              <th key={col.key} className={isHidden(col.key) ? 'col-hidden' : ''}>
                {col.header.split('\n').map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr className="row">
              <td colSpan={COLS.length}><small className="muted">Loading…</small></td>
            </tr>
          )}
          {error && (
            <tr className="row">
              <td colSpan={COLS.length}><small className="muted">Error fetching data.</small></td>
            </tr>
          )}
          {!isLoading && !error && filtered.length === 0 && (
            <tr className="row">
              <td colSpan={COLS.length}><small className="muted">No matches found.</small></td>
            </tr>
          )}
          {filtered.map(r => (
            <tr key={r.key} className="row">
              {COLS.map(col => {
                const raw: any = (r as any)[col.key];
                const display = col.fmt ? col.fmt(raw) : (raw ?? '');
                return (
                  <td key={col.key} className={isHidden(col.key) ? 'col-hidden' : ''}>
                    {display}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
