// ScatterChart component
//
// A headless wrapper for a scatter chart visualization using dots to display data. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No
// drawing happens here.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible name of the chart image.
//   children — ReactNode, required. The inline <svg> (and any extra markup).
//   dataTable — ReactNode, optional. The accessible table alternative, rendered
//     in <div class="scatter-chart-data-table">, a SIBLING of the role="img" graphic
//     wrapper: role="img" makes descendants presentational, so a table inside
//     it would be invisible to assistive technology.
//   ...restProps — additional HTML attributes spread onto the <figure>
//
// Markup: <figure class="scatter-chart"><div class="scatter-chart-graphic" role="img" aria-label>…svg…</div>[<div class="scatter-chart-data-table">…</div>]</figure>
//
// Keyboard:
//   None on the graphic; the data table follows native table behaviour.

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ScatterChartProps {
    class?: string;
    /** Accessible name for the chart. */
    label?: string;
    /** The consumer-supplied inline svg. */
    children: JSX.Element;
    /** Optional accessible data table alternative. */
    dataTable?: JSX.Element;
    [key: string]: unknown;
}

export default function ScatterChart(props: ScatterChartProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children", "dataTable");
    return (
        <figure
            class={`scatter-chart ${p.class}`}
            {...restProps}
        >
            <div
                class="scatter-chart-graphic"
                role="img"
                aria-label={p.label}
            >
                {p.children}
            </div>
            {p.dataTable !== undefined && p.dataTable !== null && (
                <div class="scatter-chart-data-table">{p.dataTable}</div>
            )}
        </figure>
    );
}
