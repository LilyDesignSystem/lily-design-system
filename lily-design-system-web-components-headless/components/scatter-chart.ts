// ScatterChart component
//
// A <figure> holding a role="img" graphic wrapper containing an inline <svg> rendering of dots
// positioned at `(x, y)` coordinates for one or more data series, plus an
// optional accessible data-table fallback. Structural sibling of
// BarChart, adapted for continuous `{ x, y }` series data.
//
// Attributes:
//   label — accessible name of the image wrapper, via aria-label.
//   description — optional extended description, via aria-describedby
//     (rendered as a <figcaption>; this package ships no CSS, so "visually
//     hidden" is the consumer's rule to apply to `.scatter-chart-description`).
//   series — JSON-encoded array of { name, points: { x, y }[] }. Also
//     settable as a real `series` property for programmatic use.
//
// A `dataTable` slot (a light-DOM child marked `slot="data-table"`) is placed in
// <div class="scatter-chart-data-table">, a SIBLING of the image wrapper (never inside it:
// role="img" makes descendants presentational), for consumers who want a
// real fallback <table>.
//
// References:
//   - components/scatter-chart/index.md (canonical contract)

import { nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const HANDLED = new Set(["label", "description", "series"]);
const DOT_RADIUS = 3;

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

function toSvgPoint(p: ChartPoint, bounds: ReturnType<typeof extent>): ChartPoint {
    const xRange = bounds.maxX - bounds.minX || 1;
    const yRange = bounds.maxY - bounds.minY || 1;
    return {
        x: ((p.x - bounds.minX) / xRange) * WIDTH,
        y: HEIGHT - ((p.y - bounds.minY) / yRange) * HEIGHT,
    };
}

export class ScatterChart extends HTMLElement {
    #figure: HTMLElement | null = null;
    #graphic: HTMLElement | null = null;
    #series: ChartSeries[] = [];
    #descriptionId = nextId("lily-scatter-chart-description");

    connectedCallback(): void {
        if (this.#figure) return;

        this.#series = parseSeries(this.getAttribute("series"));

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "scatter-chart");
        // role="img" lives on an inner graphic wrapper, never on the figure: it
        // makes descendants presentational, so the data table (a sibling of the
        // wrapper) must stay outside it to be reachable by assistive technology.
        const graphic = document.createElement("div");
        graphic.className = "scatter-chart-graphic";
        graphic.setAttribute("role", "img");
        figure.appendChild(graphic);
        const label = this.getAttribute("label");
        if (label !== null) graphic.setAttribute("aria-label", label);

        const description = this.getAttribute("description");
        if (description !== null) {
            const figcaption = document.createElement("figcaption");
            figcaption.className = "scatter-chart-description";
            figcaption.id = this.#descriptionId;
            figcaption.textContent = description;
            graphic.appendChild(figcaption);
            graphic.setAttribute("aria-describedby", this.#descriptionId);
        }

        passThroughAttributes(this, figure, HANDLED);

        const dataTable = this.querySelector('[slot="data-table"]');
        this.replaceChildren();
        this.#renderDots(graphic);
        if (dataTable) {
            const wrap = document.createElement("div");
            wrap.className = "scatter-chart-data-table";
            wrap.appendChild(dataTable);
            figure.appendChild(wrap);
        }

        this.appendChild(figure);
        this.#figure = figure;
        this.#graphic = graphic;
    }

    get series(): ChartSeries[] {
        return this.#series;
    }

    set series(value: ChartSeries[]) {
        this.#series = value;
        if (this.#graphic) {
            this.#graphic.querySelector("svg")?.remove();
            this.#renderDots(this.#graphic);
        }
    }

    #renderDots(figure: HTMLElement): void {
        const series = this.#series;
        const bounds = extent(series);

        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
        svg.setAttribute("role", "presentation");
        svg.setAttribute("aria-hidden", "true");

        series.forEach((s) => {
            s.points.forEach((p) => {
                const coord = toSvgPoint(p, bounds);
                const circle = document.createElementNS(SVG_NS, "circle");
                circle.setAttribute("cx", String(coord.x));
                circle.setAttribute("cy", String(coord.y));
                circle.setAttribute("r", String(DOT_RADIUS));
                circle.setAttribute("data-series-name", s.name);
                circle.setAttribute("data-x", String(p.x));
                circle.setAttribute("data-y", String(p.y));
                svg.appendChild(circle);
            });
        });

        figure.insertBefore(svg, figure.firstChild?.nextSibling ?? null);
    }
}
