import { timeAgo } from '../utils/format';

interface Props {
  onClose: () => void;
  lastUpdate?: string;
}

export function AboutModal({ onClose, lastUpdate }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900">A propos</h2>
        <div className="mt-3 space-y-3 text-sm text-gray-600">
          <p>
            Cette application permet de comparer les lycees de France selon leurs
            indicateurs de valeur ajoutee (IVAL) et leur indice de position sociale
            (IPS). Les indicateurs de valeur ajoutee mesurent la capacite d'un
            etablissement a faire progresser ses eleves au-dela de ce que laisse
            prevoir leur profil sociologique.
          </p>
          <p>
            <strong>Source :</strong> Ministere de l'Education nationale (DEPP) —
            Indicateurs de valeur ajoutee des lycees (IVAL) et Indice de Position
            Sociale (IPS) ·{' '}
            <a
              href="https://data.education.gouv.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              data.education.gouv.fr
            </a>
          </p>
          <p>
            <strong>Licence :</strong> Licence Ouverte v2.0
          </p>
          {lastUpdate && (
            <p>
              <strong>Derniere mise a jour :</strong> {timeAgo(lastUpdate)}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
