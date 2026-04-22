export interface SectionListProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function SectionList({
  className = "",
  label = undefined,
  children,
  ...restProps
}: SectionListProps) {
  return (
    <ul
      className={`section-list ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </ul>
  );
}
