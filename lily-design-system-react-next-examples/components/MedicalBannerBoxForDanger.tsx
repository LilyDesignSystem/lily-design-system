// MedicalBannerBoxForDanger component
//
// A headless component for displaying critical medical record danger information
// such as reactions, warnings, alarms, and other danger-level clinical alerts.
// Renders a <div> with role="region", aria-label, and data-type="danger".
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   children — ReactNode, required. The danger banner box content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <MedicalBannerBoxForDanger label="Allergies">content</MedicalBannerBoxForDanger>
//
// Keyboard:
//   - None (passive layout element)
//
// Accessibility:
//   - role="region" for landmark identification
//   - aria-label provides accessible name
//   - data-type="danger" for consumer CSS targeting
//
// Internationalization:
//   - label prop is the only user-facing string; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React from "react";

export interface MedicalBannerBoxForDangerProps {
    className?: string;
    /** Accessible name for the danger box */
    label: string;
    /** The danger banner box content */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function MedicalBannerBoxForDanger({
    className = "",
    label,
    children,
    ...restProps
}: MedicalBannerBoxForDangerProps) {
    return (
        <div
            className={`medical-banner-box-for-danger ${className}`}
            role="region"
            aria-label={label}
            data-type="danger"
            {...restProps}
        >
            {children}
        </div>
    );
}
