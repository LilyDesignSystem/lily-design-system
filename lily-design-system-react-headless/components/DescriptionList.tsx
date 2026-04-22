export interface DescriptionListProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function DescriptionList({
  className = "",
  label = undefined,
  children,
  ...restProps
}: DescriptionListProps) {
  return (
    <dl
      className={`description-list ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </dl>
  );
}
