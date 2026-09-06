// AreaChart component
//
// A <figure role="img"> containing an inline <svg> filled-area rendering
// of one or more data series, plus an optional accessible data-table
// fallback. Structural sibling of BarChart, adapted for continuous
// `{ x, y }` series data instead of discrete categories.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
//   description — optional extended description, via aria-describedby
//     (rendered as a <figcaption>; this package ships no CSS, so "visually
//     hidden" is the consumer's rule to apply to `.area-chart-description`).
//   series — JSON-encoded array of { name, points: { x, y }[] }. Also
//     settable as a real `series` property for programmatic use.
//
// A `dataTable` slot (a light-DOM child marked `slot="data-table"`) is
// moved in after the chart for consumers who want a real fallback
// <table>.
//
// References:
//   - components/area-chart/index.md (canonical contract)

import { nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const HANDLED = new Set(["label", "description", "series"]);

export type ChartPoint = { x: number; y: number };
export type ChartSeries = { name: string; points: ChartPoint[] };

function parseSeries(raw: string | null): ChartSeries[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        /* ignore malformed JSON */
    }
    return [];
}

const WIDTH = 300;
const HEIGHT = 150;

function extent(series: ChartSeries[]): { minX: number; maxX: number; minY: number; maxY: number } {
    const xs = series.flatMap((s) => s.points.map((p) => p.x));
    const ys = series.flatMap((s) => s.points.map((p) => p.y));
    return {
        minX: xs.length ? Math.min(...xs) : 0,
        maxX: xs.length ? Math.max(...xs) : 1,
        minY: ys.length ? Math.min(...ys) : 0,
        maxY: ys.length ? Math.max(...ys) : 1,
    };
}

function toSvgCoords(points: ChartPoint[], bounds: ReturnType<typeof extent>): ChartPoint[] {
    const xRange = bounds.maxX - bounds.minX || 1;
    const yRange = bounds.maxY - bounds.minY || 1;
    return points.map((p) => ({
        x: ((p.x - bounds.minX) / xRange) * WIDTH,
        y: HEIGHT - ((p.y - bounds.minY) / yRange) * HEIGHT,
    }));
}

export class AreaChart extends HTMLElement {
    #figure: HTMLElement | null = null;
    #series: ChartSeries[] = [];
    #descriptionId = nextId("lily-area-chart-description");

    connectedCallback(): void {
        if (this.#figure) return;

        this.#series = parseSeries(this.getAttribute("series"));

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "area-chart");
        figure.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) figure.setAttribute("aria-label", label);

        const description = this.getAttribute("description");
        if (description !== null) {
            const figcaption = document.createElement("figcaption");
            figcaption.className = "area-chart-description";
            figcaption.id = this.#descriptionId;
            figcaption.textContent = description;
            figure.appendChild(figcaption);
            figure.setAttribute("aria-describedby", this.#descriptionId);
        }

        passThroughAttributes(this, figure, HANDLED);

        const dataTable = this.querySelector('[slot="data-table"]');
        this.replaceChildren();
        this.#renderAreas(figure);
        if (dataTable) figure.appendChild(dataTable);

        this.appendChild(figure);
        this.#figure = figure;
    }

    get series(): ChartSeries[] {
        return this.#series;
    }

    set series(value: ChartSeries[]) {
        this.#series = value;
        if (this.#figure) {
            this.#figure.querySelector("svg")?.remove();
            this.#renderAreas(this.#figure);
        }
    }

    #renderAreas(figure: HTMLElement): void {
        const series = this.#series;
        const bounds = extent(series);

        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
        svg.setAttribute("role", "presentation");
        svg.setAttribute("aria-hidden", "true");

        series.forEach((s) => {
            const coords = toSvgCoords(s.points, bounds);
            if (coords.length === 0) return;
            const line = coords.map((c) => `${c.x},${c.y}`).join(" L ");
            const first = coords[0];
            const last = coords[coords.length - 1];
            const d = `M ${first.x},${HEIGHT} L ${line} L ${last.x},${HEIGHT} Z`;
            const path = document.createElementNS(SVG_NS, "path");
            path.setAttribute("d", d);
            path.setAttribute("data-series-name", s.name);
            svg.appendChild(path);
        });

        figure.insertBefore(svg, figure.firstChild?.nextSibling ?? null);
    }
}
