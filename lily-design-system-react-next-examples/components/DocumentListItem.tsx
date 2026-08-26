export interface DocumentListItemProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function DocumentListItem({
  className = "",
  label = undefined,
  children,
  ...restProps
}: DocumentListItemProps) {
  return (
    <li
      className={`document-list-item ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </li>
  );
}
