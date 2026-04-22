export interface SectionLinkProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function SectionLink({
  className = "",
  label = undefined,
  children,
  ...restProps
}: SectionLinkProps) {
  return (
    <a
      className={`section-link ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </a>
  );
}
