// Banner component
//
// A headless banner for displaying prominent messages at the top or bottom
// of an interface. Renders as a <div role="region"> with aria-live="polite"
// and data-type for consumer styling. Supports optional dismiss functionality
// with a close button. Commonly used for site announcements, cookie notices,
// session warnings, and maintenance alerts.
//
// Props:
//   className — string, optional. CSS class name.
//   type        — "info" | "success" | "warning" | "error", default "info".
//                 Semantic variant exposed as data-type.
//   dismissible — boolean, default false. Whether the banner can be dismissed.
//   onClose     — () => void, optional. Callback when the banner is dismissed.
//   closeLabel  — string, optional. Accessible label for the dismiss button
//                 (e.g., "Close banner" or "Dismiss").
//   children    — ReactNode, required. The banner content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Banner>Message</Banner>
//   <Banner dismissible closeLabel="Close" onClose={handler}>Message</Banner>
//
// Examples:
//   
//   <Banner>Important announcement here.</Banner>
//
//   
//   <Banner type="warning" dismissible closeLabel="Dismiss"
//     onClose={handleDismiss}>
//     Your session will expire soon.
//   </Banner>
//
//   
//   <Banner type="error" data-testid="error-banner">
//     Service unavailable. Please try again later.
//   </Banner>
//
// Keyboard:
//   - Tab: Focus the dismiss button (when dismissible)
//   - Enter / Space: Activate the dismiss button
//
// Accessibility:
//   - role="region" for landmark identification
//   - aria-live="polite" for announcing content changes
//   - Dismiss button has aria-label from closeLabel prop
//   - data-type exposes variant for consumer styling
//
// Internationalization:
//   - All text comes through children prop and closeLabel prop
//   - No hardcoded strings; consumer provides dismiss button label
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Internal visible state tracks dismissal; removed from DOM when dismissed
//   - onClose callback fires after visibility is set to false
//   - Consumer provides close button content/icon via closeLabel
//   - data-type is for styling hooks, not semantics
//
// References:
//   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

import React, { useState } from "react";

export interface BannerProps {
    className?: string;
    /** Banner variant for semantic meaning */
    type?: "info" | "success" | "warning" | "error";
    /** Whether the banner can be dismissed */
    dismissible?: boolean;
    /** Callback when the banner is dismissed */
    onClose?: () => void;
    /** Accessible label for the dismiss button */
    closeLabel?: string;
    /** The banner content */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Banner({
    className = "",
    type = "info",
    dismissible = false,
    onClose = undefined,
    closeLabel = undefined,
    children,
    ...restProps
}: BannerProps) {
    const [visible, setVisible] = useState(true);

    function dismiss() {
        setVisible(false);
        onClose?.();
    }

    return (
        <>
        {visible && (<><div
        className={`banner ${className}`}
        role="region"
        aria-live="polite"
        data-type={type}
        {...restProps}
        >
        {children}
        {dismissible && (<><button
        type="button"
        aria-label={closeLabel}
        onClick={dismiss}
        ></button></>)}
        </div></>)}
        </>
    );
}
