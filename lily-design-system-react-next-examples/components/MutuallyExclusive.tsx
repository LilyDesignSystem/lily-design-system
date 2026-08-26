export interface MutuallyExclusiveProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function MutuallyExclusive({
  className = "",
  label = undefined,
  children,
  ...restProps
}: MutuallyExclusiveProps) {
  return (
    <fieldset
      className={`mutually-exclusive ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </fieldset>
  );
}
