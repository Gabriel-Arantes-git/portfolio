import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'vite';

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

describe('build publicado', () => {
  it('não contém e-mail nem telefone legíveis em nenhum arquivo (spec stack-contact)', async () => {
    const outDir = mkdtempSync(join(tmpdir(), 'portfolio-dist-'));
    try {
      await build({ logLevel: 'silent', build: { outDir, emptyOutDir: true, write: true } });
      const files = walk(outDir).filter((f) => /\.(html|js|css|json|txt|svg|map)$/.test(f));
      expect(files.length).toBeGreaterThan(2);

      const found: string[] = [];
      for (const file of files) {
        const text = readFileSync(file, 'utf8');
        if (/arantes\.gabriel21/i.test(text)) found.push(`${file}: local-part do e-mail`);

        if (/[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(text)) found.push(`${file}: padrão de e-mail`);
        if (/5544\s?9?\s?9122\s?-?7490|99122[-\s]?7490|991227490/.test(text)) found.push(`${file}: telefone`);
        if (/mailto:[^"')\s]+@/.test(text) || /wa\.me\/\d{8,}/.test(text)) found.push(`${file}: link de contato`);
      }
      expect(found).toEqual([]);

      const bundle = files.filter((f) => f.endsWith('.js')).map((f) => readFileSync(f, 'utf8')).join('\n');
      expect(bundle).toContain('linkedin.com/in/gabriel-arantes21');
    } finally {
      rmSync(outDir, { recursive: true, force: true });
    }
  }, 90_000);
});
