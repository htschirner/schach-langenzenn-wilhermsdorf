import { parse } from 'node-html-parser';

export interface Bericht {
  datum: string;
  datumDate: Date;
  titel: string;
  autor: string;
  inhalt: string;
}

// Nach Anlegen des Berichte-Tabs im Google Sheet hier die URL eintragen:
const BERICHTE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1iyj-v-hL2WlCWk5GUCAM_ZucjrTi-YPsWqe3K8NDECk/export?format=csv&gid=1561421590';

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

function cleanDocHtml(rawHtml: string): string {
  const root = parse(rawHtml);
  const body = root.querySelector('body');
  if (!body) return '';

  for (const el of body.querySelectorAll('script, style, img')) {
    el.remove();
  }

  for (const el of body.querySelectorAll('*')) {
    const isLink = el.tagName === 'A';
    const keep = isLink ? ['href'] : [];
    for (const attr of Object.keys(el.attributes)) {
      if (!keep.includes(attr)) el.removeAttribute(attr);
    }
    if (isLink) {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  }

  return body.innerHTML;
}

export async function getBerichte(): Promise<Bericht[]> {
  if (!BERICHTE_SHEET_URL) return [];

  const res = await fetch(BERICHTE_SHEET_URL);
  if (!res.ok) return [];
  const csv = await res.text();

  const results = await Promise.all(
    csv.trim().split('\n').slice(1).map(async (line) => {
      const [datum = '', titel = '', autor = '', docId = ''] = parseCSVLine(line);
      if (!datum || !docId.trim()) return null;

      const [tt, mm, jjjj] = datum.split('.');
      const datumDate = new Date(Number(jjjj), Number(mm) - 1, Number(tt));

      const docRes = await fetch(`https://docs.google.com/document/d/${docId.trim()}/export?format=html`);
      if (!docRes.ok) return null;
      const inhalt = cleanDocHtml(await docRes.text());

      return { datum, datumDate, titel, autor, inhalt } as Bericht;
    })
  );

  return results
    .filter((b): b is Bericht => b !== null)
    .sort((a, b) => b.datumDate.getTime() - a.datumDate.getTime());
}
