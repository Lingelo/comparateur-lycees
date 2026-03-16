import type { Lycee } from '../types';
import { formatPct, formatVA, formatIPS, vaClass } from '../utils/format';

interface LyceeDetailProps {
  lycee: Lycee;
  onClose: () => void;
}

const METRICS = [
  { key: 'tauxReussite' as const, vaKey: 'vaReussite' as const, label: 'Réussite au bac', desc: 'Pourcentage de candidats reçus au baccalauréat' },
  { key: 'tauxMention' as const, vaKey: 'vaMention' as const, label: 'Mentions au bac', desc: 'Pourcentage de candidats ayant obtenu une mention' },
  { key: 'tauxAcces' as const, vaKey: 'vaAcces' as const, label: 'Accès 2nde → Bac', desc: 'Proportion d\'élèves de 2nde qui obtiennent le bac dans l\'établissement' },
];

export function LyceeDetail({ lycee, onClose }: LyceeDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{lycee.nom}</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {lycee.ville} ({lycee.departement}) · {lycee.secteur === 'public' ? 'Public' : 'Privé'} · {lycee.type === 'GT' ? 'Général & Techno' : 'Professionnel'}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">UAI : {lycee.uai}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Metrics */}
        <div className="divide-y divide-gray-50 px-6 py-4">
          {METRICS.map(({ key, vaKey, label, desc }) => {
            const taux = lycee[key];
            const va = lycee[vaKey];
            return (
              <div key={key} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-900">{formatPct(taux)}</span>
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-semibold ${vaClass(va)}`}>
                      {formatVA(va)}
                    </span>
                    <span className="text-[10px] text-gray-400">VA</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* IPS */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">Indice de Position Sociale</p>
              <p className="text-xs text-gray-400">Contexte socio-économique des élèves</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">{formatIPS(lycee.ips)}</span>
              {lycee.ecartTypeIps !== null && (
                <span className="text-xs text-gray-400">± {lycee.ecartTypeIps.toFixed(1)}</span>
              )}
            </div>
          </div>

          {/* Effectif */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">Candidats au bac</p>
              <p className="text-xs text-gray-400">Nombre de candidats présents aux épreuves</p>
            </div>
            <span className="text-lg font-bold text-gray-900">{lycee.presents ?? '–'}</span>
          </div>
        </div>

        {/* VA explanation */}
        <div className="rounded-b-2xl bg-gray-50 px-6 py-3">
          <p className="text-xs text-gray-500">
            <strong>Valeur ajoutée (VA)</strong> : écart entre le résultat observé et le résultat attendu compte tenu des caractéristiques des élèves.
            Une VA positive signifie que le lycée fait mieux que ce qui est statistiquement attendu.
          </p>
        </div>
      </div>
    </div>
  );
}
