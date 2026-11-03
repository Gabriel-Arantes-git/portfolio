interface PawnProps {
  className?: string;
}

export function Pawn({ className }: PawnProps) {
  return (
    <svg className={className} viewBox="0 0 40 52" aria-hidden="true" focusable="false">
      <circle cx="20" cy="11" r="8" />
      <rect x="15" y="19" width="10" height="4" />
      <path d="M17 23 H23 L26 36 H14 Z" />
      <rect x="9" y="36" width="22" height="5" />
      <rect x="5" y="41" width="30" height="8" />
    </svg>
  );
}
