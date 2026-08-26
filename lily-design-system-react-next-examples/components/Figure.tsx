// Figure component
//
// A container for graphical content such as charts, diagrams, illustrations,
// or data visualizations. Renders a <figure> element with role="img" and an
// accessible label. Used in dashboards, reports, analytics tools, and data-driven
// applications. The consumer provides their preferred visualization (SVG, canvas,
// or a charting library) as children.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name describing the figure content.
//   children — ReactNode, required. The figure visualization content.
//   ...restProps — additional HTML attributes spread onto the <figure> element.
//
// Syntax:
//   <Figure label="Monthly revenue">
//     <svg></svg>
//   </Figure>
//
// Examples:
//   
//   <Figure label="Monthly revenue for 2024">
//     <svg></svg>
//   </Figure>
//
//   
//   <Figure label="User growth trend">
//     <canvas></canvas>
//   </Figure>
//
// Keyboard:
//   - None — passive container for data visualization
//
// Accessibility:
//   - role="img" identifies the figure as a graphical image
//   - aria-label provides an accessible name describing the figure content
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized descriptions
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No internal state — purely a structural wrapper
//   - Consumer provides all chart rendering (SVG, canvas, D3, Chart.js, etc.)
//
// References:
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
//   - MDN figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure

import React from "react";

export interface FigureProps {
    className?: string;
    /** Accessible label */
    label?: string;
    /** The component content */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function Figure({
    className = "",
    label,
    children,
    ...restProps
}: FigureProps) {
    return (
        <figure
        className={`figure ${className}`}
        role="img"
        aria-label={label}
        {...restProps}
        >
        {children}
        </figure>
    );
}
