# Comparateur de Lycees

Dashboard comparatif des lycees francais avec indicateurs IVAL et IPS.

## Fonctionnalites

- Tableau triable de 4300+ lycees avec recherche textuelle
- Filtres par departement, secteur (public/prive) et type (general/techno/pro)
- Statistiques agregees (moyennes, medianes, distributions)
- Comparaison cote a cote de jusqu'a 4 lycees avec graphiques en barres et radar
- Infobulles contextuelles sur les indicateurs
- Fiche detail par lycee

## Sources de donnees

| Source | API / URL | Frequence |
|--------|-----------|-----------|
| IVAL Voie Generale et Technologique | data.education.gouv.fr (Opendatasoft API) | Annuelle |
| IVAL Voie Professionnelle | data.education.gouv.fr (Opendatasoft API) | Annuelle |
| Indice de Position Sociale (IPS) | data.education.gouv.fr (Opendatasoft API) | Annuelle |
| Annuaire des etablissements | data.education.gouv.fr (Opendatasoft API) | Annuelle |

Les quatre sources sont jointes par code UAI et consolidees dans `public/data/lycees.json`.

## Commandes

```bash
npm run dev          # Serveur de developpement Vite
npm run build        # Build de production (tsc + vite build)
npm run lint         # ESLint
npm run preview      # Preview du build

node scripts/fetch-data.mjs   # Rafraichir les donnees (auto-detection de l'annee la plus recente)
```

## Stack technique

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Recharts

## Mise a jour automatique des donnees

GitHub Actions workflow executant `fetch-data.mjs` chaque lundi a 8h UTC. Les donnees etant annuelles, le script detecte automatiquement l'annee la plus recente disponible et commit le fichier JSON mis a jour.

## Deploiement

GitHub Pages via GitHub Actions.
