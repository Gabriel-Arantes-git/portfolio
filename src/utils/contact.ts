import { contactFragments } from '@/data/contact';

export function decodeContact(parts: readonly string[]): string {
  const base64 = [...parts.join('')].reverse().join('');
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeContact(text: string, size = 7): string[] {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const reversed = [...btoa(binary)].reverse().join('');
  const parts: string[] = [];
  for (let i = 0; i < reversed.length; i += size) parts.push(reversed.slice(i, i + size));
  return parts;
}

export function revealEmail(): { address: string; href: string } {
  const address = decodeContact(contactFragments.email);
  return { address, href: `mailto:${address}` };
}

export function revealWhatsapp(): { label: string; href: string } {
  const digits = decodeContact(contactFragments.phone);
  const label = digits.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 $2 $3-$4');
  return { label, href: `https://wa.me/${digits}` };
}

export function openEmail(): void {
  window.open(revealEmail().href, '_self');
}

export function openWhatsapp(): void {
  window.open(revealWhatsapp().href, '_blank', 'noopener,noreferrer');
}
