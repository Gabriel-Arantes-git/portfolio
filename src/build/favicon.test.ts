import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');

describe('favicon', () => {
  it('o HTML aponta para o favicon SVG', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    expect(html).toMatch(/<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg"/);
  });

  it('o favicon usa só as cores da paleta e não carrega e-mail nem telefone', () => {
    const svg = readFileSync(join(root, 'public', 'favicon.svg'), 'utf8');
    const palette = new Set(['#3F1116', '#ED324E', '#FEEFDC']);
    const used = (svg.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).map((c) => c.toUpperCase());
    expect(used.length).toBeGreaterThan(0);
    for (const color of used) expect(palette.has(color)).toBe(true);
    expect(svg).not.toMatch(/@|mailto|wa\.me/);
  });
});
