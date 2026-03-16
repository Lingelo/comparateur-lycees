import { computeStats } from '../hooks/useLycees';
import type { Lycee } from '../types';

interface StatsBarProps {
  lycees: Lycee[];
}

export function StatsBar({ lycees }: StatsBarProps) {
  const stats = computeStats(lycees);

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Stat label="Réussite moy." value={stats.avgTauxReussite !== null ? `${stats.avgTauxReussite.toFixed(1)}%` : '–'} />
          <Stat label="VA réussite moy." value={stats.avgVaReussite !== null ? (stats.avgVaReussite > 0 ? `+${stats.avgVaReussite.toFixed(1)}` : stats.avgVaReussite.toFixed(1)) : '–'} />
          <Stat label="Mentions moy." value={stats.avgTauxMention !== null ? `${stats.avgTauxMention.toFixed(1)}%` : '–'} />
          <Stat label="IPS médian" value={stats.medianIps !== null ? stats.medianIps.toFixed(1) : '–'} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold text-gray-700">{value}</span>
    </div>
  );
}
