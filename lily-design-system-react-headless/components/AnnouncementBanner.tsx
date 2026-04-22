export interface AnnouncementBannerProps {
  className?: string;
  label?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function AnnouncementBanner({
  className = "",
  label = undefined,
  children,
  ...restProps
}: AnnouncementBannerProps) {
  return (
    <div
      className={`announcement-banner ${className}`}
      aria-label={label}
      {...restProps}
    >
      {children}
    </div>
  );
}
