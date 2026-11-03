import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { useT } from '@/i18n/hooks';
import { LanguageToggle } from './LanguageToggle';

function Page() {
  const t = useT();
  return (
    <>
      <LanguageToggle />
      <h1>{t.nav.projects}</h1>
    </>
  );
}

describe('LanguageToggle', () => {
  it('troca o texto da página sem recarregar e indica o idioma ativo', async () => {
    render(
      <LanguageProvider>
        <Page />
      </LanguageProvider>,
    );

    const pt = screen.getByRole('button', { name: 'Mudar para português' });
    const en = screen.getByRole('button', { name: 'Mudar para inglês' });
    expect(pt).toHaveAttribute('aria-pressed', 'true');
    expect(en).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('heading')).toHaveTextContent('Projetos');

    await userEvent.click(en);

    expect(screen.getByRole('heading')).toHaveTextContent('Projects');
    expect(screen.getByRole('button', { name: 'Switch to English' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('o separador PT|EN é do contêiner: nenhum botão desenha a própria borda com a cor do texto', () => {
    const css = readFileSync(join(__dirname, 'LanguageToggle.module.scss'), 'utf8');

    expect(css).not.toMatch(/&\s*\+\s*&\s*\{[^}]*border/);
    expect(css).toMatch(/\.toggle\s*\{[\s\S]*&::after\s*\{[^}]*background:\s*currentcolor/);
  });
});
