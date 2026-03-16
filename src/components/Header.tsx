interface HeaderProps {
  year: string | undefined;
  totalCount: number;
  filteredCount: number;
}

export function Header({ year, totalCount, filteredCount }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Comparateur de Lycées
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Indicateurs de valeur ajoutée (IVAL) {year && `— Session ${year}`} · Données Éducation nationale
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {filteredCount === totalCount ? (
              <span><strong className="text-gray-700">{totalCount.toLocaleString('fr')}</strong> lycées</span>
            ) : (
              <span><strong className="text-gray-700">{filteredCount.toLocaleString('fr')}</strong> / {totalCount.toLocaleString('fr')} lycées</span>
            )}
          </p>
        </div>
      </div>
    </header>
  );
}
