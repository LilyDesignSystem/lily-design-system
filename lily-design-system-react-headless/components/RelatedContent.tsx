export interface RelatedContentProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function RelatedContent({
  className = "",
  label = undefined,
  children,
  ...restProps
}: RelatedContentProps) {
  return (
    <aside
      className={`related-content ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </aside>
  );
}
