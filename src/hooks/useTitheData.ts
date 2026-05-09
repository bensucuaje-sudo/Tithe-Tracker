import { useState, useEffect } from 'react';
import { TitheRecord } from '../types';

export function useTitheData() {
  const [records, setRecords] = useState<TitheRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('faithful_tithe_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved records', e);
      }
    }
  }, []);

  const addRecord = (record: Omit<TitheRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: crypto.randomUUID(),
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem('faithful_tithe_records', JSON.stringify(updated));
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('faithful_tithe_records', JSON.stringify(updated));
  };

  return { records, addRecord, deleteRecord };
}
