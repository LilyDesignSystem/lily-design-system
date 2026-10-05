// SankeyChart component
//
// A headless wrapper for a flow chart where link width encodes the quantity moving between nodes. Renders a <figure role="img">
// around the consumer-supplied inline <svg>. No drawing happens here.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the chart.
//   children — ReactNode, required. The inline <svg> (and any extra markup).
//   ...restProps — additional HTML attributes spread onto the <figure>
//     (use aria-describedby to point at a description or a data table).
//
// Keyboard:
//   None — the chart is a single image to assistive technology.
//
// Accessibility:
//   - role="img" exposes the chart as one image; aria-label names it
//   - aria-describedby (via restProps) should reference a text description
//     or a real <table> carrying the same data

import React from "react";

export interface SankeyChartProps {
    className?: string;
    /** Accessible name for the chart. */
    label: string;
    /** The consumer-supplied inline svg. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function SankeyChart({
    className = "",
    label,
    children,
    ...restProps
}: SankeyChartProps) {
    return (
        <figure
            className={`sankey-chart ${className}`}
            role="img"
            aria-label={label}
            {...restProps}
        >
            {children}
        </figure>
    );
}
