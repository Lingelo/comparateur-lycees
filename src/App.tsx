import { useState, useCallback, useMemo } from 'react';
import type { Lycee } from './types';
import { useLycees } from './hooks/useLycees';
import { getDepartements } from './utils/format';
import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { StatsBar } from './components/StatsBar';
import { LyceeTable } from './components/LyceeTable';
import { ComparePanel } from './components/ComparePanel';

export default function App() {
  const {
    data,
    loading,
    error,
    lycees,
    totalFiltered,
    filters,
    updateFilter,
    sortField,
    sortDir,
    toggleSort,
  } = useLycees();

  const [compareUais, setCompareUais] = useState<string[]>([]);

  const departements = useMemo(
    () => (data ? getDepartements(data.lycees) : []),
    [data],
  );

  const compareLycees = useMemo(
    () => {
      if (!data) return [];
      return compareUais.map((uai) => data.lycees.find((l) => l.uai === uai)).filter((l): l is Lycee => l !== undefined);
    },
    [compareUais, data],
  );

  const toggleCompare = useCallback((uai: string) => {
    setCompareUais((prev) =>
      prev.includes(uai) ? prev.filter((u) => u !== uai) : prev.length < 4 ? [...prev, uai] : prev,
    );
  }, []);

  const removeCompare = useCallback((uai: string) => {
    setCompareUais((prev) => prev.filter((u) => u !== uai));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareUais([]);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Chargement des données…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-red-50 px-8 py-6 text-center">
          <p className="text-sm text-red-600">Erreur : {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        year={data?.meta.year}
        totalCount={data?.meta.counts.total ?? 0}
        filteredCount={totalFiltered}
      />

      <SearchFilters
        filters={filters}
        onUpdate={updateFilter}
        departements={departements}
      />

      <StatsBar lycees={lycees} />

      {/* Compare panel (sticky at bottom when comparing) */}
      {compareLycees.length > 0 && (
        <ComparePanel
          lycees={compareLycees}
          onRemove={removeCompare}
          onClear={clearCompare}
        />
      )}

      {/* Main table */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl">
          <LyceeTable
            lycees={lycees}
            sortField={sortField}
            sortDir={sortDir}
            onToggleSort={toggleSort}
            compareList={compareUais}
            onToggleCompare={toggleCompare}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-400">
            Données : Ministère de l'Éducation nationale (DEPP) — IVAL {data?.meta.year} · IPS 2024-2025 ·{' '}
            <a href="https://data.education.gouv.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
              data.education.gouv.fr
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
