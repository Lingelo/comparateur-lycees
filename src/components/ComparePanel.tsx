import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { Lycee } from '../types';
import { formatPct, formatVA, formatIPS, vaClass } from '../utils/format';

const COLORS = ['#4f46e5', '#0891b2', '#d97706', '#e11d48'];

interface ComparePanelProps {
  lycees: Lycee[];
  onRemove: (uai: string) => void;
  onClear: () => void;
}

export function ComparePanel({ lycees, onRemove, onClear }: ComparePanelProps) {
  const barData = useMemo(() => [
    {
      metric: 'Réussite',
      ...Object.fromEntries(lycees.map((l, i) => [`l${i}`, l.tauxReussite])),
    },
    {
      metric: 'Mentions',
      ...Object.fromEntries(lycees.map((l, i) => [`l${i}`, l.tauxMention])),
    },
    {
      metric: 'Accès',
      ...Object.fromEntries(lycees.map((l, i) => [`l${i}`, l.tauxAcces])),
    },
  ], [lycees]);

  const radarData = useMemo(() => {
    const metrics = [
      { key: 'vaReussite', label: 'VA Réussite' },
      { key: 'vaMention', label: 'VA Mentions' },
      { key: 'vaAcces', label: 'VA Accès' },
    ] as const;

    return metrics.map(({ key, label }) => ({
      metric: label,
      ...Object.fromEntries(lycees.map((l, i) => [`l${i}`, l[key] ?? 0])),
    }));
  }, [lycees]);

  if (lycees.length === 0) return null;

  return (
    <div className="border-t-4 border-indigo-500 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Comparaison ({lycees.length} lycée{lycees.length > 1 ? 's' : ''})
          </h2>
          <button
            onClick={onClear}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Effacer la sélection
          </button>
        </div>

        {/* Cards */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {lycees.map((l, i) => (
            <div
              key={l.uai}
              className="relative rounded-xl border-2 p-4"
              style={{ borderColor: COLORS[i] }}
            >
              <button
                onClick={() => onRemove(l.uai)}
                className="absolute right-2 top-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
              <div
                className="mb-2 h-1 w-8 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <h3 className="text-sm font-semibold text-gray-900">{l.nom}</h3>
              <p className="text-xs text-gray-500">{l.ville} · {l.type}</p>

              <div className="mt-3 space-y-1.5">
                <Row label="Réussite" value={formatPct(l.tauxReussite)} va={l.vaReussite} />
                <Row label="Mentions" value={formatPct(l.tauxMention)} va={l.vaMention} />
                <Row label="Accès" value={formatPct(l.tauxAcces)} va={l.vaAcces} />
                <Row label="IPS" value={formatIPS(l.ips)} />
                <Row label="Effectif" value={l.presents ? String(l.presents) : '–'} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        {lycees.length >= 2 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Bar chart - Taux */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Taux comparés (%)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  {lycees.map((l, i) => (
                    <Bar
                      key={l.uai}
                      dataKey={`l${i}`}
                      name={l.nom.length > 25 ? l.nom.slice(0, 22) + '…' : l.nom}
                      fill={COLORS[i]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar chart - VA */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Valeur ajoutée comparée</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  {lycees.map((l, i) => (
                    <Radar
                      key={l.uai}
                      name={l.nom.length > 25 ? l.nom.slice(0, 22) + '…' : l.nom}
                      dataKey={`l${i}`}
                      stroke={COLORS[i]}
                      fill={COLORS[i]}
                      fillOpacity={0.15}
                    />
                  ))}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, va }: { label: string; value: string; va?: number | null }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="flex items-center gap-1.5">
        <span className="font-medium text-gray-900">{value}</span>
        {va !== undefined && va !== null && (
          <span className={`${vaClass(va)}`}>{formatVA(va)}</span>
        )}
      </span>
    </div>
  );
}
