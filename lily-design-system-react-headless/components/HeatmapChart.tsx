// HeatmapChart component
//
// A headless wrapper for a grid chart where cell colour encodes the value at each row and column. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No drawing happens here.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the chart.
//   children — ReactNode, required. The inline <svg> (and any extra markup).
//   ...restProps — additional HTML attributes spread onto the <figure>
//
// Keyboard:
//   None — the chart is a single image to assistive technology.
//
// Accessibility:
//   - role="img" exposes the chart as one image; aria-label names it
//   - aria-describedby (via restProps) should reference a text description
//     or a real <table> carrying the same data
//
// dataTable — optional. The accessible table alternative, rendered in a
// <div class="heatmap-chart-data-table"> that is a SIBLING of the role="img"
// graphic wrapper: role="img" makes descendants presentational, so a
// table inside it would be invisible to assistive technology.
// Markup: <figure class="heatmap-chart"><div class="heatmap-chart-graphic" role="img" aria-label>…svg…</div>[<div class="heatmap-chart-data-table">…</div>]</figure>

import React from "react";

export interface HeatmapChartProps {
    className?: string;
    /** Accessible name for the chart. */
    label: string;
    /** The consumer-supplied inline svg. */
    children: React.ReactNode;
    /** Optional accessible data table alternative. */
    dataTable?: React.ReactNode;
    [key: string]: unknown;
}

export default function HeatmapChart({
    className = "",
    label,
    children,
    dataTable,
    ...restProps
}: HeatmapChartProps) {
    return (
        <figure
            className={`heatmap-chart ${className}`}
            {...restProps}
        >
            <div className="heatmap-chart-graphic" role="img" aria-label={label}>
                {children}
            </div>
            {dataTable !== undefined && dataTable !== null && (
                <div className="heatmap-chart-data-table">{dataTable}</div>
            )}
        </figure>
    );
}
