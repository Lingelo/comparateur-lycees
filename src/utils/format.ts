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
