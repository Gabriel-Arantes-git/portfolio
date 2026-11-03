import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { StackDivider } from '@/sections/StackDivider/StackDivider';
import { renderWithLang } from '@/test/renderWithLang';
import { Navbar } from './Navbar';

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
  act(() => {
    fireEvent.scroll(window);
  });
}

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Navbar', () => {
  it('no topo está no estado normal e tem os cinco links e o alternador de idioma', () => {
    renderWithLang(<Navbar />);
    expect(screen.getByRole('banner')).toHaveAttribute('data-state', 'top');
    const links = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(links).toEqual(['#top', '#about', '#timeline', '#projects', '#stack', '#contact']);
    expect(screen.getByRole('button', { name: 'Mudar para inglês' })).toBeInTheDocument();
  });

  it('ao rolar além de 80 px vira flutuante e ao voltar ao topo retorna', () => {
    renderWithLang(<Navbar />);
    scrollTo(300);
    expect(screen.getByRole('banner')).toHaveAttribute('data-state', 'floating');

    expect(screen.getByRole('button', { name: 'Mudar para inglês' })).toBeVisible();
    scrollTo(0);
    expect(screen.getByRole('banner')).toHaveAttribute('data-state', 'top');
  });

  it('não muda de estado com rolagem pequena', () => {
    renderWithLang(<Navbar />);
    scrollTo(40);
    expect(screen.getByRole('banner')).toHaveAttribute('data-state', 'top');
  });

  it('o botão de menu abre e fecha, anuncia o estado e fecha com Esc e ao escolher um link', async () => {
    renderWithLang(<Navbar />);
    const menu = screen.getByRole('button', { name: 'Menu' });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(menu);
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    await userEvent.click(screen.getByRole('link', { name: 'Projetos' }));
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('marca como atual o link da seção visível', () => {
    let notify: (entries: Array<{ isIntersecting: boolean; target: { id: string } }>) => void = () => {};
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: typeof notify) {
          notify = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
    const holder = document.createElement('div');
    holder.innerHTML = '<section id="projects"></section>';
    document.body.appendChild(holder);

    renderWithLang(<Navbar />);
    act(() => notify([{ isIntersecting: true, target: { id: 'projects' } }]));
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: 'Sobre' })).not.toHaveAttribute('aria-current');

    act(() => notify([{ isIntersecting: false, target: { id: 'projects' } }]));
    expect(screen.queryByRole('link', { current: 'location' })).not.toBeInTheDocument();
    holder.remove();
  });

  it('em inglês traduz os links', () => {
    renderWithLang(<Navbar />, 'en');
    expect(screen.getByRole('link', { name: 'Career' })).toBeInTheDocument();
  });
});

describe('faixa da stack', () => {
  it('passa tecnologias reais, não só a palavra Stack', () => {
    const { container } = renderWithLang(<StackDivider />);
    const text = container.textContent ?? '';
    for (const tech of ['Java · Spring Boot', 'Angular', 'React', 'IA', 'Kubernetes', 'MongoDB', 'RabbitMQ', 'Go']) {
      expect(text).toContain(tech);
    }
    expect(text).not.toMatch(/^(Stack■)+$/);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
