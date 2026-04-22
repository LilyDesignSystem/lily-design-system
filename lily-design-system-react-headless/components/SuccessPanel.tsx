export interface SuccessPanelProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function SuccessPanel({
  className = "",
  label = undefined,
  children,
  ...restProps
}: SuccessPanelProps) {
  return (
    <div
      className={`success-panel ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </div>
  );
}
