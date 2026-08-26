export interface TimeoutDialogProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function TimeoutDialog({
  className = "",
  label = undefined,
  children,
  ...restProps
}: TimeoutDialogProps) {
  return (
    <dialog
      className={`timeout-dialog ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </dialog>
  );
}
