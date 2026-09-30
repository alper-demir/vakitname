// Development-only import. No network access is made by the application.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/import-geodata.mjs <source-directory>');
const raw = fs.readFileSync(path.join(input, 'TR.txt'), 'utf8');
const rows = raw.trim().split('\n').map((line) => {
  const r = line.split('\t');
  return { id: r[0], name: r[1], latitude: +r[4], longitude: +r[5], feature: r[7], province: r[10], district: r[11], population: +r[14] };
});
const clean = (s) => s.replace(/ (İlçesi|ilçesi|Ilcesi|District|Province)$/, '').replace('Elâzığ', 'Elazığ');
const normalize = (s) => clean(s).toLocaleLowerCase('tr').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/ı/g, 'i');
const admins = rows.filter((r) => r.feature === 'ADM1');
if (admins.length !== 81) throw new Error(`Expected 81 provinces, got ${admins.length}`);
const provinces = admins.map((p) => {
  const capital = rows.find((r) => r.province === p.province && ['PPLA', 'PPLC'].includes(r.feature));
  if (!capital) throw new Error(`Missing capital: ${p.name}`);
  return { id: p.id, name: clean(p.name), code: p.province, latitude: capital.latitude, longitude: capital.longitude };
}).sort((a, b) => a.name.localeCompare(b.name, 'tr'));
const districts = rows.filter((r) => r.feature === 'ADM2').map((d) => {
  const province = provinces.find((p) => p.code === d.province);
  if (!province) throw new Error(`Missing parent for ${d.name}`);
  const candidates = rows.filter((r) => r.province === d.province && ['PPLA2', 'PPLA', 'PPLC', 'PPL', 'PPLX'].includes(r.feature));
  const seat = candidates.find((r) => r.district === d.id && r.feature === 'PPLA2')
    ?? candidates.find((r) => normalize(r.name) === normalize(d.name));
  return { id: d.id, name: clean(d.name), provinceId: province.id, latitude: (seat ?? d).latitude, longitude: (seat ?? d).longitude, coordinateKind: seat ? 'seat' : 'representative' };
}).sort((a, b) => a.name.localeCompare(b.name, 'tr'));
const countries = JSON.parse(fs.readFileSync(path.join(input, 'countries.geojson'), 'utf8'));
const turkey = countries.features.find((f) => f.properties.ADM0_A3 === 'TUR');
if (!turkey || turkey.geometry.type !== 'MultiPolygon') throw new Error('Missing Turkey boundary');
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/locations.json', JSON.stringify({ provinces, districts }));
fs.writeFileSync('src/data/turkey-boundary.json', JSON.stringify(turkey.geometry.coordinates));
const metadata = { retrieved: new Date().toISOString().slice(0, 10), geonamesSha256: crypto.createHash('sha256').update(raw).digest('hex'), provinces: provinces.length, districts: districts.length, representativeCoordinates: districts.filter((d) => d.coordinateKind === 'representative').length };
fs.writeFileSync('src/data/geodata-metadata.json', JSON.stringify(metadata, null, 2) + '\n');
console.log(metadata);
