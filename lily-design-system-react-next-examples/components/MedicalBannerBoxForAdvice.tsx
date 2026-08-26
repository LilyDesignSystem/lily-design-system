// MedicalBannerBoxForAdvice component
//
// A headless component for displaying routine medical record advice information
// such as contacts, contexts, care plans, and other advice-level clinical data.
// Renders a <div> with role="region", aria-label, and data-type="advice".
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   children — ReactNode, required. The advice banner box content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <MedicalBannerBoxForAdvice label="Care contacts">content</MedicalBannerBoxForAdvice>
//
// Keyboard:
//   - None (passive layout element)
//
// Accessibility:
//   - role="region" for landmark identification
//   - aria-label provides accessible name
//   - data-type="advice" for consumer CSS targeting
//
// Internationalization:
//   - label prop is the only user-facing string; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React from "react";

export interface MedicalBannerBoxForAdviceProps {
    className?: string;
    /** Accessible name for the advice box */
    label: string;
    /** The advice banner box content */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function MedicalBannerBoxForAdvice({
    className = "",
    label,
    children,
    ...restProps
}: MedicalBannerBoxForAdviceProps) {
    return (
        <div
            className={`medical-banner-box-for-advice ${className}`}
            role="region"
            aria-label={label}
            data-type="advice"
            {...restProps}
        >
            {children}
        </div>
    );
}
