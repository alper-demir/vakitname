import { readFileSync } from 'node:fs';
import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';
import { DateTime } from 'luxon';

const MAX_ALLOWED_DIFFERENCE_MINUTES = 2;
const dates = [
  ['2026-10-22', '22 Ekim 2026'],
  ['2027-01-21', '21 Ocak 2027'],
  ['2027-02-08', '08 Şubat 2027'],
  ['2027-03-21', '21 Mart 2027'],
  ['2027-06-21', '21 Haziran 2027'],
];
const cities = [
  ['İstanbul', 9541, 'istanbul-icin-namaz-vakti'],
  ['Ankara', 9206, 'ankara-icin-namaz-vakti'],
  ['İzmir', 9560, 'izmir-namaz-vakitleri'],
  ['Antalya', 9225, 'antalya-icin-namaz-vakti'],
  ['Sinop', 9847, 'sinop-namaz-vakitleri'],
  ['Erzurum', 9451, 'erzurum-icin-namaz-vakti'],
  ['Iğdır', 9522, 'igdir-icin-namaz-vakti'],
];

const catalog = JSON.parse(readFileSync(new URL('../src/data/locations.json', import.meta.url), 'utf8'));
const toMinutes = (value) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
const text = (value) => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/\s+/g, ' ')
  .trim();

function officialRows(html) {
  const rows = [];
  for (const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => text(cell[1]));
    if (cells.length >= 8 && /^\d{2} /.test(cells[0])) rows.push(cells);
  }
  return rows;
}

function calculatedTimes(date, latitude, longitude) {
  const [year, month, day] = date.split('-').map(Number);
  const params = CalculationMethod.Turkey();
  params.adjustments = { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
  const times = new PrayerTimes(new Coordinates(latitude, longitude), new Date(year, month - 1, day, 12), params);
  return [times.fajr, times.sunrise, times.dhuhr, times.asr, times.maghrib, times.isha]
    .map((value) => DateTime.fromJSDate(value).setZone('Europe/Istanbul').toFormat('HH:mm'));
}

let checked = 0;
let totalAbsoluteDifference = 0;
let largestDifference = 0;
const failures = [];

for (const [city, placeId, slug] of cities) {
  const location = catalog.provinces.find((item) => item.name === city);
  if (!location) throw new Error(`${city} katalogda bulunamadı`);
  const url = `https://namazvakitleri.diyanet.gov.tr/tr-TR/${placeId}/${slug}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'Vakit accuracy verifier/1.0' } });
  if (!response.ok) throw new Error(`${city} resmî tablosu alınamadı: HTTP ${response.status}`);
  const rows = officialRows(await response.text());
  for (const [date, label] of dates) {
    const row = rows.find((item) => item[0].startsWith(label));
    if (!row) throw new Error(`${city} ${label} resmî tabloda bulunamadı`);
    const official = row.slice(2, 8);
    const calculated = calculatedTimes(date, location.latitude, location.longitude);
    const differences = calculated.map((value, index) => toMinutes(value) - toMinutes(official[index]));
    const maximum = Math.max(...differences.map(Math.abs));
    checked += 1;
    totalAbsoluteDifference += differences.reduce((sum, value) => sum + Math.abs(value), 0);
    largestDifference = Math.max(largestDifference, maximum);
    if (maximum > MAX_ALLOWED_DIFFERENCE_MINUTES) failures.push({ city, date, official, calculated, differences });
    console.log(`${city.padEnd(9)} ${date}  fark [${differences.map((value) => String(value).padStart(2)).join(', ')}]  en çok ${maximum} dk`);
  }
}

const mean = totalAbsoluteDifference / (checked * 6);
console.log(`\n${checked} şehir-tarih satırı, ${checked * 6} vakit; ortalama mutlak fark ${mean.toFixed(2)} dk, en büyük fark ${largestDifference} dk.`);
if (failures.length) {
  console.error(`İki dakikalık inceleme eşiğini aşan ${failures.length} satır var.`);
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
