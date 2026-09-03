// BarChart component
//
// A <figure role="img"> containing an inline horizontal-bar <svg>, plus an
// optional accessible data-table fallback.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   description — optional extended description, via aria-describedby
//     (rendered as a visually-hidden-by-convention <figcaption>; this
//     package ships no CSS, so "visually hidden" is the consumer's rule
//     to apply to `.bar-chart-description`).
//   categories — JSON-encoded array of { label, value }. Also settable as
//     a real `categories` property for programmatic use.
//
// A `dataTable` slot (a light-DOM child marked `slot="data-table"`) is
// moved in after the chart for consumers who want a real fallback
// <table> — this package renders the bars, not the table, since a real
// table needs consumer-specific columns.
//
// References:
//   - components/bar-chart/index.md (canonical contract)

import { nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const HANDLED = new Set(["label", "description", "categories"]);

export type BarChartCategory = { label: string; value: number };

function parseCategories(raw: string | null): BarChartCategory[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        /* ignore malformed JSON */
    }
    return [];
}

export class BarChart extends HTMLElement {
    #figure: HTMLElement | null = null;
    #categories: BarChartCategory[] = [];
    #descriptionId = nextId("lily-bar-chart-description");

    connectedCallback(): void {
        if (this.#figure) return;

        this.#categories = parseCategories(this.getAttribute("categories"));

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "bar-chart");
        figure.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) figure.setAttribute("aria-label", label);

        const description = this.getAttribute("description");
        if (description !== null) {
            const figcaption = document.createElement("figcaption");
            figcaption.className = "bar-chart-description";
            figcaption.id = this.#descriptionId;
            figcaption.textContent = description;
            figure.appendChild(figcaption);
            figure.setAttribute("aria-describedby", this.#descriptionId);
        }

        passThroughAttributes(this, figure, HANDLED);

        const dataTable = this.querySelector('[slot="data-table"]');
        this.replaceChildren();
        this.#renderBars(figure);
        if (dataTable) figure.appendChild(dataTable);

        this.appendChild(figure);
        this.#figure = figure;
    }

    get categories(): BarChartCategory[] {
        return this.#categories;
    }

    set categories(value: BarChartCategory[]) {
        this.#categories = value;
        if (this.#figure) {
            this.#figure.querySelector("svg")?.remove();
            this.#renderBars(this.#figure);
        }
    }

    #renderBars(figure: HTMLElement): void {
        const categories = this.#categories;
        const barHeight = 24;
        const gap = 8;
        const width = 300;
        const height = categories.length * (barHeight + gap) || barHeight;
        const max = Math.max(1, ...categories.map((c) => c.value));

        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("role", "presentation");
        svg.setAttribute("aria-hidden", "true");

        categories.forEach((category, i) => {
            const y = i * (barHeight + gap);
            const barWidth = (category.value / max) * width;
            const rect = document.createElementNS(SVG_NS, "rect");
            rect.setAttribute("x", "0");
            rect.setAttribute("y", String(y));
            rect.setAttribute("width", String(barWidth));
            rect.setAttribute("height", String(barHeight));
            rect.setAttribute("data-label", category.label);
            rect.setAttribute("data-value", String(category.value));
            svg.appendChild(rect);
        });

        figure.insertBefore(svg, figure.firstChild?.nextSibling ?? null);
    }
}
