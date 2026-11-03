import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projects } from '@/data/projects';
import { renderWithLang } from '@/test/renderWithLang';
import { Projects } from './Projects';

describe('ficha do projeto', () => {
  it('o cartão do Raposa tem faixa superior, selo, nome, três tópicos, trecho e rodapé', () => {
    renderWithLang(<Projects />);
    const card = screen.getByRole('heading', { name: 'Raposa' }).closest('article')!;
    const top = card.querySelector('header')!;
    expect(top).toHaveTextContent('Revisão de código');
    expect(top).toHaveTextContent('Em parceria com lvcas-dotcom');
    expect(top).toHaveTextContent('GO');

    expect(within(card).getAllByRole('listitem').length).toBe(3);
    expect(card.querySelector('pre')).toHaveTextContent('InsecureSkipVerify: true');
    expect(card.querySelector('pre')).toHaveTextContent('raposa: TLS sem verificação');

    const foot = card.querySelector('footer')!;
    expect(within(foot).getByText('Ollama')).toBeInTheDocument();
    expect(within(foot).getByRole('button', { name: /Ver detalhes.*Raposa/ })).toBeInTheDocument();
  });

  it('o trecho de código marca a linha adicionada e a removida com estilos diferentes', () => {
    renderWithLang(<Projects />);
    const pre = screen.getByRole('heading', { name: 'Raposa' }).closest('article')!.querySelector('pre')!;
    const [ctx, del, add, note] = [...pre.querySelectorAll('span')];
    expect(ctx).toHaveClass('ctx');
    expect(del).toHaveClass('del');
    expect(add).toHaveClass('add');
    expect(note).toHaveClass('note');
  });

  it('nenhum cartão traz estrelas nem datas de push inventadas', () => {
    for (const lang of ['pt', 'en'] as const) {
      const { container, unmount } = renderWithLang(<Projects />, lang);
      expect(container.textContent).not.toMatch(/★|push \d|stars?\b/i);
      unmount();
    }
    expect(JSON.stringify(projects)).not.toMatch(/★|push 0|estrelas/i);
  });

  it('todo projeto tem categoria, informação curta, selo e trecho nos dois idiomas', () => {
    for (const p of projects) {
      expect(p.kicker.pt && p.kicker.en && p.meta.pt && p.meta.en).toBeTruthy();
      expect(p.snippet.length).toBeGreaterThanOrEqual(3);
      const badge = typeof p.badge === 'string' ? p.badge : p.badge.pt + p.badge.en;
      expect(badge.length).toBeGreaterThan(0);
      for (const line of p.snippet) {
        const text = typeof line.text === 'string' ? line.text : line.text.pt + line.text.en;
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('em inglês traduz a categoria e o texto do trecho', () => {
    renderWithLang(<Projects />, 'en');
    const card = screen.getByRole('heading', { name: 'Raposa' }).closest('article')!;
    expect(card.querySelector('header')).toHaveTextContent('Code review');
    expect(card.querySelector('pre')).toHaveTextContent('TLS without verification');
  });
});

describe('cartão clicável', () => {
  it('clicar em qualquer parte do cartão abre os detalhes, e o botão também', async () => {
    renderWithLang(<Projects />);
    await userEvent.click(screen.getByRole('heading', { name: 'Raposa' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Raposa' })).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Fechar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    await userEvent.click(screen.getByRole('button', { name: /Ver detalhes.*pgfathom/ }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('o botão Ver detalhes ganha hover e alarga levemente', () => {
    const css = readFileSync(join(__dirname, 'ProjectCard.module.scss'), 'utf8');
    const more = css.slice(css.indexOf('.more {'));
    expect(more).toMatch(/&:hover/);
    expect(more).toMatch(/padding-inline:\s*0\.8rem/);
  });
});

describe('modal do projeto: rolagem do fundo', () => {
  it('trava a rolagem da página ao abrir e libera ao fechar', async () => {
    renderWithLang(<Projects />);
    const root = document.documentElement;
    expect(root.style.overflow).toBe('');

    await userEvent.click(screen.getByRole('button', { name: /Ver detalhes.*Raposa/ }));
    await screen.findByRole('dialog');
    expect(root.style.overflow).toBe('hidden');

    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Fechar' }));
    await waitFor(() => expect(root.style.overflow).toBe(''));
  });

  it('preserva um overflow que já existia e o devolve ao fechar', async () => {
    document.documentElement.style.overflow = 'scroll';
    renderWithLang(<Projects />);
    await userEvent.click(screen.getByRole('button', { name: /Ver detalhes.*pgfathom/ }));
    await screen.findByRole('dialog');
    expect(document.documentElement.style.overflow).toBe('hidden');
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Fechar' }));
    await waitFor(() => expect(document.documentElement.style.overflow).toBe('scroll'));
    document.documentElement.style.overflow = '';
  });

  it('reserva o espaço da barra de rolagem e contém a rolagem dentro do modal', () => {
    const global = readFileSync(join(__dirname, '..', '..', 'styles', 'global.scss'), 'utf8');
    expect(global).toMatch(/scrollbar-gutter:\s*stable/);
    const dialog = readFileSync(join(__dirname, 'ProjectDetail.module.scss'), 'utf8');
    expect(dialog).toMatch(/overscroll-behavior:\s*contain/);
  });
});
