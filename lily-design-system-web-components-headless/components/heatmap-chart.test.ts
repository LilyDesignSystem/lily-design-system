import { afterEach, describe, expect, test } from "vitest";

import { HeatmapChart } from "./heatmap-chart.js";

if (!customElements.get("lily-heatmap-chart")) {
    customElements.define("lily-heatmap-chart", HeatmapChart);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const SVG = '<svg data-testid="art" viewBox="0 0 10 10"><circle r="4"></circle></svg>';
const BASIC = `<lily-heatmap-chart label="Test">${SVG}</lily-heatmap-chart>`;

describe("HeatmapChart", () => {
    test("renders a figure with the base class", () => {
        expect(render(BASIC).querySelector("figure.heatmap-chart")).toBeTruthy();
    });

    test("exposes the chart as a single image", () => {
        expect(render(BASIC).querySelector("figure")!.getAttribute("role")).toBe("img");
    });

    test("sets aria-label from label", () => {
        const host = render('<lily-heatmap-chart label="Quarterly figures"></lily-heatmap-chart>');
        expect(host.querySelector("figure")!.getAttribute("aria-label")).toBe("Quarterly figures");
    });

    test("appends the consumer class after the base class", () => {
        const host = render('<lily-heatmap-chart label="T" class="mine"></lily-heatmap-chart>');
        expect(host.querySelector("figure")!.getAttribute("class")).toBe("heatmap-chart mine");
    });

    test("moves the consumer svg into the figure", () => {
        const host = render(BASIC);
        expect(host.querySelector("svg")!.closest("figure")).toBe(host.querySelector("figure"));
    });

    test("passes aria-describedby through to the figure", () => {
        const host = render('<lily-heatmap-chart label="T" aria-describedby="desc"></lily-heatmap-chart>');
        expect(host.querySelector("figure")!.getAttribute("aria-describedby")).toBe("desc");
    });

    test("spreads other attributes onto the figure", () => {
        const host = render('<lily-heatmap-chart label="T" id="c1" data-testid="chart"></lily-heatmap-chart>');
        const fig = host.querySelector("figure")!;
        expect(fig.id).toBe("c1");
        expect(fig.getAttribute("data-testid")).toBe("chart");
    });

    test("keeps a slot=data-table child inside the figure", () => {
        const host = render('<lily-heatmap-chart label="T">' + SVG + '<table slot="data-table"></table></lily-heatmap-chart>');
        expect(host.querySelector("figure table")).toBeTruthy();
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render(BASIC);
        (host as unknown as HeatmapChart).connectedCallback();
        expect(host.querySelectorAll("figure").length).toBe(1);
    });
});
