export interface SharePageProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function SharePage({
  className = "",
  label = undefined,
  children,
  ...restProps
}: SharePageProps) {
  return (
    <div
      className={`share-page ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </div>
  );
}
