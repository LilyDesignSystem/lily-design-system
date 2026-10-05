// SunburstChart component
//
// A headless wrapper for a radial chart showing a hierarchy as concentric rings of arcs. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No
// drawing happens here.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name of the chart image.
//   children — ReactNode, required. The inline <svg> (and any extra markup).
//   dataTable — ReactNode, optional. The accessible table alternative, rendered
//     in <div class="sunburst-chart-data-table">, a SIBLING of the role="img" graphic
//     wrapper: role="img" makes descendants presentational, so a table inside
//     it would be invisible to assistive technology.
//   ...restProps — additional HTML attributes spread onto the <figure>
//
// Markup: <figure class="sunburst-chart"><div class="sunburst-chart-graphic" role="img" aria-label>…svg…</div>[<div class="sunburst-chart-data-table">…</div>]</figure>
//
// Keyboard:
//   None on the graphic; the data table follows native table behaviour.

import React from "react";

export interface SunburstChartProps {
    className?: string;
    /** Accessible name for the chart. */
    label?: string;
    /** The consumer-supplied inline svg. */
    children: React.ReactNode;
    /** Optional accessible data table alternative. */
    dataTable?: React.ReactNode;
    [key: string]: unknown;
}

export default function SunburstChart({
    className = "",
    label = undefined,
    children,
    dataTable,
    ...restProps
}: SunburstChartProps) {
    return (
        <figure
            className={`sunburst-chart ${className}`}
            {...restProps}
        >
            <div className="sunburst-chart-graphic" role="img" aria-label={label}>
                {children}
            </div>
            {dataTable !== undefined && dataTable !== null && (
                <div className="sunburst-chart-data-table">{dataTable}</div>
            )}
        </figure>
    );
}
