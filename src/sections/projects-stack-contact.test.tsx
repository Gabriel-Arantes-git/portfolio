import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { contactFragments } from '@/data/contact';
import { SCOPES, projects, projectsByScope } from '@/data/projects';
import { board, originIds, primaryStack, secondaryStack } from '@/data/stack';
import { usageOf } from '@/data/stackUsage';
import { pathNodes } from '@/data/path';
import { layoutBoard, trailFraction, trailPath } from '@/utils/boardLayout';
import { renderWithLang } from '@/test/renderWithLang';
import { decodeContact, encodeContact, revealEmail, revealWhatsapp } from '@/utils/contact';
import { Contact } from './Contact/Contact';
import { Projects } from './Projects/Projects';
import { Stack } from './Stack/Stack';

describe('dados dos projetos', () => {
  it('distribui os projetos nos três escopos pedidos', () => {
    expect(projectsByScope('own').map((p) => p.name)).toEqual(['Raposa', 'pgfathom', 'Dynamic IA Ecosystem']);
    expect(projectsByScope('consulting').map((p) => p.name)).toEqual([
      'I COUNI',
      'WorkInTech',
      'Organização de eventos',
    ]);
    expect(projectsByScope('professional').length).toBe(4);
    expect(SCOPES).toEqual(['own', 'consulting', 'professional']);
  });

  it('links externos são https, públicos e nenhum aponta para o repositório privado', () => {
    const hrefs = projects.flatMap((p) => [...p.links.map((l) => l.href), ...(p.credit ? [p.credit.href] : [])]);
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toMatch(/^https:\/\//);
      expect(href).not.toMatch(/Dynamic-IA-Ecosystem/i);
    }
    const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
    expect(byId.icouni.links[0].href).toBe('https://www.counicesumar.com.br/');
    expect(byId.workintech.links[0].href).toBe('https://www.workintech.com.br/');
  });

  it('cartão do vault fica sem link e avisa que o repositório genérico vem depois', () => {
    const vault = projects.find((p) => p.id === 'vault')!;
    expect(vault.links).toEqual([]);
    expect(vault.status?.pt).toMatch(/em breve/i);
  });

  it('Raposa e pgfathom creditam a co-autoria com lvcas-dotcom e linkam o repositório dele', () => {
    for (const id of ['raposa', 'pgfathom']) {
      const p = projects.find((x) => x.id === id)!;
      expect(p.credit?.text.pt).toMatch(/lvcas-dotcom/);
      expect(p.links[0].href).toMatch(/github\.com\/lvcas-dotcom\//);
    }
  });

  it('nada de município cliente nem dado interno do vault nos textos públicos', () => {
    const all = JSON.stringify(projects);
    expect(all).not.toMatch(/prefeitura|git\.tributech|gitlab\.|api\/v4/i);
  });

  it('sem Hospital Veterinário e sem a gestão pública como foco dos projetos', () => {
    const all = JSON.stringify(projects);
    expect(all).not.toMatch(/hospital|veterin/i);
    expect(all).not.toMatch(/gest[ãa]o p[úu]blica|public management|public-management/i);
  });

  it('organização de eventos não é apresentada como fullstack', () => {
    const events = projects.find((p) => p.id === 'events-organization')!;
    const tags = events.tech.map((t) => (typeof t === 'string' ? t : t.pt));
    expect(tags).not.toContain('Fullstack');
    expect(JSON.stringify(events)).not.toMatch(/fullstack|full stack/i);
    expect(tags).toEqual(['Eventos', 'Equipes', 'Gestão']);
  });
});

describe('Projects', () => {
  it('abre no escopo Próprios, com as três abas', () => {
    renderWithLang(<Projects />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(['03Próprios', '03Consultoria Jr.', '04Profissional']);
    expect(screen.getByRole('tab', { name: /Próprios/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: 'Raposa' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'I COUNI' })).not.toBeInTheDocument();
  });

  it('troca de escopo: os cartões antigos saem e os novos entram', async () => {
    renderWithLang(<Projects />);
    await userEvent.click(screen.getByRole('tab', { name: /Consultoria Jr\./ }));

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('data-phase', 'out');
    expect(within(panel).getByRole('heading', { name: 'Raposa' })).toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole('heading', { name: 'I COUNI' })).toBeInTheDocument());
    expect(screen.queryByRole('heading', { name: 'Raposa' })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Consultoria Jr\./ })).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(screen.getByRole('tabpanel')).toHaveAttribute('data-phase', 'idle'));
  });

  it('setas, Home e End navegam pelas abas e ativam', async () => {
    renderWithLang(<Projects />);
    const first = screen.getByRole('tab', { name: /Próprios/ });
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /Consultoria Jr\./ })).toHaveFocus();
    expect(screen.getByRole('tab', { name: /Consultoria Jr\./ })).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: /Profissional/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /Próprios/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: /Profissional/ })).toHaveFocus();
    await waitFor(() => expect(screen.getByRole('tabpanel')).toHaveAttribute('data-phase', 'idle'));
  });

  it('com movimento reduzido a troca é imediata', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: true,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    renderWithLang(<Projects />);
    await userEvent.click(screen.getByRole('tab', { name: /Profissional/ }));
    expect(screen.getByRole('tabpanel')).toHaveAttribute('data-phase', 'idle');
    expect(screen.getByRole('heading', { name: 'Plataforma principal' })).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it('detalhe do I COUNI mostra entregas, stack, 5 semanas e o depoimento; fecha pelo botão', async () => {
    renderWithLang(<Projects />);
    await userEvent.click(screen.getByRole('tab', { name: /Consultoria Jr\./ }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'I COUNI' })).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /Ver detalhes.*I COUNI/ }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/do zero ao ar em 5 semanas/i)).toBeInTheDocument();
    expect(within(dialog).getByText('Emissão automática de certificados.')).toBeInTheDocument();
    expect(within(dialog).getByText('Next.js')).toBeInTheDocument();
    expect(within(dialog).getByText('PostgreSQL')).toBeInTheDocument();
    expect(within(dialog).getByText(/o comprometimento com o projeto e a qualidade do material/)).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: 'Visitar site' })).toHaveAttribute(
      'href',
      'https://www.counicesumar.com.br/',
    );

    await userEvent.click(within(dialog).getByRole('button', { name: 'Fechar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('fecha também quando o dialog dispara close (Esc nativo)', async () => {
    renderWithLang(<Projects />);
    await userEvent.click(screen.getByRole('button', { name: /Ver detalhes.*Raposa/ }));
    const dialog = await screen.findByRole('dialog');
    act(() => {
      fireEvent(dialog, new Event('close'));
    });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('detalhe do vault não tem botão de link e avisa que o repositório vem depois', async () => {
    renderWithLang(<Projects />);
    await userEvent.click(screen.getByRole('button', { name: /Ver detalhes.*Dynamic IA Ecosystem/ }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).queryByRole('link')).not.toBeInTheDocument();
    expect(within(dialog).getByText('Repositório genérico em breve')).toBeInTheDocument();
  });

  it('cartão do Raposa mostra a co-autoria e o detalhe linka o repositório do parceiro', async () => {
    renderWithLang(<Projects />);
    expect(screen.getAllByText('Em parceria com lvcas-dotcom').length).toBe(2);
    await userEvent.click(screen.getByRole('button', { name: /Ver detalhes.*Raposa/ }));
    const dialog = await screen.findByRole('dialog');
    const repo = within(dialog).getByRole('link', { name: 'Ver repositório' });
    expect(repo).toHaveAttribute('href', 'https://github.com/lvcas-dotcom/raposa');
    expect(repo).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('em inglês traduz abas e cartões', () => {
    renderWithLang(<Projects />, 'en');
    expect(screen.getByRole('tab', { name: /Junior consultancy/ })).toBeInTheDocument();
    expect(screen.getByText(/Local code reviewer backed by verifiable evidence/)).toBeInTheDocument();
  });
});

describe('Stack', () => {
  const square = (name: RegExp) => {
    const hit = [...document.querySelectorAll<HTMLButtonElement>('button.stone')].find((b) =>
      name.test(b.querySelector('strong')?.textContent ?? ''),
    );
    if (!hit) throw new Error(String(name));
    return hit;
  };
  const cellOf = (name: RegExp) => square(name).closest('li')!;
  const more = (name: RegExp) => square(name);

  it('segue a ordem da trajetória: faculdade, estágio, tecnologias, cargos e, por fim, atualmente', () => {
    renderWithLang(<Stack />);
    const path = screen.getByRole('list', { name: 'Tabuleiro da stack' });
    const cells = within(path).getAllByRole('listitem');
    expect(cells.length).toBe(pathNodes.length);
    const names = cells.map((cell) => cell.querySelector('strong')!.textContent);
    expect(names).toEqual([
      'Faculdade',
      'Estágio',
      'PostgreSQL',
      'MySQL',
      'Dados',
      'Node.js',
      'React',
      'Docker',
      'Full Stack',
      'Java',
      'Angular',
      'Go',
      'Kubernetes',
      'AWS',
      'Oracle',
      'MongoDB',
      'RabbitMQ',
      'IA',
      'Axion',
      'Atualmente',
    ]);
    expect(path).not.toHaveTextContent(/kafka|chegada|início/i);
    expect(cells.filter((cell) => cell.className.includes('primary')).length).toBe(primaryStack.length);
    expect(cells.filter((cell) => cell.className.includes('secondary')).length).toBe(secondaryStack.length);
  });

  it('a legenda diz uso no dia a dia, atua com projetos com e mais experiência', () => {
    renderWithLang(<Stack />);
    expect(screen.getByText('Uso no dia a dia')).toBeInTheDocument();
    expect(screen.getByText('Atua com projetos com')).toBeInTheDocument();
    expect(screen.getByText('Tecnologias com mais experiência')).toBeInTheDocument();
    expect(screen.queryByText('Já fiz projetos com')).toBeNull();
  });

  it('não há fundo quadriculado e há imagens decorativas escondidas dos leitores de tela', () => {
    renderWithLang(<Stack />);
    expect(document.querySelector('pattern')).toBeNull();
    const props = document.querySelectorAll('[data-scenery]');
    expect(props.length).toBeGreaterThanOrEqual(3);
    for (const prop of props) expect(prop.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('Atualmente é só o peão com o nome, sem quadrado, e abre a ficha EM DESENVOLVIMENTO só ao clicar (o hover só contorna)', async () => {
    renderWithLang(<Stack />);
    const cells = within(screen.getByRole('list', { name: 'Tabuleiro da stack' })).getAllByRole('listitem');
    const now = cells[cells.length - 1];
    const piece = within(now).getByRole('button');
    expect(piece).toHaveTextContent('Atualmente');
    expect(piece.className).not.toContain('stone');
    expect(piece.querySelector('svg')).toHaveTextContent('');
    expect(now.querySelector('[role="group"]')).toBeNull();

    await userEvent.hover(piece);
    expect(screen.queryByRole('complementary')).toBeNull();

    await userEvent.click(piece);
    expect(await screen.findByRole('complementary')).toHaveTextContent('EM DESENVOLVIMENTO');
  });

  it('ao abrir uma casa destaca o caminho percorrido até ela, e limpa ao fechar', async () => {
    renderWithLang(<Stack />);
    expect(document.querySelectorAll('[data-walked]').length).toBe(0);
    await userEvent.click(more(/^Java$/));
    const walked = [...document.querySelectorAll('li[data-walked]')].map((li) => li.querySelector('strong')!.textContent);
    expect(walked).toEqual(['Faculdade', 'Estágio', 'PostgreSQL', 'MySQL', 'Dados', 'Node.js', 'React', 'Docker', 'Full Stack', 'Java']);
    expect(walked[0]).toBe('Faculdade');
    expect(walked[walked.length - 1]).toBe('Java');
    expect(walked).not.toContain('Angular');
    expect(document.querySelector('[class*="walked"]')).toBeInTheDocument();
    await userEvent.click(within(screen.getByRole('complementary')).getByRole('button', { name: 'Fechar' }));
    await waitFor(() => expect(document.querySelectorAll('[data-walked]').length).toBe(0));
    expect(document.querySelector('[class*="walked"]')).toBeNull();
  });

  it('a primeira casa mostra a faculdade e a trajetória mostra cargo e período', () => {
    renderWithLang(<Stack />);
    const start = within(cellOf(/^Faculdade$/)).getByRole('group', { name: 'Faculdade' });
    expect(start).toHaveTextContent('Unicesumar');
    expect(start).toHaveTextContent('jan/2024');
    const last = within(cellOf(/^Axion$/)).getByRole('group', { name: 'Axion' });
    expect(last).toHaveTextContent('fev/2026');
  });

  it('cada casa de stack tem painel com origem, contagem e Clique para ver mais', () => {
    renderWithLang(<Stack />);
    const panel = within(cellOf(/^Java$/)).getByRole('group', { name: 'Java' });
    for (const origin of ['Cargo', 'Curso', 'Projeto']) expect(panel).toHaveTextContent(origin);
    expect(panel).toHaveTextContent(/\d+ Cargos · \d+ Projetos/);
    expect(panel).toHaveTextContent('Clique para ver mais');
    expect(within(panel).queryByRole('button')).toBeNull();
  });

  it('Ver mais abre o painel dentro da seção com cargos, projetos e cursos; fecha por botão e Esc', async () => {
    renderWithLang(<Stack />);
    await userEvent.click(more(/^Java$/));
    const panel = await screen.findByRole('complementary', { name: 'Java' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(within(panel).getByText('Full Stack Engineer')).toBeInTheDocument();
    expect(within(panel).getByText('Plataforma principal')).toBeInTheDocument();
    expect(within(panel).getByText('Integrador geral')).toBeInTheDocument();
    expect(within(panel).getByText('Java + Programação Orientada a Objetos')).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: 'Fechar' })).toHaveFocus();

    await userEvent.click(within(panel).getByRole('button', { name: 'Fechar' }));
    await waitFor(() => expect(screen.queryByRole('complementary')).toBeNull());
    expect(square(/^Java$/)).toHaveFocus();

    await userEvent.click(more(/^Angular$/));
    await screen.findByRole('complementary', { name: 'Angular' });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('complementary')).toBeNull());
  });

  it('a faculdade e os cargos também abrem a ficha com os dados certos', async () => {
    renderWithLang(<Stack />);
    await userEvent.click(more(/^Faculdade$/));
    const degree = await screen.findByRole('complementary');
    expect(within(degree).getByRole('heading', { name: 'Bacharelado em Engenharia de Software' })).toBeInTheDocument();
    expect(within(degree).getByText('Banco de Dados e SQL com PostgreSQL')).toBeInTheDocument();
    await userEvent.click(within(degree).getByRole('button', { name: 'Fechar' }));
    await waitFor(() => expect(screen.queryByRole('complementary')).toBeNull());

    await userEvent.click(more(/^Axion$/));
    const job = await screen.findByRole('complementary');
    expect(within(job).getByRole('heading', { name: 'Software Engineer, Full Stack' })).toBeInTheDocument();
    expect(within(job).getByText('Next.js')).toBeInTheDocument();
  });

  it('só liga cargos, projetos e cursos que realmente usam a tecnologia; sem registro, avisa', () => {
    const unknown = usageOf({
      id: 'x',
      name: 'Nada',
      kind: { pt: 'Teste', en: 'Test' },
      tier: 'secondary',
      aliases: ['Nada'],
    });
    expect(unknown.roles.length + unknown.projects.length + unknown.courses.length).toBe(0);
    expect(unknown.origins).toEqual([]);

    const go = usageOf(board.find((item) => item.id === 'go')!);
    expect(go.projects.map((p) => p.id)).toEqual(
      expect.arrayContaining(['raposa', 'pgfathom', 'tributech-integrator', 'tributech-platform']),
    );
    expect(go.origins).toEqual(['job', 'project']);
    const postgres = usageOf(board.find((item) => item.id === 'postgresql')!);
    expect(postgres.courses.length).toBe(1);
    expect(postgres.origins).toEqual(expect.arrayContaining(['course', 'project']));
  });

  it('a faculdade é a fonte de curso das tecnologias que não vêm de uma certificação', () => {
    const find = (id: string) => usageOf(board.find((item) => item.id === id)!);
    for (const id of ['react', 'nodejs', 'aws', 'oracle', 'docker', 'mysql', 'mongodb', 'kubernetes']) {
      const usage = find(id);
      expect(usage.origins).toContain('course');
      expect(usage.courses.map((c) => c.pt)).toContain('Bacharelado em Engenharia de Software');
    }
    expect(find('nodejs').roles.map((r) => r.id)).toEqual(['tributech-data']);
    expect(find('mysql').roles.map((r) => r.id)).toEqual(['tributech-intern', 'tributech-data']);
    expect(find('docker').projects.map((p) => p.id)).toEqual(
      expect.arrayContaining(['tributech-platform', 'tributech-metrics']),
    );
  });

  it('quem foi usado na aplicação principal também vem do cargo anterior na trilha', () => {
    const find = (id: string) => usageOf(board.find((item) => item.id === id)!);
    expect(find('docker').roles.map((r) => r.id)).toEqual(['tributech-data']);
    for (const id of ['java', 'angular', 'go', 'rabbitmq']) {
      expect(find(id).projects.map((p) => p.id)).toContain('tributech-platform');
      expect(find(id).roles.map((r) => r.id)).toContain('tributech-fullstack');
      expect(find(id).origins).toContain('job');
    }
    expect(find('go').roles.map((r) => r.id)).toEqual(['tributech-fullstack']);
    expect(find('kubernetes').roles).toEqual([]);
  });

  it('as origens vêm do cadastro e nenhuma é inventada', () => {
    const valid = new Set(originIds);
    for (const item of board) {
      const usage = usageOf(item);
      expect(usage.origins.every((id) => valid.has(id))).toBe(true);
      expect(usage.origins.includes('job')).toBe(usage.roles.length > 0);
      expect(usage.origins.includes('course')).toBe(usage.courses.length > 0);
      expect(usage.origins.includes('project')).toBe(usage.projects.length > 0);
    }
  });

  it('em inglês traduz a legenda, o botão e os nomes das etapas', async () => {
    renderWithLang(<Stack />, 'en');
    expect(screen.getByText('Journey')).toBeInTheDocument();
    expect(cellOf(/^College$/)).toBeInTheDocument();
    expect(cellOf(/^AI$/)).toHaveTextContent('Architecture in workflows');
    await userEvent.click(more(/^College$/));
    expect(await screen.findByRole('complementary')).toHaveTextContent("Bachelor's in Software Engineering");
  });

  it('o realce escuro de stack é do Java e do Angular, e não do React', () => {
    renderWithLang(<Stack />);
    expect(cellOf(/^Java$/)).toHaveClass('featured');
    expect(cellOf(/^Angular$/)).toHaveClass('featured');
    expect(cellOf(/^React$/)).not.toHaveClass('featured');
    expect(primaryStack.filter((t) => t.featured).map((t) => t.name)).toEqual(['Java', 'Angular']);
  });
});

describe('layout do tabuleiro', () => {
  it('gera um ponto por casa dentro da largura, de forma determinística e sem linhas retas', () => {
    const a = layoutBoard(21, 1200, 480);
    const b = layoutBoard(21, 1200, 480);
    expect(a.points.length).toBe(21);
    expect(a).toEqual(b);
    for (const point of a.points) {
      expect(point.x).toBeGreaterThanOrEqual(a.size / 2);
      expect(point.x).toBeLessThanOrEqual(1200 - a.size / 2);
    }
    const firstRow = a.points.slice(0, a.perRow).map((point) => Math.round(point.y));
    expect(new Set(firstRow).size).toBeGreaterThan(1);
  });

  it('o tabuleiro sempre cabe na altura disponível e encolhe quando a ficha ocupa a lateral', () => {
    for (const height of [380, 480, 600]) {
      const full = layoutBoard(21, 1200, height);
      const squeezed = layoutBoard(21, 844, height);
      expect(full.height).toBeLessThanOrEqual(height + 1);
      expect(squeezed.height).toBeLessThanOrEqual(height + 1);
      expect(squeezed.size).toBeLessThanOrEqual(full.size);
    }
  });

  it('sem limite de altura (celular) usa poucas colunas e cresce para baixo', () => {
    const phone = layoutBoard(21, 360, null);
    expect(phone.perRow).toBe(3);
    expect(phone.height).toBeGreaterThan(layoutBoard(21, 1200, 480).height);
  });

  it('o trecho vermelho usa a mesma curva da trilha tracejada: a fração cresce até 1 na última casa', () => {
    const { points } = layoutBoard(21, 1200, 480);
    const fractions = points.map((_, index) => trailFraction(points, index));
    expect(fractions[0]).toBe(0);
    expect(fractions[points.length - 1]).toBeCloseTo(1, 5);
    for (let i = 1; i < fractions.length; i += 1) expect(fractions[i]).toBeGreaterThan(fractions[i - 1]);
  });

  it('a trilha liga todas as casas com curvas', () => {
    const { points } = layoutBoard(21, 1200, 480);
    const d = trailPath(points);
    expect(d.startsWith('M')).toBe(true);
    expect(d.match(/C/g)!.length).toBe(20);
    expect(trailPath([points[0]])).toBe('');
  });
});

describe('contato sem raspagem', () => {
  beforeEach(() => {
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fragmentos decodificam para os valores certos e estão em sincronia', () => {
    expect(revealEmail().address).toBe('arantes.gabriel21@gmail.com');
    expect(revealEmail().href).toBe('mailto:arantes.gabriel21@gmail.com');
    expect(revealWhatsapp()).toEqual({ label: '+55 44 99122-7490', href: 'https://wa.me/5544991227490' });
    expect([...encodeContact('arantes.gabriel21@gmail.com')]).toEqual([...contactFragments.email]);
    expect([...encodeContact('5544991227490', 5)]).toEqual([...contactFragments.phone]);
    expect(decodeContact(encodeContact('olá, ação'))).toBe('olá, ação');
  });

  it('o DOM nunca contém e-mail, telefone, mailto: nem wa.me, nem depois de clicar', async () => {
    const { container } = renderWithLang(<Contact />);
    const forbidden = /@|arantes\.gabriel21|9\s?9122|7490|mailto:|wa\.me/i;
    expect(container.innerHTML).not.toMatch(forbidden);
    await userEvent.click(screen.getByRole('button', { name: /E-mail/ }));
    await userEvent.click(screen.getByRole('button', { name: /WhatsApp/ }));
    expect(container.innerHTML).not.toMatch(forbidden);
  });

  it('há botões com ícone de e-mail e de WhatsApp, com nome acessível', () => {
    renderWithLang(<Contact />);
    const email = screen.getByRole('button', { name: /^E-mail\s*—\s*enviar uma mensagem$/ });
    const whatsapp = screen.getByRole('button', { name: /^WhatsApp\s*—\s*abrir a conversa$/ });
    for (const button of [email, whatsapp]) {
      const icon = button.querySelector('svg');
      expect(icon).not.toBeNull();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
    expect(screen.queryByRole('button', { name: /mostrar|show/i })).not.toBeInTheDocument();
  });

  it('o botão de e-mail abre uma mensagem nova direto, sem sair da página', async () => {
    renderWithLang(<Contact />);
    await userEvent.click(screen.getByRole('button', { name: /E-mail/ }));
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith('mailto:arantes.gabriel21@gmail.com', '_self');
  });

  it('o botão de WhatsApp abre a conversa em nova aba, sem expor a página de origem', async () => {
    renderWithLang(<Contact />);
    await userEvent.click(screen.getByRole('button', { name: /WhatsApp/ }));
    expect(window.open).toHaveBeenCalledWith('https://wa.me/5544991227490', '_blank', 'noopener,noreferrer');
  });

  it('LinkedIn e GitHub seguem como links diretos e seguros', () => {
    renderWithLang(<Contact />);
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/gabriel-arantes21/',
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/Gabriel-Arantes-git',
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('a chamada do contato é "Quer entrar em contato?" (e em inglês, "Want to get in touch?")', () => {
    const { unmount } = renderWithLang(<Contact />);
    expect(screen.getByText('Quer entrar em contato?')).toBeInTheDocument();
    expect(screen.queryByText(/Tem um projeto/)).not.toBeInTheDocument();
    unmount();
    renderWithLang(<Contact />, 'en');
    expect(screen.getByText('Want to get in touch?')).toBeInTheDocument();
  });

  it('o texto antigo sobre contato revelado sob demanda não aparece mais', () => {
    const { container } = renderWithLang(<Contact />);
    expect(container.textContent).not.toMatch(/revelado|raspad|revealed|scrape/i);
  });

  it('em inglês os botões são traduzidos', () => {
    renderWithLang(<Contact />, 'en');
    expect(screen.getByRole('button', { name: /^Email\s*—\s*send a message$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^WhatsApp\s*—\s*open the chat$/ })).toBeInTheDocument();
  });
});
