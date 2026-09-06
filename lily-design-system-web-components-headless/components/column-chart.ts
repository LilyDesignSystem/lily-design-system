// ColumnChart component
//
// A <figure role="img"> containing an inline vertical-column <svg>, plus an
// optional accessible data-table fallback. Structural sibling of BarChart,
// but columns run vertically (value read along the y-axis).
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   description — optional extended description, via aria-describedby
//     (rendered as a <figcaption>; this package ships no CSS, so "visually
//     hidden" is the consumer's rule to apply to `.column-chart-description`).
//   categories — JSON-encoded array of { label, value }. Also settable as
//     a real `categories` property for programmatic use.
//
// A `dataTable` slot (a light-DOM child marked `slot="data-table"`) is
// moved in after the chart for consumers who want a real fallback
// <table>.
//
// References:
//   - components/column-chart/index.md (canonical contract)

import { nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const HANDLED = new Set(["label", "description", "categories"]);

export type ColumnChartCategory = { label: string; value: number };

function parseCategories(raw: string | null): ColumnChartCategory[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        /* ignore malformed JSON */
    }
    return [];
}

export class ColumnChart extends HTMLElement {
    #figure: HTMLElement | null = null;
    #categories: ColumnChartCategory[] = [];
    #descriptionId = nextId("lily-column-chart-description");

    connectedCallback(): void {
        if (this.#figure) return;

        this.#categories = parseCategories(this.getAttribute("categories"));

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "column-chart");
        figure.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) figure.setAttribute("aria-label", label);

        const description = this.getAttribute("description");
        if (description !== null) {
            const figcaption = document.createElement("figcaption");
            figcaption.className = "column-chart-description";
            figcaption.id = this.#descriptionId;
            figcaption.textContent = description;
            figure.appendChild(figcaption);
            figure.setAttribute("aria-describedby", this.#descriptionId);
        }

        passThroughAttributes(this, figure, HANDLED);

        const dataTable = this.querySelector('[slot="data-table"]');
        this.replaceChildren();
        this.#renderColumns(figure);
        if (dataTable) figure.appendChild(dataTable);

        this.appendChild(figure);
        this.#figure = figure;
    }

    get categories(): ColumnChartCategory[] {
        return this.#categories;
    }

    set categories(value: ColumnChartCategory[]) {
        this.#categories = value;
        if (this.#figure) {
            this.#figure.querySelector("svg")?.remove();
            this.#renderColumns(this.#figure);
        }
    }

    #renderColumns(figure: HTMLElement): void {
        const categories = this.#categories;
        const columnWidth = 24;
        const gap = 8;
        const height = 150;
        const width = categories.length * (columnWidth + gap) || columnWidth;
        const max = Math.max(1, ...categories.map((c) => c.value));

        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("role", "presentation");
        svg.setAttribute("aria-hidden", "true");

        categories.forEach((category, i) => {
            const x = i * (columnWidth + gap);
            const columnHeight = (category.value / max) * height;
            const y = height - columnHeight;
            const rect = document.createElementNS(SVG_NS, "rect");
            rect.setAttribute("x", String(x));
            rect.setAttribute("y", String(y));
            rect.setAttribute("width", String(columnWidth));
            rect.setAttribute("height", String(columnHeight));
            rect.setAttribute("data-label", category.label);
            rect.setAttribute("data-value", String(category.value));
            svg.appendChild(rect);
        });

        figure.insertBefore(svg, figure.firstChild?.nextSibling ?? null);
    }
}
