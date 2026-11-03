// AnnouncementBanner component
//
// A banner announcing news or a service notice. Renders a <div> with the `announcement-banner` hook;
// it adds no role, so pass role="region" through restProps.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   children — React.ReactNode, required. The announcement.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <AnnouncementBanner label="…">…</AnnouncementBanner>
//
// Examples:
//   <AnnouncementBanner label="Service notice">The service is closed on Monday.</AnnouncementBanner>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - No role is rendered; pass role="region" through restProps so the label is announced
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders role="region"; this React component does not (the Svelte one is canonical)
//
// References:
//   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

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
