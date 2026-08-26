export interface GoToTopProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function GoToTop({
  className = "",
  label = undefined,
  children,
  ...restProps
}: GoToTopProps) {
  return (
    <a
      className={`go-to-top ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </a>
  );
}
