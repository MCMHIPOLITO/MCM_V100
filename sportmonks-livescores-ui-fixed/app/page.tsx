'use client';
import { useCallback, useState } from 'react';
import SearchBar from '../components/SearchBar';
import ColumnControls, { ColumnKey } from '../components/ColumnControls';
import DataTable from '../components/DataTable';

export default function Page() {
  const [q, setQ] = useState('');
  const [hidden, setHidden] = useState<Partial<Record<ColumnKey, boolean>>>({});

  const onSearch = useCallback((val: string) => setQ(val), []);

  return (
    <div className="container">
      <div className="panel">
        <div className="header">
          <div className="title">Livescores</div>
          <div className="controls">
            <SearchBar onChange={onSearch} />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <ColumnControls onChange={setHidden} />
        </div>
        <DataTable searchQuery={q} hiddenColumns={hidden} />
        <div className="footer">
          Refreshing every 3 seconds via serverless proxy to avoid CORS.
        </div>
      </div>
    </div>
  );
}
