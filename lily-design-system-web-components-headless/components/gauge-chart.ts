// GaugeChart component
//
// A headless wrapper for a dial chart showing one value within a range, with optional thresholds. Renders a <figure> holding a
// role="img" graphic wrapper around the consumer-supplied inline <svg>. No
// drawing happens here (headless).
//
// Attributes:
//   label — REQUIRED. Accessible name of the image wrapper, via aria-label.
//   Other attributes (id, data-*, aria-*) are passed through to the <figure>.
//
// Data table alternative: a child marked slot="data-table" is the accessible
// table alternative. It is moved into <div class="gauge-chart-data-table">, a
// SIBLING of the image wrapper — never inside it: role="img" makes
// descendants presentational, so a table inside would be invisible to
// assistive technology. The wrapper exists only when such a child is present.
//
// Deviation from bar-chart.ts: bar-chart draws its own bars from a
// `categories` attribute; this chart (like the Svelte canonical) draws
// nothing — the consumer's svg children are moved into the graphic wrapper.
//
// References:
//   - components/gauge-chart/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class GaugeChart extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > figure.gauge-chart")) return;

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "gauge-chart");
        passThroughAttributes(this, figure, HANDLED);

        const graphic = document.createElement("div");
        graphic.className = "gauge-chart-graphic";
        graphic.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) graphic.setAttribute("aria-label", label);

        // Pull the slot="data-table" children out before the rest become the graphic.
        const tables = Array.from(this.children).filter((c) => c.getAttribute("slot") === "data-table");
        for (const t of tables) this.removeChild(t);

        moveChildrenInto(this, graphic);
        figure.appendChild(graphic);

        if (tables.length > 0) {
            const wrap = document.createElement("div");
            wrap.className = "gauge-chart-data-table";
            for (const t of tables) wrap.appendChild(t);
            figure.appendChild(wrap);
        }
        this.appendChild(figure);
    }
}
