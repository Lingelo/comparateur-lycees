export interface Lycee {
  uai: string;
  nom: string;
  ville: string;
  departement: string;
  codeDept: string;
  academie: string;
  region: string;
  secteur: string;
  type: 'GT' | 'Pro';
  lat: number | null;
  lng: number | null;
  adresse: string;
  codePostal: string;
  presents: number | null;
  tauxReussite: number | null;
  vaReussite: number | null;
  tauxAcces: number | null;
  vaAcces: number | null;
  tauxMention: number | null;
  vaMention: number | null;
  ips: number | null;
  ecartTypeIps: number | null;
}

export interface LyceeData {
  meta: {
    year: string;
    generatedAt: string;
    counts: {
      total: number;
      gt: number;
      pro: number;
      withGeo: number;
      withIps: number;
    };
  };
  lycees: Lycee[];
}

export type SortField =
  | 'nom'
  | 'ville'
  | 'tauxReussite'
  | 'vaReussite'
  | 'tauxAcces'
  | 'vaAcces'
  | 'tauxMention'
  | 'vaMention'
  | 'ips'
  | 'presents';

export type SortDir = 'asc' | 'desc';

export interface Filters {
  search: string;
  departement: string;
  secteur: '' | 'public' | 'privé sous contrat';
  type: '' | 'GT' | 'Pro';
}
