import { afterEach, describe, expect, test } from "vitest";

import { LineChart } from "./line-chart.js";

if (!customElements.get("lily-line-chart")) {
    customElements.define("lily-line-chart", LineChart);
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
        name: "Temperature",
        points: [
            { x: 0, y: 12 },
            { x: 1, y: 15 },
            { x: 2, y: 13 },
        ],
    },
]);

describe("LineChart", () => {
    test("renders a figure with role=img", () => {
        const host = render(`<lily-line-chart label="Temperature over time" series='${SERIES_JSON}'></lily-line-chart>`);

        expect(host.querySelector("figure")!.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-line-chart label="Temperature over time" series='${SERIES_JSON}'></lily-line-chart>`);

        expect(host.querySelector("figure")!.getAttribute("aria-label")).toBe("Temperature over time");
    });

    test("renders one polyline per series", () => {
        const host = render(`<lily-line-chart label="Temperature over time" series='${SERIES_JSON}'></lily-line-chart>`);

        const polylines = host.querySelectorAll("svg polyline");
        expect(polylines.length).toBe(1);
        expect(polylines[0].getAttribute("data-series-name")).toBe("Temperature");
        expect(polylines[0].getAttribute("points")!.split(" ").length).toBe(3);
    });

    test("the svg is decorative (presentation role, aria-hidden)", () => {
        const host = render(`<lily-line-chart label="Temperature over time" series='${SERIES_JSON}'></lily-line-chart>`);

        const svg = host.querySelector("svg")!;
        expect(svg.getAttribute("role")).toBe("presentation");
        expect(svg.getAttribute("aria-hidden")).toBe("true");
    });

    test("renders a description figcaption referenced by aria-describedby", () => {
        const host = render(
            `<lily-line-chart label="Temperature" description="Line shows temperature." series='${SERIES_JSON}'></lily-line-chart>`,
        );

        const figure = host.querySelector("figure")!;
        const describedbyId = figure.getAttribute("aria-describedby")!;
        expect(document.getElementById(describedbyId)!.textContent).toBe("Line shows temperature.");
    });

    test("moves a slot=data-table child in after the chart", () => {
        const host = render(
            `<lily-line-chart label="Temperature" series='${SERIES_JSON}'><table slot="data-table"><caption>Temp</caption></table></lily-line-chart>`,
        );

        expect(host.querySelector("figure table")).toBeTruthy();
    });

    test("the series property is live and re-renders on set", () => {
        const host = render('<lily-line-chart label="Temperature"></lily-line-chart>') as unknown as LineChart;

        expect(host.querySelectorAll("svg polyline").length).toBe(0);

        host.series = [{ name: "New", points: [{ x: 0, y: 1 }] }];

        expect(host.querySelectorAll("svg polyline").length).toBe(1);
        expect(host.series).toEqual([{ name: "New", points: [{ x: 0, y: 1 }] }]);
    });

    test("ignores malformed JSON in the series attribute", () => {
        const host = render('<lily-line-chart label="Temperature" series="not json"></lily-line-chart>') as unknown as LineChart;

        expect(host.series).toEqual([]);
    });
});
