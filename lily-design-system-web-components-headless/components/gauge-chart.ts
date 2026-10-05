// GaugeChart component
//
// A headless wrapper for a dial chart showing one value within a range, with optional thresholds. Renders a <figure role="img"> around the
// consumer-supplied inline <svg>. No drawing happens here (headless).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   aria-describedby — optional; passed through to the figure. Point it at a
//     text description or a real <table> carrying the same data. A child
//     marked slot="data-table" is the accessible table alternative and is
//     kept inside the figure after the svg.
//
// Deviation from bar-chart.ts: bar-chart draws its own bars from a
// `categories` attribute; this chart (like the Svelte canonical) draws
// nothing — the consumer's svg children are moved into the figure.
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
        figure.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) figure.setAttribute("aria-label", label);
        passThroughAttributes(this, figure, HANDLED);

        moveChildrenInto(this, figure);
        this.appendChild(figure);
    }
}
