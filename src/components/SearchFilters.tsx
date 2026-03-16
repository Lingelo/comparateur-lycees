import type { Filters } from '../types';

interface SearchFiltersProps {
  filters: Filters;
  onUpdate: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  departements: { code: string; label: string }[];
}

export function SearchFilters({ filters, onUpdate, departements }: SearchFiltersProps) {
  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un lycée, une ville ou un UAI..."
              value={filters.search}
              onChange={(e) => onUpdate('search', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {filters.search && (
              <button
                onClick={() => onUpdate('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Département */}
          <select
            value={filters.departement}
            onChange={(e) => onUpdate('departement', e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Tous les départements</option>
            {departements.map((d) => (
              <option key={d.code} value={d.code}>{d.label}</option>
            ))}
          </select>

          {/* Secteur */}
          <select
            value={filters.secteur}
            onChange={(e) => onUpdate('secteur', e.target.value as Filters['secteur'])}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Public & Privé</option>
            <option value="public">Public</option>
            <option value="privé sous contrat">Privé sous contrat</option>
          </select>

          {/* Type */}
          <select
            value={filters.type}
            onChange={(e) => onUpdate('type', e.target.value as Filters['type'])}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">GT & Pro</option>
            <option value="GT">Général & Technologique</option>
            <option value="Pro">Professionnel</option>
          </select>
        </div>
      </div>
    </div>
  );
}
