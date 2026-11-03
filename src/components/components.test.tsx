import { render, screen } from '@testing-library/react';
import { Button } from './Button/Button';
import { Card } from './Card/Card';
import { Section } from './Section/Section';
import { Tag } from './Tag/Tag';

describe('componentes base', () => {
  it('Button renderiza botão e, com href externo, link seguro', () => {
    const { rerender } = render(<Button>Enviar</Button>);
    expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute('type', 'button');

    rerender(<Button href="https://example.com">Abrir</Button>);
    const link = screen.getByRole('link', { name: 'Abrir' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('Button com âncora interna não abre nova aba', () => {
    render(<Button href="#about">Sobre</Button>);
    const link = screen.getByRole('link', { name: 'Sobre' });
    expect(link).not.toHaveAttribute('target');
  });

  it('Card e Tag renderizam o conteúdo', () => {
    render(
      <Card>
        <Tag highlight>Java</Tag>
      </Card>,
    );
    expect(screen.getByText('Java')).toBeInTheDocument();
  });

  it('Section expõe região nomeada pelo título', () => {
    render(
      <Section id="about" index="01" title="Sobre">
        <p>conteúdo</p>
      </Section>,
    );
    expect(screen.getByRole('region', { name: 'Sobre' })).toBeInTheDocument();
  });
});
