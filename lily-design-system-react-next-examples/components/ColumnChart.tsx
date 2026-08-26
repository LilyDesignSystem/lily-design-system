export interface ColumnChartProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function ColumnChart({
  className = "",
  label = undefined,
  children,
  ...restProps
}: ColumnChartProps) {
  return (
    <figure
      className={`column-chart ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </figure>
  );
}
