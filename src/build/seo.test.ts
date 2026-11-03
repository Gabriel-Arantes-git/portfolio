import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');
const site = 'https://arantes.switchhub.dev/';
const html = readFileSync(join(root, 'index.html'), 'utf8');

const meta = (attr: 'name' | 'property', key: string): string | undefined =>
  html.match(new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`, 's'))?.[1];

describe('SEO', () => {
  it('tem título, descrição, canonical e robots coerentes com o endereço final', () => {
    expect(html).toMatch(/<title>Gabriel Arantes — Engenheiro de Software/);
    expect(meta('name', 'description')!.length).toBeGreaterThan(80);
    expect(meta('name', 'description')!.length).toBeLessThan(200);
    expect(html).toContain(`<link rel="canonical" href="${site}" />`);
    expect(meta('name', 'robots')).toMatch(/index, follow/);
  });

  it('tem Open Graph e Twitter Card com imagem 1200x630 que existe em public', () => {
    expect(meta('property', 'og:url')).toBe(site);
    expect(meta('property', 'og:type')).toBe('website');
    expect(meta('property', 'og:title')).toBeTruthy();
    expect(meta('property', 'og:description')).toBeTruthy();
    expect(meta('property', 'og:image')).toBe(`${site}og-image.png`);
    expect(meta('property', 'og:image:width')).toBe('1200');
    expect(meta('property', 'og:image:height')).toBe('630');
    expect(meta('name', 'twitter:card')).toBe('summary_large_image');
    expect(meta('name', 'twitter:image')).toBe(`${site}og-image.png`);
    const image = join(root, 'public', 'og-image.png');
    expect(existsSync(image)).toBe(true);
    expect(statSync(image).size).toBeLessThan(300_000);
  });

  it('o JSON-LD é uma Person válida, ligada ao LinkedIn e GitHub, sem e-mail nem telefone', () => {
    const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1];
    const data = JSON.parse(raw);
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Gabriel Arantes');
    expect(data.url).toBe(site);
    expect(data.sameAs).toEqual([
      'https://www.linkedin.com/in/gabriel-arantes21/',
      'https://github.com/Gabriel-Arantes-git',
    ]);
    expect(raw).not.toMatch(/@[\w-]+\.[a-z]{2,}|mailto|wa\.me|telephone|email|99122/i);
  });

  it('robots.txt libera tudo e aponta o sitemap, que lista a página inicial', () => {
    const robots = readFileSync(join(root, 'public', 'robots.txt'), 'utf8');
    expect(robots).toMatch(/User-agent: \*\s+Allow: \//);
    expect(robots).toContain(`Sitemap: ${site}sitemap.xml`);
    const sitemap = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8');
    expect(sitemap).toContain(`<loc>${site}</loc>`);
  });
});
