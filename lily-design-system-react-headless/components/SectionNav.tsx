export interface SectionNavProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function SectionNav({
  className = "",
  label = undefined,
  children,
  ...restProps
}: SectionNavProps) {
  return (
    <nav
      className={`section-nav ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </nav>
  );
}
