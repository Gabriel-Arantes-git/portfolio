import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const SRC = join(ROOT, 'src');
const TOKENS = join(SRC, 'styles', '_tokens.scss');
const EXT = /\.(scss|css|ts|tsx|html)$/;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXT.test(name)) out.push(full);
  }
  return out;
}

const files = [...walk(SRC), join(ROOT, 'index.html')].filter(
  (f) => f !== TOKENS && !/\.test\.tsx?$/.test(f),
);

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
const rel = (f: string) => relative(ROOT, f).split(sep).join('/');

describe('guarda do tema', () => {
  it('não há cor hex literal fora de _tokens.scss', () => {
    const offenders: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
        .replace(/&#\d+;|href="#[^"]*"|to="#[^"]*"/g, '');
      const hits = text.match(HEX);
      if (hits) offenders.push(`${rel(f)}: ${hits.join(', ')}`);
    }
    expect(offenders).toEqual([]);
  });

  it('não há border-radius diferente de zero nem gradiente suave nos estilos', () => {
    const offenders: string[] = [];
    for (const f of files.filter((x) => /\.s?css$/.test(x))) {
      const text = readFileSync(f, 'utf8');
      for (const m of text.matchAll(/border-radius\s*:\s*([^;]+);/g)) {
        if (!/^0(px)?$/.test(m[1].trim())) offenders.push(`${rel(f)}: border-radius ${m[1]}`);
      }
      if (/(linear|radial|conic)-gradient\(/.test(text)) offenders.push(`${rel(f)}: gradient`);
    }
    expect(offenders).toEqual([]);
  });

  it('não há sombra com desfoque', () => {
    const offenders: string[] = [];
    for (const f of files.filter((x) => /\.s?css$/.test(x))) {
      const text = readFileSync(f, 'utf8');
      if (/(drop-shadow|text-shadow|filter\s*:\s*blur)/.test(text)) offenders.push(rel(f));
    }
    expect(offenders).toEqual([]);
  });
});
