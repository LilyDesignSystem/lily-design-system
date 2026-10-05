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
    test("exposes the graphic as a named image, not the figure", () => {
        const host = render(`<lily-area-chart label="Visitors over time" series='${SERIES_JSON}'></lily-area-chart>`);

        expect(host.querySelector(".area-chart-graphic")!.getAttribute("role")).toBe("img");
        expect(host.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-area-chart label="Visitors over time" series='${SERIES_JSON}'></lily-area-chart>`);

        expect(host.querySelector(".area-chart-graphic")!.getAttribute("aria-label")).toBe("Visitors over time");
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

        const graphic = host.querySelector(".area-chart-graphic")!;
        const describedbyId = graphic.getAttribute("aria-describedby")!;
        expect(document.getElementById(describedbyId)!.textContent).toBe("Area shows visitor volume.");
    });

    test("moves a slot=data-table child into a sibling wrapper after the graphic, outside role=img", () => {
        const host = render(
            `<lily-area-chart label="Visitors" series='${SERIES_JSON}'><table slot="data-table"><caption>Visitors</caption></table></lily-area-chart>`,
        );

        const wrap = host.querySelector(".area-chart-data-table")!;
        expect(wrap.querySelector("table")).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(host.querySelector(".area-chart-graphic"));
        expect(host.querySelector("[role=img] table")).toBeNull();
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
