export interface PhaseBannerProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function PhaseBanner({
  className = "",
  label = undefined,
  children,
  ...restProps
}: PhaseBannerProps) {
  return (
    <div
      className={`phase-banner ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </div>
  );
}
