export interface DocumentListProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function DocumentList({
  className = "",
  label = undefined,
  children,
  ...restProps
}: DocumentListProps) {
  return (
    <ul
      className={`document-list ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </ul>
  );
}
