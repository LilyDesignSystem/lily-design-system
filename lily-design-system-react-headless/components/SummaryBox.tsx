// SummaryBox component
//
// A boxed callout that highlights key takeaways or next steps from a longer
// page. Inspired by the USWDS Summary box component. Renders an <aside>
// (complementary landmark) with a required heading and a body region for
// children. The aria-label defaults to the heading text but can be overridden.
//
// Props:
//   className — string, optional. CSS class name appended to the root.
//   heading   — string, REQUIRED. Box heading.
//   label     — string, optional. aria-label override (defaults to heading).
//   children  — ReactNode, required. Body content.
//   ...restProps — additional HTML attributes spread onto the <aside>.
//
// Syntax:
//   <SummaryBox heading="Key takeaways">
//     <ul><li>Plain language wins</li></ul>
//   </SummaryBox>
//
// Accessibility:
//   - <aside> is a complementary landmark
//   - aria-label provides the accessible name (defaults to heading)
//
// Internationalization:
//   - heading and label are consumer-supplied for localized text
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - heading is non-optional in the interface
//
// References:
//   - USWDS Summary box: https://designsystem.digital.gov/components/summary-box/

import React from "react";

export interface SummaryBoxProps {
    className?: string;
    /** Box heading (required) */
    heading: string;
    /** Optional aria-label override (defaults to heading) */
    label?: string;
    /** Body content */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function SummaryBox({
    className = "",
    heading,
    label,
    children,
    ...restProps
}: SummaryBoxProps) {
    return (
        <aside
        className={`summary-box ${className}`}
        aria-label={label || heading}
        {...restProps}
        >
        <h3 className="summary-box-heading">{heading}</h3>
        <div className="summary-box-body">{children}</div>
        </aside>
    );
}
