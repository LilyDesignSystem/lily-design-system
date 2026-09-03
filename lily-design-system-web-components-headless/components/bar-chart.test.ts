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
    test("renders a figure with role=img", () => {
        const host = render(`<lily-bar-chart label="Sales by day" categories='${CATEGORIES_JSON}'></lily-bar-chart>`);

        expect(host.querySelector("figure")!.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-bar-chart label="Sales by day" categories='${CATEGORIES_JSON}'></lily-bar-chart>`);

        expect(host.querySelector("figure")!.getAttribute("aria-label")).toBe("Sales by day");
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

        const figure = host.querySelector("figure")!;
        const describedbyId = figure.getAttribute("aria-describedby")!;
        expect(document.getElementById(describedbyId)!.textContent).toBe("Bars show daily sales.");
    });

    test("moves a slot=data-table child in after the chart", () => {
        const host = render(
            `<lily-bar-chart label="Sales by day" categories='${CATEGORIES_JSON}'><table slot="data-table"><caption>Sales</caption></table></lily-bar-chart>`,
        );

        expect(host.querySelector("figure table")).toBeTruthy();
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
