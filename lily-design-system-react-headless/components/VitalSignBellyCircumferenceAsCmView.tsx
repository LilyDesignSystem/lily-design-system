// VitalSignBellyCircumferenceAsCmView component
//
// A read-only display of a belly circumference value in centimeters (cm).
// Renders the numeric value as text content inside a span element with
// appropriate ARIA attributes for accessibility. Companion to
// VitalSignBellyCircumferenceAsCmInput.
//
// Props:
//   className — string, optional. CSS class name.
//   value — number, required. Belly circumference value in centimeters.
//   label — string, required. Accessible description via aria-label.
//   ...restProps — additional HTML attributes spread onto the outer span.
//
// Syntax:
//   <VitalSignBellyCircumferenceAsCmView value={90} label="90 cm belly circumference" />
//
// Keyboard:
//   - None — this is a passive, read-only display element
//
// Accessibility:
//   - role="img" on the outer span
//   - aria-label provides the full description for screen readers
//   - data-value attribute enables consumer CSS styling
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import React from "react";

export interface VitalSignBellyCircumferenceAsCmViewProps {
    className?: string;
    /** Belly circumference value in centimeters. */
    value: number;
    /** Accessible description. */
    label: string;
    [key: string]: unknown;
}

export default function VitalSignBellyCircumferenceAsCmView({
    className = "",
    value,
    label,
    ...restProps
}: VitalSignBellyCircumferenceAsCmViewProps) {
    return (
        <span
            className={`vital-sign-belly-circumference-as-cm-view ${className}`}
            role="img"
            aria-label={label}
            data-value={value}
            {...restProps}
        >
            {value}
        </span>
    );
}
