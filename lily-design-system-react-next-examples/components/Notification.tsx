// Notification component
//
// A headless notification/toast message that delivers timely messages to users
// about events, updates, or actions. It renders a <div> with ARIA live region
// semantics, using role="status" with aria-live="polite" by default, or
// role="alert" with aria-live="assertive" when urgent. Commonly used for
// success confirmations, error alerts, and informational updates.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name for the notification region via aria-label.
//   urgent — boolean, default false. When true, uses role="alert" and aria-live="assertive".
//   children — ReactNode, required. The notification message content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Notification label="Success">Message here.</Notification>
//
// Examples:
//   
//   <Notification label="Success">Your changes have been saved.</Notification>
//
//   
//   <Notification label="Error" urgent>Something went wrong. Please try again.</Notification>
//
//   
//   <Notification>3 new messages</Notification>
//
// Keyboard:
//   None — this is a passive announcement container; screen readers announce
//   content automatically via ARIA live regions without user interaction.
//
// Accessibility:
//   - role="status" (default) for polite, non-urgent announcements
//   - role="alert" (when urgent) for assertive, immediate announcements
//   - aria-label provides an accessible name for the notification region
//   - aria-live="polite" (default) waits for user idle before announcing
//   - aria-live="assertive" (when urgent) interrupts the user immediately
//
// Internationalization:
//   - All text content comes through the children prop and label prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - The urgent prop switches both the role and aria-live simultaneously
//   - Do not add close/dismiss logic — consumer manages notification lifecycle
//
// References:
//   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
//   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
//   - WAI-ARIA Live Regions: https://www.w3.org/WAI/ARIA/apd/practices/live-regions/

import React from "react";

export interface NotificationProps {
    className?: string;
    label?: string;
    urgent?: boolean;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Notification({
    className = "",
    label = undefined,
    urgent = false,
    children,
    ...restProps
}: NotificationProps) {
    return (
        <div
        className={`notification ${className}`}
        role={urgent ? "alert" : "status"}
        aria-label={label}
        aria-live={urgent ? "assertive" : "polite"}
        {...restProps}
        >
        {children}
        </div>
    );
}
