import { vaClass, formatVA } from '../utils/format';

interface ValueBadgeProps {
  value: number | null;
  className?: string;
}

export function ValueBadge({ value, className = '' }: ValueBadgeProps) {
  if (value === null) return <span className="text-gray-300">–</span>;

  const bg =
    value > 2 ? 'bg-emerald-50' :
    value > 0 ? 'bg-emerald-50/50' :
    value < -2 ? 'bg-rose-50' :
    value < 0 ? 'bg-rose-50/50' :
    'bg-gray-50';

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${bg} ${vaClass(value)} ${className}`}>
      {formatVA(value)}
    </span>
  );
}
