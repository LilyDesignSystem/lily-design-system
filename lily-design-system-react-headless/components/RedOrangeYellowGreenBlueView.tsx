// RedOrangeYellowGreenBlueView component
//
// A headless ROYGB (Red/Orange/Yellow/Green/Blue) status view that displays
// a five-level color-coded status value as read-only text inside a <span>.
// Used to present previously captured ROYGB status data in dashboards, reports,
// or detail views where the five-level scale offers more granularity than RAG.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The ROYGB status to display (e.g. "red", "orange", "yellow", "green", "blue").
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <RedOrangeYellowGreenBlueView label="Risk level" value="yellow" />
//
// Examples:
//
//   <RedOrangeYellowGreenBlueView label="Alert status" value={level} />
//
//
//   <RedOrangeYellowGreenBlueView label="System health" value="blue" data-testid="health" />
//
// Keyboard:
//   - None — this is a passive informational display, not an interactive element.
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//   - Screen readers announce the label and displayed status value
//   - WCAG 2.2 AAA: properly labeled for assistive technology
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//   - The value is displayed as-is, allowing localized status names
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Read-only display component — not interactive, no controlled
//   - Consumer can apply color-coded backgrounds or text colors via restProps
//
// References:
//   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
//   - Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system

import React from "react";

export interface RedOrangeYellowGreenBlueViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The ROYGB status value to display */
    value?: string;
    [key: string]: unknown;
}

export default function RedOrangeYellowGreenBlueView({
    className = "",
    label,
    value = "",
    ...restProps
}: RedOrangeYellowGreenBlueViewProps) {
    return (
        <span
            className={`red-orange-yellow-green-blue-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
