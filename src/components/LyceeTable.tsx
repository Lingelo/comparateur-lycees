import { useState } from 'react';
import type { Lycee, SortField, SortDir } from '../types';
import { formatPct, formatIPS } from '../utils/format';
import { ValueBadge } from './ValueBadge';
import { SortHeader } from './SortHeader';
import { LyceeDetail } from './LyceeDetail';

const PAGE_SIZE = 50;

interface LyceeTableProps {
  lycees: Lycee[];
  sortField: SortField;
  sortDir: SortDir;
  onToggleSort: (field: SortField) => void;
  compareList: string[];
  onToggleCompare: (uai: string) => void;
}

export function LyceeTable({ lycees, sortField, sortDir, onToggleSort, compareList, onToggleCompare }: LyceeTableProps) {
  const [page, setPage] = useState(0);
  const [expandedUai, setExpandedUai] = useState<string | null>(null);

  // Reset page when data changes
  const totalPages = Math.ceil(lycees.length / PAGE_SIZE);
  const safeP = Math.min(page, Math.max(0, totalPages - 1));
  const pageItems = lycees.slice(safeP * PAGE_SIZE, (safeP + 1) * PAGE_SIZE);

  const handleExpand = (uai: string) => {
    setExpandedUai((prev) => (prev === uai ? null : uai));
  };

  if (lycees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <p className="text-sm">Aucun lycée ne correspond à vos critères</p>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-3 py-3" />
              <SortHeader field="nom" label="Établissement" currentField={sortField} currentDir={sortDir} onToggle={onToggleSort} className="min-w-[200px]" />
              <SortHeader field="ville" label="Ville" currentField={sortField} currentDir={sortDir} onToggle={onToggleSort} />
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
              <SortHeader field="tauxReussite" label="Réussite" currentField={sortField} currentDir={sortDir} onToggle={onToggleSort} tooltip="Taux de réussite au baccalauréat" />
              <SortHeader field="vaReussite" label="VA Réus." currentField={sortField} currentDir={sortDir} onToggle={onToggleSort} tooltip="Valeur ajoutée : écart entre le taux observé et le taux attendu selon le profil des élèves" />
              <SortHeader field="tauxMention" label="Mentions" currentField={sortField} currentDir={sortDir} onToggle={onToggleSort} tooltip="Taux de mentions au baccalauréat (AB, B, TB)" />
              <SortHeader field="vaMention" label="VA Ment." currentField={sortField} currentDir={sortDir} onToggle={onToggleSort} tooltip="Valeur ajoutée sur le taux de mentions" />
              <SortHeader field="tauxAcces" label="Accès" currentField={sortField} currentDir={sortDir} onToggle={onToggleSort} tooltip="Proportion d'élèves de 2nde obtenant le bac dans l'établissement" />
              <SortHeader field="vaAcces" label="VA Accès" currentField={sortField} currentDir={sortDir} onToggle={onToggleSort} tooltip="Valeur ajoutée sur le taux d'accès de la 2nde au bac" />
              <SortHeader field="ips" label="IPS" currentField={sortField} currentDir={sortDir} onToggle={onToggleSort} tooltip="Indice de Position Sociale : reflète le contexte socio-économique des élèves" />
              <SortHeader field="presents" label="Effectif" currentField={sortField} currentDir={sortDir} onToggle={onToggleSort} tooltip="Nombre de candidats présents aux épreuves du bac" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {pageItems.map((l) => {
              const isCompared = compareList.includes(l.uai);
              return (
                <tr key={`${l.uai}-${l.type}`} className="group">
                  {/* Compare checkbox */}
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => onToggleCompare(l.uai)}
                      disabled={!isCompared && compareList.length >= 4}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-30"
                      title={isCompared ? 'Retirer de la comparaison' : compareList.length >= 4 ? '4 max' : 'Ajouter à la comparaison'}
                    />
                  </td>

                  {/* Name */}
                  <td className="px-3 py-3">
                    <button
                      onClick={() => handleExpand(l.uai)}
                      className="text-left"
                    >
                      <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                        {l.nom}
                      </div>
                      <div className="text-xs text-gray-400">
                        {l.secteur === 'public' ? '🏛' : '🏫'} {l.uai}
                      </div>
                    </button>
                  </td>

                  {/* Ville */}
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600">
                    {l.ville}
                    <div className="text-xs text-gray-400">{l.departement}</div>
                  </td>

                  {/* Type */}
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      l.type === 'GT'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {l.type}
                    </span>
                  </td>

                  {/* Taux réussite */}
                  <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                    {formatPct(l.tauxReussite)}
                  </td>

                  {/* VA Réussite */}
                  <td className="whitespace-nowrap px-3 py-3">
                    <ValueBadge value={l.vaReussite} />
                  </td>

                  {/* Taux mention */}
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                    {formatPct(l.tauxMention)}
                  </td>

                  {/* VA Mention */}
                  <td className="whitespace-nowrap px-3 py-3">
                    <ValueBadge value={l.vaMention} />
                  </td>

                  {/* Taux accès */}
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                    {formatPct(l.tauxAcces)}
                  </td>

                  {/* VA Accès */}
                  <td className="whitespace-nowrap px-3 py-3">
                    <ValueBadge value={l.vaAcces} />
                  </td>

                  {/* IPS */}
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600">
                    {formatIPS(l.ips)}
                  </td>

                  {/* Effectif */}
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                    {l.presents ?? '–'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expanded detail */}
      {expandedUai && (
        <LyceeDetail
          lycee={lycees.find((l) => l.uai === expandedUai)!}
          onClose={() => setExpandedUai(null)}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
          <p className="text-sm text-gray-500">
            {safeP * PAGE_SIZE + 1}–{Math.min((safeP + 1) * PAGE_SIZE, lycees.length)} sur {lycees.length.toLocaleString('fr')}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(Math.max(0, safeP - 1))}
              disabled={safeP === 0}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              ←
            </button>
            <span className="flex items-center px-3 text-sm text-gray-500">
              {safeP + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, safeP + 1))}
              disabled={safeP >= totalPages - 1}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
