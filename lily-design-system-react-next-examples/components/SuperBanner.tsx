// SuperBanner component
//
// A high-priority page-level banner that interrupts the user with a
// system-wide message: outage, security alert, regulatory notice. Renders
// a <div role="alert" aria-live="assertive"> so assistive tech announces
// it immediately when it appears.
//
// Optional dismissable mode renders a close <button> that calls onDismiss
// when activated; the consumer is responsible for removing the banner
// from the DOM (the component does not manage its own visibility).
//
// Props:
//   className   — string, optional. CSS class name.
//   label       — string, optional. Accessible label override (aria-label).
//   dismissable — boolean, default false. Show a dismiss button.
//   onDismiss   — callback, optional. Called when the dismiss button is clicked.
//   dismissLabel — string, default "Dismiss". Accessible label for the dismiss button.
//   children    — ReactNode, required. Banner content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - role="alert" + aria-live="assertive" announces the banner immediately
//   - aria-label optional; the visible text usually serves as the name
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Component does not own visibility state; consumer renders/unrenders
//
// References:
//   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert

import React from "react";

export interface SuperBannerProps {
    className?: string;
    /** Optional accessible label override. */
    label?: string;
    /** Show a dismiss button. */
    dismissable?: boolean;
    /** Called when the dismiss button is clicked. */
    onDismiss?: () => void;
    /** Accessible label for the dismiss button. */
    dismissLabel?: string;
    /** Banner content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function SuperBanner({
    className = "",
    label = undefined,
    dismissable = false,
    onDismiss = undefined,
    dismissLabel = "Dismiss",
    children,
    ...restProps
}: SuperBannerProps) {
    return (
        <div
            className={`super-banner ${className}`}
            role="alert"
            aria-live="assertive"
            aria-label={label}
            {...restProps}
        >
            {children}
            {dismissable && (
                <button
                    type="button"
                    className="super-banner-dismiss"
                    aria-label={dismissLabel}
                    onClick={onDismiss}
                >
                    ×
                </button>
            )}
        </div>
    );
}
