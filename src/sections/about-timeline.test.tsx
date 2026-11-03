import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { education } from '@/data/education';
import { exchange } from '@/data/exchange';
import { stops } from '@/data/experience';
import { recommendations } from '@/data/recommendations';
import { en } from '@/i18n/en';
import { pt } from '@/i18n/pt';
import { renderWithLang } from '@/test/renderWithLang';
import { About } from './About/About';
import { Timeline } from './Timeline/Timeline';

const words = (text: string) => text.trim().split(/\s+/).length;

describe('conteúdo bilíngue', () => {
  it('texto lateral do Sobre mim cabe em até 65 palavras por idioma', () => {
    expect(words(pt.about.body)).toBeLessThanOrEqual(65);
    expect(words(en.about.body)).toBeLessThanOrEqual(65);
  });

  it('todo conteúdo tem PT e EN preenchidos', () => {
    const texts: string[] = [];
    const push = (x: { pt: string | string[]; en: string | string[] }) =>
      texts.push(...[x.pt, x.en].flat());
    push(education.degree.title);
    push(education.degree.period);
    education.certifications.forEach(push);
    push(education.english.level);
    push(education.english.course);
    push(exchange.format);
    push(exchange.duration);
    push(exchange.theme);
    push(exchange.objective);
    push(exchange.planned);
    exchange.modules.forEach((m) => push(m.description));
    recommendations.forEach((r) => {
      push(r.role);
      push(r.relation);
      push(r.date);
      push(r.text);
      expect(r.text.pt.length).toBe(r.text.en.length);
    });
    stops.forEach((stop) => {
      if (stop.totalDuration) push(stop.totalDuration);
      if (stop.footer) push(stop.footer);
      push(stop.role);
      push(stop.period);
      push(stop.summary);
      expect(stop.summary.pt.length).toBe(stop.summary.en.length);
    });
    expect(texts.length).toBeGreaterThan(30);
    expect(texts.every((t) => t.trim().length > 0)).toBe(true);
  });
});

describe('Sobre mim', () => {
  it('mostra foto com alt, três cartões flutuantes e a palavra em destaque', () => {
    renderWithLang(<About />);
    expect(screen.getByRole('img', { name: /Gabriel Arantes/ })).toBeInTheDocument();
    expect(screen.getByText('Intercâmbio')).toBeInTheDocument();
    expect(screen.getByText('Foco atual')).toBeInTheDocument();
    expect(screen.getByText('Stack principal')).toBeInTheDocument();
    expect(screen.getByText('dados').tagName).toBe('MARK');
  });

  it('o foco é evoluir tecnicamente: sem gestão pública no texto, no cartão de foco e na lista', () => {
    const { container } = renderWithLang(<About />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/gest[ãa]o p[úu]blica/i);
    expect(screen.getByText('Evoluir tecnicamente')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Objetivos' })).toBeInTheDocument();
    expect(text).not.toMatch(/Testes e qualidade de código|O que estou aprimorando/);
    for (const item of [
      'Identificar requisitos e valor de negócio',
      'Arquitetar soluções de alta performance, escalabilidade e confiabilidade em aplicações',
      'Equipe pautada em assertividade e eficiência',
      'Arquitetura de IA implementada no fluxo de trabalho',
    ]) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    expect(pt.about.body).not.toMatch(/gest[ãa]o p[úu]blica/i);
    expect(en.about.body).not.toMatch(/public (sector|management)/i);
  });

  it('o cartão de objetivos tem os quatro pontos também em inglês', () => {
    renderWithLang(<About />, 'en');
    const card = screen.getByRole('complementary');
    expect(within(card).getByRole('heading', { name: 'Objectives' })).toBeInTheDocument();
    expect(within(card).getAllByRole('listitem').length).toBe(4);
    expect(card.textContent).toMatch(/AI architecture implemented in the workflow/);
  });

  it('o texto termina falando da graduação e das hard e soft skills, sem repetir o intercâmbio', () => {
    expect(pt.about.body).toMatch(/graduação em Engenharia de Software e busco oportunidades de aprimorar minhas hard e soft skills\.$/);
    expect(pt.about.body).not.toMatch(/FAU|embarco/);
    expect(en.about.body).toMatch(/hard and soft skills\.$/);
    expect(en.about.body).not.toMatch(/FAU/);
  });

  it('o objetivo do intercâmbio fala em entrega eficiente de resultados que agregam valor', () => {
    expect(exchange.objective.pt).toMatch(/aprimorar a entrega de resultados eficiente e que agregue valor\.$/);
    expect(exchange.objective.pt).not.toMatch(/startups|empreendedorismo/);
    expect(exchange.objective.en).toMatch(/results that adds value\.$/);
  });

  it('o cartão extra fica ao lado do texto, na mesma coluna', () => {
    renderWithLang(<About />);
    const body = screen.getByText(/Engenheiro de Software e dev fullstack/);
    const card = screen.getByRole('complementary');
    expect(body.parentElement).toBe(card.parentElement);
  });

  it('responsivo: cartões flutuantes só saem da foto (offset negativo) a partir de 960 px e empilham entre 768 e 959', () => {
    const css = readFileSync(join(__dirname, 'About', 'About.module.scss'), 'utf8');
    const desktop = css.search(/@include m\.up\(t\.\$bp-md\) \{\s*\.chipExchange/);
    expect(desktop).toBeGreaterThan(0);
    expect(css.slice(0, desktop)).not.toMatch(/(left|right):\s*-\d/);
    expect(css).toMatch(/\$floating-chips:\s*'\(min-width: #\{t\.\$bp-sm\}\) and \(max-width: #\{t\.\$bp-tablet - 1px\}\), \(min-width: #\{t\.\$bp-md\}\)'/);
    expect(css).not.toMatch(/@include m\.up\(t\.\$bp-sm\)/);
  });

  it('a foto principal é colorida: sem filtro de cinza nem sobreposição duotone no CSS', () => {
    const css = readFileSync(join(__dirname, '..', 'components', 'FramedPhoto', 'FramedPhoto.module.scss'), 'utf8');
    expect(css).not.toMatch(/grayscale|mix-blend-mode|sepia/);
  });

  it('cada recomendação mostra o retrato de quem recomendou', () => {
    renderWithLang(<About />);
    for (const name of ['Alexandre José Messiano', 'Alexandre Moreno']) {
      const img = screen.getByRole('img', { name });
      expect(img).toHaveAttribute('src');
      expect(img.getAttribute('src')).toMatch(/messiano|moreno/i);
    }
  });

  it('formação, certificações e inglês aparecem compactos', () => {
    renderWithLang(<About />);
    expect(screen.getByText('Bacharelado em Engenharia de Software')).toBeInTheDocument();
    expect(screen.getByText('Banco de Dados e SQL com PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('Intermediário')).toBeInTheDocument();
    expect(screen.getByText(/Mister Wiz/)).toBeInTheDocument();
  });

  it('o intercâmbio é um botão expansível: fechado esconde o conteúdo, aberto mostra tema, objetivo e os três módulos', async () => {
    renderWithLang(<About />);
    const toggle = screen.getByRole('button', { name: /Intercâmbio na FAU/ });
    const region = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(region).toHaveAttribute('aria-hidden', 'true');
    expect(region).toHaveAttribute('inert');

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(region).toHaveAttribute('aria-hidden', 'false');
    expect(region).not.toHaveAttribute('inert');

    expect(screen.getByText('Innovation Management in the Digital Economy')).toBeInTheDocument();
    expect(within(region).getAllByText('1 mês').length).toBeGreaterThan(0);
    for (const title of [
      'Managing Innovation Ecosystems',
      'Rethinking organizational models',
      'Agile techniques',
    ]) {
      expect(within(region).getByText(title)).toBeInTheDocument();
    }
    expect(screen.getByText(/jul\/2027/)).toBeInTheDocument();

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(region).toHaveAttribute('aria-hidden', 'true');
  });

  it('cada módulo vira uma conquista numerada e desbloqueada, com atraso escalonado', async () => {
    renderWithLang(<About />);
    await userEvent.click(screen.getByRole('button', { name: /Intercâmbio na FAU/ }));
    for (const badge of ['Gestão', 'Negócio', 'Resultado']) {
      expect(screen.getByText(badge)).toBeInTheDocument();
    }
    expect(screen.queryByText(/desbloqueado/)).toBeNull();
    const items = [...document.querySelectorAll('ol > li')].filter((li) => li.getAttribute('style')?.includes('--i'));
    expect(items.map((li) => (li as HTMLElement).style.getPropertyValue('--i'))).toEqual(['0', '1', '2']);
  });

  it('os três cartões da foto e o cartão de objetivos caem em sequência, e a foto não', () => {
    renderWithLang(<About />);
    const chips = [...document.querySelectorAll('li[class*="chip"]')] as HTMLElement[];
    expect(chips.map((chip) => chip.style.getPropertyValue('--i'))).toEqual(['0', '1', '2']);
    const goals = screen.getByRole('heading', { name: 'Objetivos' }).closest('aside') as HTMLElement;
    expect(goals.style.getPropertyValue('--i')).toBe('3');
    const photoFrame = document.querySelector('img')!.closest('figure, div') as HTMLElement;
    expect(photoFrame.style.getPropertyValue('--i')).toBe('');
    const css = readFileSync(join(__dirname, 'About', 'About.module.scss'), 'utf8');
    expect(css).toMatch(/section\[data-revealed\] \.chip,\s*section\[data-revealed\] \.improving/);
    expect(css).toMatch(/@keyframes fall/);
  });

  it('o intercâmbio mostra a ilustração do avião, decorativa', () => {
    const { container } = renderWithLang(<About />);
    const art = container.querySelector('svg[aria-hidden="true"]');
    expect(art).not.toBeNull();
    expect(art!.querySelector('animateMotion')).not.toBeNull();
    expect(art!.textContent).toContain('Maringá');
    expect(art!.textContent).toContain('FAU');
  });

  it('o avião fica parado, sem animação, com movimento reduzido', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: true,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const { container } = renderWithLang(<About />);
    expect(container.querySelector('animateMotion')).toBeNull();
    vi.unstubAllGlobals();
  });

  it('recomendações em PT são o texto original, na íntegra', () => {
    renderWithLang(<About />);
    expect(screen.getByText('Não recomendo trabalhar com ele..')).toBeInTheDocument();
    expect(
      screen.getByText(/Brincadeiras à parte, recomendo seu trabalho sem qualquer ressalva/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Algoritmos e Estrutura de Dados/)).toBeInTheDocument();
    expect(screen.getByText('Alexandre José Messiano')).toBeInTheDocument();
    expect(screen.getByText('Alexandre Moreno')).toBeInTheDocument();
  });

  it('em inglês traduz as recomendações mantendo as duas, inclusive o fecho', () => {
    renderWithLang(<About />, 'en');
    expect(screen.getByText("I don't recommend working with him..")).toBeInTheDocument();
    expect(screen.getByText(/Jokes aside, I recommend his work without any reservation/)).toBeInTheDocument();
    expect(screen.getByText('About me')).toBeInTheDocument();
  });
});

describe('Trajetória', () => {
  it('quatro paradas numeradas, na ordem pedida', () => {
    renderWithLang(<Timeline />);
    const outer = screen.getAllByRole('list')[0];
    expect(outer.tagName).toBe('OL');
    expect(within(outer).queryAllByRole('heading', { level: 4 }).length).toBe(0);
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual([
      'Estágio, Suporte de Dados / TI',
      'Engenheiro de Dados e Desenvolvimento',
      'Full Stack Engineer',
      'Software Engineer, Full Stack',
    ]);
    const lines = [...document.querySelectorAll('ol > li > article header p')].map((p) => p.textContent);
    expect(lines).toEqual([
      'Tributech Gestão Pública · Maringá, PR',
      'Tributech Gestão Pública · Maringá, PR',
      'Tributech Gestão Pública · Maringá, PR',
      'Axion · Maringá, PR',
    ]);

    expect([...document.querySelectorAll('ol > li > article header > span')].map((n) => n.textContent)).toEqual([
      '01',
      '02',
      '03',
      '04',
    ]);
  });

  it('a Axion mostra o cargo no título, Axion antes de Maringá e, no rodapé do cartão, Consultoria Júnior', () => {
    const { container } = renderWithLang(<Timeline />);
    const title = screen.getByRole('heading', { level: 3, name: 'Software Engineer, Full Stack' });
    const card = title.closest('article')!;
    expect(card.querySelector('header p')).toHaveTextContent(/^Axion · Maringá, PR$/);
    expect(card.querySelector('footer')).toHaveTextContent('Consultoria Júnior');
    expect(container.textContent).not.toMatch(/Consultoria Júnior de Tecnologia|Unicesumar\)/);
    expect(container.textContent).not.toMatch(/hospital|veterin/i);
  });

  it('em inglês o rodapé da Axion é Junior Consultancy', () => {
    renderWithLang(<Timeline />, 'en');
    const card = screen.getByRole('heading', { level: 3, name: 'Software Engineer, Full Stack' }).closest('article')!;
    expect(card.querySelector('footer')).toHaveTextContent('Junior Consultancy');
  });

  it('o tempo total da Tributech aparece no cargo mais recente dela', () => {
    renderWithLang(<Timeline />);
    expect(screen.getByText(/1 ano e 10 meses/)).toBeInTheDocument();
    expect(screen.getAllByText('Atual').length).toBe(2);
  });

  it('cada parada tem a sua ilustração, todas diferentes: mapa e dados na Tributech, eventos na Axion', () => {
    const { container } = renderWithLang(<Timeline />);
    const arts = [...container.querySelectorAll('svg[data-art]')];
    expect(arts.map((a) => a.getAttribute('data-art'))).toEqual(['reports', 'data-flow', 'city-map', 'events']);
    expect(new Set(arts.map((a) => a.innerHTML)).size).toBe(4);
    arts.forEach((a) => expect(a).toHaveAttribute('aria-hidden', 'true'));
  });

  it('mostra as etiquetas de tecnologias por cargo', () => {
    renderWithLang(<Timeline />);
    for (const tag of ['Spring Boot', 'Angular TS', 'REST', 'Git/GitLab', 'Pentaho', 'React']) {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    }
  });

  it('não cita município cliente nem dado tributário', () => {
    const { container } = renderWithLang(<Timeline />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/prefeitura|munic[ií]pio de|R\$\s?\d/i);
  });

  it('em inglês usa duração e períodos em inglês', () => {
    renderWithLang(<Timeline />, 'en');
    expect(screen.getByText(/1 year 10 months/)).toBeInTheDocument();
    expect(screen.getByText(/Nov 2025 – present/)).toBeInTheDocument();
  });

  it('cada parada tem um X (marcador decorativo) para o caminho do mapa', () => {
    const { container } = renderWithLang(<Timeline />);
    const markers = [...container.querySelectorAll('[data-marker]')];
    expect(markers.map((m) => m.getAttribute('data-marker'))).toEqual(['0', '1', '2', '3']);
    markers.forEach((m) => expect(m).toHaveAttribute('aria-hidden', 'true'));
  });
});
