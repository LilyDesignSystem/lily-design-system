// MedicalBanner component
//
// A headless medical banner for displaying prominent medical information
// messages at the top of a page. Renders as a <div role="region"> with
// aria-live="polite", data-type for variants, and data-context="medical".
// Supports optional dismiss functionality.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   type — "info" | "success" | "warning" | "error", default "info".
//   dismissible — boolean, default false.
//   onClose — () => void, optional. Callback when dismissed.
//   closeLabel — string, optional. Accessible label for dismiss button.
//   children — ReactNode, required. The banner content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <MedicalBanner label="Patient alerts">content</MedicalBanner>
//
// Keyboard:
//   - Tab: Focus dismiss button (when dismissible)
//   - Enter/Space: Dismiss the banner
//
// Accessibility:
//   - role="region" for landmark identification
//   - aria-live="polite" for announcing content changes
//   - data-context="medical" for medical context
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React, { useState } from "react";

export interface MedicalBannerProps {
    className?: string;
    /** Accessible name for the banner */
    label: string;
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

export default function MedicalBanner({
    className = "",
    label,
    type = "info",
    dismissible = false,
    onClose = undefined,
    closeLabel = undefined,
    children,
    ...restProps
}: MedicalBannerProps) {
    const [visible, setVisible] = useState(true);

    function dismiss() {
        setVisible(false);
        onClose?.();
    }

    return (
        <>
        {visible && (<><div
            className={`medical-banner ${className}`}
            role="region"
            aria-live="polite"
            aria-label={label}
            data-type={type}
            data-context="medical"
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
