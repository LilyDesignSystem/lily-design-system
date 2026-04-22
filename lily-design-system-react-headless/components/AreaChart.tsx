export interface AreaChartProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function AreaChart({
  className = "",
  label = undefined,
  children,
  ...restProps
}: AreaChartProps) {
  return (
    <figure
      className={`area-chart ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </figure>
  );
}
