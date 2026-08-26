export interface ScatterChartProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function ScatterChart({
  className = "",
  label = undefined,
  children,
  ...restProps
}: ScatterChartProps) {
  return (
    <figure
      className={`scatter-chart ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </figure>
  );
}
