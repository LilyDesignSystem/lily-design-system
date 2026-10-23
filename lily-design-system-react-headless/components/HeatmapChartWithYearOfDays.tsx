// HeatmapChartWithYearOfDays component
//
// A headless wrapper for a grid chart where cell colour encodes the value at each row and column. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No drawing happens here.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the chart.
//   year — number, required. The calendar year shown (data-year).
//   weekStart — number, required. First weekday row, 0 = Sunday … 6 = Saturday (data-week-start); no default, it is locale-dependent.
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
// <div class="heatmap-chart-with-year-of-days-data-table"> that is a SIBLING of the role="img"
// graphic wrapper: role="img" makes descendants presentational, so a
// table inside it would be invisible to assistive technology.
// Markup: <figure class="heatmap-chart-with-year-of-days"><div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>…svg…</div>[<div class="heatmap-chart-with-year-of-days-data-table">…</div>]</figure>

import React from "react";

export interface HeatmapChartWithYearOfDaysProps {
    className?: string;
    /** Accessible name for the chart. */
    label: string;
    /** The calendar year shown. */
    year: number;
    /** First weekday row: 0 = Sunday … 6 = Saturday. */
    weekStart: number;
    /** The consumer-supplied inline svg. */
    children: React.ReactNode;
    /** Optional accessible data table alternative. */
    dataTable?: React.ReactNode;
    [key: string]: unknown;
}

export default function HeatmapChartWithYearOfDays({
    className = "",
    label,
    year,
    weekStart,
    children,
    dataTable,
    ...restProps
}: HeatmapChartWithYearOfDaysProps) {
    return (
        <figure
            className={`heatmap-chart-with-year-of-days ${className}`}
            data-year={year}
            data-week-start={weekStart}
            {...restProps}
        >
            <div className="heatmap-chart-with-year-of-days-graphic" role="img" aria-label={label}>
                {children}
            </div>
            {dataTable !== undefined && dataTable !== null && (
                <div className="heatmap-chart-with-year-of-days-data-table">{dataTable}</div>
            )}
        </figure>
    );
}
