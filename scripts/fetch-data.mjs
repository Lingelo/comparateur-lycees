#!/usr/bin/env node

/**
 * Data pipeline: fetches IVAL, IPS and Annuaire data from data.education.gouv.fr
 * and produces a single joined JSON file for the app.
 *
 * Usage: node scripts/fetch-data.mjs [--year 2024]
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'data');

const BASE = 'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets';

const DATASETS = {
  ivalGT: 'fr-en-indicateurs-de-resultat-des-lycees-gt_v2',
  ivalPro: 'fr-en-indicateurs-de-resultat-des-lycees-pro_v2',
  ips: 'fr-en-ips-lycees-ap2023',
  annuaire: 'fr-en-annuaire-education',
};

// --- Helpers ---

async function fetchAllRecords(datasetId, { where = '', select = '' } = {}) {
  const params = new URLSearchParams();
  if (where) params.set('where', where);
  if (select) params.set('select', select);
  params.set('limit', '100');

  const records = [];
  let offset = 0;

  while (true) {
    params.set('offset', String(offset));
    const url = `${BASE}/${datasetId}/records?${params}`;
    console.log(`  Fetching ${datasetId} offset=${offset}...`);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);

    const data = await res.json();
    records.push(...data.results);

    if (records.length >= data.total_count || data.results.length === 0) break;
    offset += 100;
  }

  console.log(`  → ${records.length} records`);
  return records;
}

function titleCase(str) {
  return str
    .toLowerCase()
    .replace(/(^|\s|-)\S/g, (c) => c.toUpperCase());
}

/** Detect the latest year available in the IVAL GT dataset */
async function detectLatestYear() {
  const url = `${BASE}/${DATASETS.ivalGT}/records?select=annee&group_by=annee&order_by=annee%20desc&limit=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Cannot detect latest year: ${res.status}`);
  const data = await res.json();
  if (!data.results?.length) throw new Error('No years found in IVAL dataset');
  // annee comes as "2024-01-01T00:00:00+00:00" or "2024"
  const raw = data.results[0].annee;
  return String(raw).slice(0, 4);
}

// --- Main ---

async function main() {
  const YEAR = process.argv.includes('--year')
    ? process.argv[process.argv.indexOf('--year') + 1]
    : await detectLatestYear();

  console.log(`\n📊 Fetching IVAL data for year ${YEAR}...\n`);

  // 1. IVAL GT
  console.log('1/4 IVAL Général & Technologique');
  const ivalGT = await fetchAllRecords(DATASETS.ivalGT, {
    where: `year(annee)=${YEAR}`,
    select: [
      'uai', 'libelle_uai', 'secteur',
      'code_commune', 'libelle_commune', 'code_departement', 'libelle_departement',
      'libelle_academie', 'code_region', 'libelle_region',
      'presents_total', 'taux_reu_total', 'va_reu_total',
      'taux_acces_2nde', 'va_acces_2nde',
      'taux_men_total', 'va_men_total',
      'presents_gnle', 'taux_reu_gnle', 'va_reu_gnle', 'taux_men_gnle', 'va_men_gnle',
      'presents_sti2d', 'presents_stmg', 'presents_stl', 'presents_st2s',
      'nb_mentions_tb_avecf_g', 'nb_mentions_tb_sansf_g', 'nb_mentions_b_g', 'nb_mentions_ab_g',
      'nb_mentions_tb_avecf_t', 'nb_mentions_tb_sansf_t', 'nb_mentions_b_t', 'nb_mentions_ab_t',
    ].join(','),
  });

  // 2. IVAL Pro
  console.log('\n2/4 IVAL Professionnel');
  const ivalPro = await fetchAllRecords(DATASETS.ivalPro, {
    where: `year(annee)=${YEAR}`,
    select: [
      'uai', 'libelle_uai', 'secteur',
      'code_commune', 'libelle_commune', 'code_departement', 'libelle_departement',
      'libelle_academie', 'code_region', 'libelle_region',
      'presents_total', 'taux_reu_total', 'va_reu_total',
      'taux_acces_2nde', 'va_acces_2nde',
      'taux_men_total', 'va_men_total',
    ].join(','),
  });

  // 3. IPS
  console.log('\n3/4 IPS (Indice de Position Sociale)');
  const ipsRecords = await fetchAllRecords(DATASETS.ips, {
    select: 'uai,ips_voie_gt,ips_voie_pro,ips_etab,ecart_type_etablissement',
  });

  const ipsMap = new Map();
  for (const r of ipsRecords) {
    ipsMap.set(r.uai, {
      ipsGT: r.ips_voie_gt ? parseFloat(r.ips_voie_gt) : null,
      ipsPro: r.ips_voie_pro ? parseFloat(r.ips_voie_pro) : null,
      ips: r.ips_etab ? parseFloat(r.ips_etab) : null,
      ecartTypeIps: r.ecart_type_etablissement ? parseFloat(r.ecart_type_etablissement) : null,
    });
  }

  // 4. Annuaire (lycées only, for geolocation)
  console.log('\n4/4 Annuaire (géolocalisation)');
  const annuaire = await fetchAllRecords(DATASETS.annuaire, {
    where: `type_etablissement='Lycée'`,
    select: 'identifiant_de_l_etablissement,latitude,longitude,adresse_1,code_postal',
  });

  const geoMap = new Map();
  for (const r of annuaire) {
    if (r.latitude && r.longitude) {
      geoMap.set(r.identifiant_de_l_etablissement, {
        lat: parseFloat(r.latitude),
        lng: parseFloat(r.longitude),
        adresse: r.adresse_1 || '',
        codePostal: r.code_postal || '',
      });
    }
  }

  // 5. Join and build output
  console.log('\n🔗 Joining datasets...');

  const lycees = [];

  // Process GT
  for (const r of ivalGT) {
    const geo = geoMap.get(r.uai);
    const ips = ipsMap.get(r.uai);

    lycees.push({
      uai: r.uai,
      nom: titleCase(r.libelle_uai || ''),
      ville: titleCase(r.libelle_commune || ''),
      departement: titleCase(r.libelle_departement || ''),
      codeDept: r.code_departement,
      academie: titleCase(r.libelle_academie || ''),
      region: titleCase(r.libelle_region || ''),
      secteur: r.secteur || 'public',
      type: 'GT',
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
      adresse: geo?.adresse ?? '',
      codePostal: geo?.codePostal ?? '',
      presents: num(r.presents_total),
      tauxReussite: num(r.taux_reu_total),
      vaReussite: num(r.va_reu_total),
      tauxAcces: num(r.taux_acces_2nde),
      vaAcces: num(r.va_acces_2nde),
      tauxMention: num(r.taux_men_total),
      vaMention: num(r.va_men_total),
      ips: ips?.ips ?? ips?.ipsGT ?? null,
      ecartTypeIps: ips?.ecartTypeIps ?? null,
    });
  }

  // Process Pro
  for (const r of ivalPro) {
    const geo = geoMap.get(r.uai);
    const ips = ipsMap.get(r.uai);

    lycees.push({
      uai: r.uai,
      nom: titleCase(r.libelle_uai || ''),
      ville: titleCase(r.libelle_commune || ''),
      departement: titleCase(r.libelle_departement || ''),
      codeDept: r.code_departement,
      academie: titleCase(r.libelle_academie || ''),
      region: titleCase(r.libelle_region || ''),
      secteur: r.secteur || 'public',
      type: 'Pro',
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
      adresse: geo?.adresse ?? '',
      codePostal: geo?.codePostal ?? '',
      presents: num(r.presents_total),
      tauxReussite: num(r.taux_reu_total),
      vaReussite: num(r.va_reu_total),
      tauxAcces: num(r.taux_acces_2nde),
      vaAcces: num(r.va_acces_2nde),
      tauxMention: num(r.taux_men_total),
      vaMention: num(r.va_men_total),
      ips: ips?.ips ?? ips?.ipsPro ?? null,
      ecartTypeIps: ips?.ecartTypeIps ?? null,
    });
  }

  // Deduplicate: some lycées appear in both GT and Pro (polyvalents)
  // Keep them separate as they have different metrics per voie

  console.log(`\n✅ ${lycees.length} lycées (${ivalGT.length} GT + ${ivalPro.length} Pro)`);
  console.log(`   ${lycees.filter(l => l.lat).length} with geolocation`);
  console.log(`   ${lycees.filter(l => l.ips).length} with IPS`);

  // 6. Write output
  mkdirSync(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, 'lycees.json');

  // Also write metadata
  const meta = {
    year: YEAR,
    generatedAt: new Date().toISOString(),
    counts: {
      total: lycees.length,
      gt: ivalGT.length,
      pro: ivalPro.length,
      withGeo: lycees.filter(l => l.lat).length,
      withIps: lycees.filter(l => l.ips).length,
    },
  };

  writeFileSync(outPath, JSON.stringify({ meta, lycees }, null, 0));
  const sizeMB = (Buffer.byteLength(JSON.stringify({ meta, lycees })) / 1024 / 1024).toFixed(2);
  console.log(`\n📁 Written to ${outPath} (${sizeMB} MB)`);
}

function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
