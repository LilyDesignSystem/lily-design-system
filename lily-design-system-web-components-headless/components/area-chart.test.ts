import { afterEach, describe, expect, test } from "vitest";

import { AreaChart } from "./area-chart.js";

if (!customElements.get("lily-area-chart")) {
    customElements.define("lily-area-chart", AreaChart);
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
        name: "Visitors",
        points: [
            { x: 0, y: 1 },
            { x: 1, y: 3 },
            { x: 2, y: 2 },
        ],
    },
]);

describe("AreaChart", () => {
    test("renders a figure with role=img", () => {
        const host = render(`<lily-area-chart label="Visitors over time" series='${SERIES_JSON}'></lily-area-chart>`);

        expect(host.querySelector("figure")!.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-area-chart label="Visitors over time" series='${SERIES_JSON}'></lily-area-chart>`);

        expect(host.querySelector("figure")!.getAttribute("aria-label")).toBe("Visitors over time");
    });

    test("renders one filled path per series", () => {
        const host = render(`<lily-area-chart label="Visitors over time" series='${SERIES_JSON}'></lily-area-chart>`);

        const paths = host.querySelectorAll("svg path");
        expect(paths.length).toBe(1);
        expect(paths[0].getAttribute("data-series-name")).toBe("Visitors");
        expect(paths[0].getAttribute("d")).toMatch(/^M /);
    });

    test("the svg is decorative (presentation role, aria-hidden)", () => {
        const host = render(`<lily-area-chart label="Visitors over time" series='${SERIES_JSON}'></lily-area-chart>`);

        const svg = host.querySelector("svg")!;
        expect(svg.getAttribute("role")).toBe("presentation");
        expect(svg.getAttribute("aria-hidden")).toBe("true");
    });

    test("renders a description figcaption referenced by aria-describedby", () => {
        const host = render(
            `<lily-area-chart label="Visitors" description="Area shows visitor volume." series='${SERIES_JSON}'></lily-area-chart>`,
        );

        const figure = host.querySelector("figure")!;
        const describedbyId = figure.getAttribute("aria-describedby")!;
        expect(document.getElementById(describedbyId)!.textContent).toBe("Area shows visitor volume.");
    });

    test("moves a slot=data-table child in after the chart", () => {
        const host = render(
            `<lily-area-chart label="Visitors" series='${SERIES_JSON}'><table slot="data-table"><caption>Visitors</caption></table></lily-area-chart>`,
        );

        expect(host.querySelector("figure table")).toBeTruthy();
    });

    test("the series property is live and re-renders on set", () => {
        const host = render('<lily-area-chart label="Visitors"></lily-area-chart>') as unknown as AreaChart;

        expect(host.querySelectorAll("svg path").length).toBe(0);

        host.series = [{ name: "New", points: [{ x: 0, y: 1 }] }];

        expect(host.querySelectorAll("svg path").length).toBe(1);
        expect(host.series).toEqual([{ name: "New", points: [{ x: 0, y: 1 }] }]);
    });

    test("ignores malformed JSON in the series attribute", () => {
        const host = render('<lily-area-chart label="Visitors" series="not json"></lily-area-chart>') as unknown as AreaChart;

        expect(host.series).toEqual([]);
    });
});
