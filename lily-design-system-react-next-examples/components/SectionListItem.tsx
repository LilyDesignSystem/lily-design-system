export interface SectionListItemProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function SectionListItem({
  className = "",
  label = undefined,
  children,
  ...restProps
}: SectionListItemProps) {
  return (
    <li
      className={`section-list-item ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </li>
  );
}
