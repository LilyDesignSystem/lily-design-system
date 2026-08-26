export interface AutosuggestProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function Autosuggest({
  className = "",
  label = undefined,
  children,
  ...restProps
}: AutosuggestProps) {
  return (
    <div
      className={`autosuggest ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </div>
  );
}
