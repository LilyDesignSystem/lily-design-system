export interface BackToTopProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function BackToTop({
  className = "",
  label = undefined,
  children,
  ...restProps
}: BackToTopProps) {
  return (
    <a
      className={`back-to-top ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </a>
  );
}
