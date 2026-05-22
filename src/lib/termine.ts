import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface Termin {
  tag: string;
  monat: string;
  titel: string;
  ort: string;
  linkUrl: string;
  linkText: string;
  datum: Date;
}

const MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let field = '';
  let inQuotes = false;
  for (const c of line) {
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      fields.push(field.trim());
      field = '';
    } else {
      field += c;
    }
  }
  fields.push(field.trim());
  return fields;
}

export function getTermine(): Termin[] {
  const csv = readFileSync(join(process.cwd(), 'termine.csv'), 'utf-8');
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  const termine: Termin[] = [];

  for (const line of csv.trim().split('\n').slice(1)) {
    const [datum = '', titel = '', ort = '', linkUrl = '', linkText = ''] = parseCSVLine(line);
    if (!datum) continue;

    const [tt, mm, jjjj] = datum.split('.');
    const startDatum = new Date(Number(jjjj), Number(mm) - 1, Number(tt));
    startDatum.setHours(23, 59, 59, 999);
    if (startDatum < heute) continue;

    const safeUrl = /^https?:\/\//i.test(linkUrl) ? linkUrl : '';
    termine.push({
      tag: tt.replace(/^0/, '') + '.',
      monat: MONATE[startDatum.getMonth()],
      titel,
      ort,
      linkUrl: safeUrl,
      linkText,
      datum: startDatum,
    });
  }

  return termine.sort((a, b) => a.datum.getTime() - b.datum.getTime());
}
