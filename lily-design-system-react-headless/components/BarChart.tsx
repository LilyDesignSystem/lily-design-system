export interface BarChartProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function BarChart({
  className = "",
  label = undefined,
  children,
  ...restProps
}: BarChartProps) {
  return (
    <figure
      className={`bar-chart ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </figure>
  );
}
