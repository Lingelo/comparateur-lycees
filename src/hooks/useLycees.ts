import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Lycee, LyceeData, Filters, SortField, SortDir } from '../types';

const DATA_URL = import.meta.env.BASE_URL + 'data/lycees.json';

export function useLycees() {
  const [data, setData] = useState<LyceeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    search: '',
    departement: '',
    secteur: '',
    type: '',
  });

  const [sortField, setSortField] = useState<SortField>('vaReussite');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Load data
  useEffect(() => {
    fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((d: LyceeData) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filter
  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.lycees;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (l) =>
          l.nom.toLowerCase().includes(q) ||
          l.ville.toLowerCase().includes(q) ||
          l.uai.toLowerCase().includes(q),
      );
    }

    if (filters.departement) {
      list = list.filter((l) => l.codeDept === filters.departement);
    }

    if (filters.secteur) {
      list = list.filter((l) => l.secteur === filters.secteur);
    }

    if (filters.type) {
      list = list.filter((l) => l.type === filters.type);
    }

    return list;
  }, [data, filters]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];

      // Nulls last
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;

      let cmp: number;
      if (typeof av === 'string' && typeof bv === 'string') {
        cmp = av.localeCompare(bv, 'fr');
      } else {
        cmp = (av as number) - (bv as number);
      }

      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  const toggleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDir(field === 'nom' || field === 'ville' ? 'asc' : 'desc');
      }
    },
    [sortField],
  );

  const updateFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((f) => ({ ...f, [key]: value }));
    },
    [],
  );

  return {
    data,
    loading,
    error,
    lycees: sorted,
    totalFiltered: filtered.length,
    filters,
    updateFilter,
    sortField,
    sortDir,
    toggleSort,
  };
}

/** Compute stats for a set of lycées */
export function computeStats(lycees: Lycee[]) {
  const vals = (fn: (l: Lycee) => number | null) =>
    lycees.map(fn).filter((v): v is number => v !== null);

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

  const median = (arr: number[]) => {
    if (!arr.length) return null;
    const s = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  };

  const tauxR = vals((l) => l.tauxReussite);
  const vaR = vals((l) => l.vaReussite);
  const tauxM = vals((l) => l.tauxMention);
  const vaM = vals((l) => l.vaMention);
  const ipsVals = vals((l) => l.ips);

  return {
    count: lycees.length,
    avgTauxReussite: avg(tauxR),
    medianTauxReussite: median(tauxR),
    avgVaReussite: avg(vaR),
    avgTauxMention: avg(tauxM),
    avgVaMention: avg(vaM),
    avgIps: avg(ipsVals),
    medianIps: median(ipsVals),
  };
}
