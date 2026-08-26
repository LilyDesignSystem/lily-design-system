// MedicalBannerBox component
//
// A headless layout component designed to be placed inside a MedicalBanner.
// Renders a <div> with data-context="medical" that the consumer styles with
// flexbox horizontal layout to arrange medical banner content items side by side.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name via aria-label.
//   children — ReactNode, required. The medical banner box content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <MedicalBannerBox>content</MedicalBannerBox>
//
// Keyboard:
//   - None (passive layout element)
//
// Accessibility:
//   - No additional ARIA required; parent MedicalBanner provides landmark
//   - Optional aria-label via label prop
//   - data-context="medical" for medical context
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React from "react";

export interface MedicalBannerBoxProps {
    className?: string;
    /** Optional accessible name */
    label?: string;
    /** The medical banner box content */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function MedicalBannerBox({
    className = "",
    label = undefined,
    children,
    ...restProps
}: MedicalBannerBoxProps) {
    return (
        <div
            className={`medical-banner-box ${className}`}
            aria-label={label}
            data-context="medical"
            {...restProps}
        >
            {children}
        </div>
    );
}
