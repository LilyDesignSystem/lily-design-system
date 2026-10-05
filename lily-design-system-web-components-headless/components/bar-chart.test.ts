import { afterEach, describe, expect, test } from "vitest";

import { BarChart } from "./bar-chart.js";

if (!customElements.get("lily-bar-chart")) {
    customElements.define("lily-bar-chart", BarChart);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const CATEGORIES_JSON = JSON.stringify([
    { label: "Mon", value: 4 },
    { label: "Tue", value: 9 },
]);

describe("BarChart", () => {
    test("exposes the graphic as a named image, not the figure", () => {
        const host = render(`<lily-bar-chart label="Sales by day" categories='${CATEGORIES_JSON}'></lily-bar-chart>`);

        expect(host.querySelector(".bar-chart-graphic")!.getAttribute("role")).toBe("img");
        expect(host.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-bar-chart label="Sales by day" categories='${CATEGORIES_JSON}'></lily-bar-chart>`);

        expect(host.querySelector(".bar-chart-graphic")!.getAttribute("aria-label")).toBe("Sales by day");
    });

    test("renders one svg rect per category", () => {
        const host = render(`<lily-bar-chart label="Sales by day" categories='${CATEGORIES_JSON}'></lily-bar-chart>`);

        expect(host.querySelectorAll("svg rect").length).toBe(2);
    });

    test("the svg is decorative (presentation role, aria-hidden)", () => {
        const host = render(`<lily-bar-chart label="Sales by day" categories='${CATEGORIES_JSON}'></lily-bar-chart>`);

        const svg = host.querySelector("svg")!;
        expect(svg.getAttribute("role")).toBe("presentation");
        expect(svg.getAttribute("aria-hidden")).toBe("true");
    });

    test("renders a description figcaption referenced by aria-describedby", () => {
        const host = render(
            `<lily-bar-chart label="Sales by day" description="Bars show daily sales." categories='${CATEGORIES_JSON}'></lily-bar-chart>`,
        );

        const graphic = host.querySelector(".bar-chart-graphic")!;
        const describedbyId = graphic.getAttribute("aria-describedby")!;
        expect(document.getElementById(describedbyId)!.textContent).toBe("Bars show daily sales.");
    });

    test("moves a slot=data-table child into a sibling wrapper after the graphic, outside role=img", () => {
        const host = render(
            `<lily-bar-chart label="Sales by day" categories='${CATEGORIES_JSON}'><table slot="data-table"><caption>Sales</caption></table></lily-bar-chart>`,
        );

        const wrap = host.querySelector(".bar-chart-data-table")!;
        expect(wrap.querySelector("table")).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(host.querySelector(".bar-chart-graphic"));
        expect(host.querySelector("[role=img] table")).toBeNull();
    });

    test("the categories property is live and re-renders on set", () => {
        const host = render('<lily-bar-chart label="Sales by day"></lily-bar-chart>') as unknown as BarChart;

        expect(host.querySelectorAll("svg rect").length).toBe(0);

        host.categories = [{ label: "Wed", value: 3 }];

        expect(host.querySelectorAll("svg rect").length).toBe(1);
        expect(host.categories).toEqual([{ label: "Wed", value: 3 }]);
    });

    test("ignores malformed JSON in the categories attribute", () => {
        const host = render('<lily-bar-chart label="Sales by day" categories="not json"></lily-bar-chart>') as unknown as BarChart;

        expect(host.categories).toEqual([]);
    });
});
