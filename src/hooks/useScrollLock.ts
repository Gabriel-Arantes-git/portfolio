import { useEffect } from 'react';

export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    const { scrollX, scrollY } = window;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
      // Fechar o diálogo devolve o foco ao cartão que o abriu e o navegador rola até ele;
      // com `scroll-behavior: smooth` isso vira um salto visível. Restaura a posição de antes.
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
    };
  }, [locked]);
}
