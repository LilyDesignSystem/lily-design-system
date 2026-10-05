// FunnelChart component
//
// A headless wrapper for a chart of stages narrowing from top to bottom, showing how a quantity drops at each step. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No
// drawing happens here.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name of the chart image.
//   children — ReactNode, required. The inline <svg> (and any extra markup).
//   dataTable — ReactNode, optional. The accessible table alternative, rendered
//     in <div class="funnel-chart-data-table">, a SIBLING of the role="img" graphic
//     wrapper: role="img" makes descendants presentational, so a table inside
//     it would be invisible to assistive technology.
//   ...restProps — additional HTML attributes spread onto the <figure>
//
// Markup: <figure class="funnel-chart"><div class="funnel-chart-graphic" role="img" aria-label>…svg…</div>[<div class="funnel-chart-data-table">…</div>]</figure>
//
// Keyboard:
//   None on the graphic; the data table follows native table behaviour.

import React from "react";

export interface FunnelChartProps {
    className?: string;
    /** Accessible name for the chart. */
    label?: string;
    /** The consumer-supplied inline svg. */
    children: React.ReactNode;
    /** Optional accessible data table alternative. */
    dataTable?: React.ReactNode;
    [key: string]: unknown;
}

export default function FunnelChart({
    className = "",
    label = undefined,
    children,
    dataTable,
    ...restProps
}: FunnelChartProps) {
    return (
        <figure
            className={`funnel-chart ${className}`}
            {...restProps}
        >
            <div className="funnel-chart-graphic" role="img" aria-label={label}>
                {children}
            </div>
            {dataTable !== undefined && dataTable !== null && (
                <div className="funnel-chart-data-table">{dataTable}</div>
            )}
        </figure>
    );
}
