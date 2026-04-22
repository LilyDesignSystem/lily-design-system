export interface AddressInputProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function AddressInput({
  className = "",
  label = undefined,
  children,
  ...restProps
}: AddressInputProps) {
  return (
    <div
      className={`address-input ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </div>
  );
}
