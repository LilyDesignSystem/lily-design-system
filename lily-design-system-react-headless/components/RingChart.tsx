// RingChart component
//
// A headless wrapper for a pie chart with a hollow centre, often used to show progress or a share of a total. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No
// drawing happens here.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name of the chart image.
//   children — ReactNode, required. The inline <svg> (and any extra markup).
//   dataTable — ReactNode, optional. The accessible table alternative, rendered
//     in <div class="ring-chart-data-table">, a SIBLING of the role="img" graphic
//     wrapper: role="img" makes descendants presentational, so a table inside
//     it would be invisible to assistive technology.
//   ...restProps — additional HTML attributes spread onto the <figure>
//
// Markup: <figure class="ring-chart"><div class="ring-chart-graphic" role="img" aria-label>…svg…</div>[<div class="ring-chart-data-table">…</div>]</figure>
//
// Keyboard:
//   None on the graphic; the data table follows native table behaviour.

import React from "react";

export interface RingChartProps {
    className?: string;
    /** Accessible name for the chart. */
    label?: string;
    /** The consumer-supplied inline svg. */
    children: React.ReactNode;
    /** Optional accessible data table alternative. */
    dataTable?: React.ReactNode;
    [key: string]: unknown;
}

export default function RingChart({
    className = "",
    label = undefined,
    children,
    dataTable,
    ...restProps
}: RingChartProps) {
    return (
        <figure
            className={`ring-chart ${className}`}
            {...restProps}
        >
            <div className="ring-chart-graphic" role="img" aria-label={label}>
                {children}
            </div>
            {dataTable !== undefined && dataTable !== null && (
                <div className="ring-chart-data-table">{dataTable}</div>
            )}
        </figure>
    );
}
