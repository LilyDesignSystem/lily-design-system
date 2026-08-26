export interface StatusTagProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function StatusTag({
  className = "",
  label = undefined,
  children,
  ...restProps
}: StatusTagProps) {
  return (
    <span
      className={`status-tag ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </span>
  );
}
