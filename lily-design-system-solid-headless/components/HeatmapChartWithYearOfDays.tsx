// HeatmapChartWithYearOfDays component
//
// A headless wrapper for a grid chart where cell colour encodes the value at each row and column. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No drawing happens here.
//
// Props:
//   class — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
export interface HeatmapChartWithYearOfDaysProps {
    class?: string;
    /** Accessible name for the chart. */
    label: string;
    /** The calendar year shown. */
    year: number;
    /** First weekday row: 0 = Sunday … 6 = Saturday. */
    weekStart: number;
    /** The consumer-supplied inline svg. */
    children: JSX.Element;
    /** Optional accessible data table alternative. */
    dataTable?: JSX.Element;
    [key: string]: unknown;
}

export default function HeatmapChartWithYearOfDays(props: HeatmapChartWithYearOfDaysProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "year", "weekStart", "children", "dataTable");
    return (
        <figure
            class={`heatmap-chart-with-year-of-days ${p.class}`}
            data-year={attr(p.year)}
            data-week-start={attr(p.weekStart)}
            {...restProps}
        >
            <div
                class="heatmap-chart-with-year-of-days-graphic"
                role="img"
                aria-label={p.label}
            >
                {p.children}
            </div>
            {p.dataTable !== undefined && p.dataTable !== null && (
                <div class="heatmap-chart-with-year-of-days-data-table">{p.dataTable}</div>
            )}
        </figure>
    );
}
