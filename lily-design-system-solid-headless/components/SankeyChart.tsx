// SankeyChart component
//
// A headless wrapper for a flow chart where link width encodes the quantity moving between nodes. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No drawing happens here.
//
// Props:
//   class — string, optional. CSS class name.
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
// <div class="sankey-chart-data-table"> that is a SIBLING of the role="img"
// graphic wrapper: role="img" makes descendants presentational, so a
// table inside it would be invisible to assistive technology.
// Markup: <figure class="sankey-chart"><div class="sankey-chart-graphic" role="img" aria-label>…svg…</div>[<div class="sankey-chart-data-table">…</div>]</figure>

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface SankeyChartProps {
    class?: string;
    /** Accessible name for the chart. */
    label: string;
    /** The consumer-supplied inline svg. */
    children: JSX.Element;
    /** Optional accessible data table alternative. */
    dataTable?: JSX.Element;
    [key: string]: unknown;
}

export default function SankeyChart(props: SankeyChartProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children", "dataTable");
    return (
        <figure
            class={`sankey-chart ${p.class}`}
            {...restProps}
        >
            <div
                class="sankey-chart-graphic"
                role="img"
                aria-label={p.label}
            >
                {p.children}
            </div>
            {p.dataTable !== undefined && p.dataTable !== null && (
                <div class="sankey-chart-data-table">{p.dataTable}</div>
            )}
        </figure>
    );
}
