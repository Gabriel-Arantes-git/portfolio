import type { ReactNode, SVGProps } from 'react';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number };

function Svg({ size = 22, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function EmailIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M3 6 L12 13 L21 6" />
    </Svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 3 H20 V17 H11 L6 21 V17 H4 Z" />
      <path
        d="M9 7.5 L10.8 7.5 L11.8 9.8 L10.8 10.8 C11.4 12 12 12.6 13.2 13.2 L14.2 12.2 L16.5 13.2 L16.5 15 C12.6 15.6 8.4 11.4 9 7.5 Z"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}
