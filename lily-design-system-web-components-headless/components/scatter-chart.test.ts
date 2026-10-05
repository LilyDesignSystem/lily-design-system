import { afterEach, describe, expect, test } from "vitest";

import { ScatterChart } from "./scatter-chart.js";

if (!customElements.get("lily-scatter-chart")) {
    customElements.define("lily-scatter-chart", ScatterChart);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const SERIES_JSON = JSON.stringify([
    {
        name: "Heights vs weights",
        points: [
            { x: 1, y: 2 },
            { x: 2, y: 4 },
            { x: 3, y: 3 },
        ],
    },
]);

describe("ScatterChart", () => {
    test("exposes the graphic as a named image, not the figure", () => {
        const host = render(`<lily-scatter-chart label="Heights vs weights" series='${SERIES_JSON}'></lily-scatter-chart>`);

        expect(host.querySelector(".scatter-chart-graphic")!.getAttribute("role")).toBe("img");
        expect(host.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-scatter-chart label="Heights vs weights" series='${SERIES_JSON}'></lily-scatter-chart>`);

        expect(host.querySelector(".scatter-chart-graphic")!.getAttribute("aria-label")).toBe("Heights vs weights");
    });

    test("renders one circle per point", () => {
        const host = render(`<lily-scatter-chart label="Heights vs weights" series='${SERIES_JSON}'></lily-scatter-chart>`);

        const circles = host.querySelectorAll("svg circle");
        expect(circles.length).toBe(3);
        expect(circles[0].getAttribute("data-series-name")).toBe("Heights vs weights");
    });

    test("the svg is decorative (presentation role, aria-hidden)", () => {
        const host = render(`<lily-scatter-chart label="Heights vs weights" series='${SERIES_JSON}'></lily-scatter-chart>`);

        const svg = host.querySelector("svg")!;
        expect(svg.getAttribute("role")).toBe("presentation");
        expect(svg.getAttribute("aria-hidden")).toBe("true");
    });

    test("renders a description figcaption referenced by aria-describedby", () => {
        const host = render(
            `<lily-scatter-chart label="Scatter" description="Dots show data points." series='${SERIES_JSON}'></lily-scatter-chart>`,
        );

        const graphic = host.querySelector(".scatter-chart-graphic")!;
        const describedbyId = graphic.getAttribute("aria-describedby")!;
        expect(document.getElementById(describedbyId)!.textContent).toBe("Dots show data points.");
    });

    test("moves a slot=data-table child into a sibling wrapper after the graphic, outside role=img", () => {
        const host = render(
            `<lily-scatter-chart label="Scatter" series='${SERIES_JSON}'><table slot="data-table"><caption>Data</caption></table></lily-scatter-chart>`,
        );

        const wrap = host.querySelector(".scatter-chart-data-table")!;
        expect(wrap.querySelector("table")).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(host.querySelector(".scatter-chart-graphic"));
        expect(host.querySelector("[role=img] table")).toBeNull();
    });

    test("the series property is live and re-renders on set", () => {
        const host = render('<lily-scatter-chart label="Scatter"></lily-scatter-chart>') as unknown as ScatterChart;

        expect(host.querySelectorAll("svg circle").length).toBe(0);

        host.series = [{ name: "New", points: [{ x: 0, y: 1 }] }];

        expect(host.querySelectorAll("svg circle").length).toBe(1);
        expect(host.series).toEqual([{ name: "New", points: [{ x: 0, y: 1 }] }]);
    });

    test("ignores malformed JSON in the series attribute", () => {
        const host = render('<lily-scatter-chart label="Scatter" series="not json"></lily-scatter-chart>') as unknown as ScatterChart;

        expect(host.series).toEqual([]);
    });
});
