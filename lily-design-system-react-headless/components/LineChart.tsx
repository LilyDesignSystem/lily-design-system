export interface LineChartProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function LineChart({
  className = "",
  label = undefined,
  children,
  ...restProps
}: LineChartProps) {
  return (
    <figure
      className={`line-chart ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </figure>
  );
}
