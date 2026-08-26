export interface DescriptionListItemProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function DescriptionListItem({
  className = "",
  label = undefined,
  children,
  ...restProps
}: DescriptionListItemProps) {
  return (
    <div
      className={`description-list-item ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </div>
  );
}
