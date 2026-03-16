/** Format a value-added number with sign and color class */
export function vaClass(va: number | null): string {
  if (va === null) return 'text-gray-400';
  if (va > 2) return 'text-emerald-600 font-semibold';
  if (va > 0) return 'text-emerald-500';
  if (va < -2) return 'text-rose-600 font-semibold';
  if (va < 0) return 'text-rose-500';
  return 'text-gray-600';
}

export function formatVA(va: number | null): string {
  if (va === null) return '–';
  return va > 0 ? `+${va}` : String(va);
}

export function formatPct(v: number | null): string {
  if (v === null) return '–';
  return `${v}%`;
}

export function formatIPS(v: number | null): string {
  if (v === null) return '–';
  return v.toFixed(1);
}

/** French relative time string from ISO date */
export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `il y a ${mins} minute${mins > 1 ? 's' : ''}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  const months = Math.floor(days / 30);
  return `il y a ${months} mois`;
}

/** Unique sorted list of départements from lycée data */
export function getDepartements(lycees: { departement: string; codeDept: string }[]): { code: string; label: string }[] {
  const map = new Map<string, string>();
  for (const l of lycees) {
    if (l.codeDept && l.departement) {
      map.set(l.codeDept, l.departement);
    }
  }
  return Array.from(map.entries())
    .map(([code, label]) => ({ code, label: `${code} – ${label}` }))
    .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
}
