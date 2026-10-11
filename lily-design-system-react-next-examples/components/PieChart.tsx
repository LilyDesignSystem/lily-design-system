// PieChart component
//
// A headless wrapper for a circular chart divided into slices that show each part of a whole. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No
// drawing happens here.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name of the chart image.
//   children — ReactNode, required. The inline <svg> (and any extra markup).
//   dataTable — ReactNode, optional. The accessible table alternative, rendered
//     in <div class="pie-chart-data-table">, a SIBLING of the role="img" graphic
//     wrapper: role="img" makes descendants presentational, so a table inside
//     it would be invisible to assistive technology.
//   ...restProps — additional HTML attributes spread onto the <figure>
//
// Markup: <figure class="pie-chart"><div class="pie-chart-graphic" role="img" aria-label>…svg…</div>[<div class="pie-chart-data-table">…</div>]</figure>
//
// Keyboard:
//   None on the graphic; the data table follows native table behaviour.

import React from "react";

export interface PieChartProps {
    className?: string;
    /** Accessible name for the chart. */
    label?: string;
    /** The consumer-supplied inline svg. */
    children: React.ReactNode;
    /** Optional accessible data table alternative. */
    dataTable?: React.ReactNode;
    [key: string]: unknown;
}

export default function PieChart({
    className = "",
    label = undefined,
    children,
    dataTable,
    ...restProps
}: PieChartProps) {
    return (
        <figure
            className={`pie-chart ${className}`}
            {...restProps}
        >
            <div className="pie-chart-graphic" role="img" aria-label={label}>
                {children}
            </div>
            {dataTable !== undefined && dataTable !== null && (
                <div className="pie-chart-data-table">{dataTable}</div>
            )}
        </figure>
    );
}
