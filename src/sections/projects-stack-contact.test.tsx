import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { contactFragments } from '@/data/contact';
import { SCOPES, projects, projectsByScope } from '@/data/projects';
import { primaryStack, secondaryStack } from '@/data/stack';
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
    expect(projectsByScope('professional').length).toBe(2);
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
    expect(tabs.map((t) => t.textContent)).toEqual(['03Próprios', '03Consultoria Jr.', '02Profissional']);
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
  it('mostra as cinco principais e as secundárias em níveis separados', () => {
    renderWithLang(<Stack />);
    const [primary, secondary] = screen.getAllByRole('list');
    expect(within(primary).getAllByRole('listitem').length).toBe(primaryStack.length);
    expect(within(primary).getByText('Java')).toBeInTheDocument();
    expect(within(primary).getByText('Spring Boot')).toBeInTheDocument();
    for (const name of ['PostgreSQL', 'Node.js', 'Angular', 'React']) {
      expect(within(primary).getByText(name)).toBeInTheDocument();
    }
    expect(within(secondary).getAllByRole('listitem').length).toBe(secondaryStack.length);
    for (const name of ['Go', 'AWS', 'RabbitMQ', 'Kafka', 'MongoDB']) {
      expect(within(secondary).getByText(name)).toBeInTheDocument();
    }
  });

  it('IA é uma tecnologia de destaque, com nome e detalhe nos dois idiomas', () => {
    const { unmount } = renderWithLang(<Stack />);
    const ia = screen.getByText('IA', { selector: 'strong' }).closest('li')!;
    expect(ia).toHaveTextContent('Arquitetura em fluxos de trabalho');
    expect(ia).not.toHaveClass('featured');
    unmount();
    renderWithLang(<Stack />, 'en');
    const ai = screen.getByText('AI', { selector: 'strong' }).closest('li')!;
    expect(ai).toHaveTextContent('Architecture in workflows');
  });

  it('com seis blocos de destaque a grade fecha sem buraco (nenhum bloco precisa ocupar o resto da linha)', () => {
    expect(primaryStack.length % 3).toBe(0);
  });

  it('o realce escuro é do Java e do Angular, e não do React', () => {
    renderWithLang(<Stack />);
    const item = (name: string) => screen.getByText(name, { selector: 'strong' }).closest('li')!;
    expect(item('Java')).toHaveClass('featured');
    expect(item('Angular')).toHaveClass('featured');
    expect(item('React')).not.toHaveClass('featured');
    expect(primaryStack.filter((t) => t.featured).map((t) => t.name)).toEqual(['Java', 'Angular']);
  });

  it('as secundárias têm tamanho de leitura (16 px) e são bem menores que as de destaque', () => {
    const css = readFileSync(join(__dirname, 'Stack', 'Stack.module.scss'), 'utf8');
    const chip = css.slice(css.indexOf('.chip {'));
    expect(chip).toMatch(/font-size:\s*1rem/);
    const name = css.slice(css.indexOf('.name {'), css.indexOf('.detail {'));
    expect(name).toMatch(/clamp\(2\.2rem/);
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
