import { afterEach, describe, expect, test } from "vitest";

import { SankeyChart } from "./sankey-chart.js";

if (!customElements.get("lily-sankey-chart")) {
    customElements.define("lily-sankey-chart", SankeyChart);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const SVG = '<svg data-testid="art" viewBox="0 0 10 10"><circle r="4"></circle></svg>';
const TABLE = '<table slot="data-table"><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>';
const BASIC = `<lily-sankey-chart label="Test">${SVG}</lily-sankey-chart>`;
const WITH_TABLE = `<lily-sankey-chart label="Test">${SVG}${TABLE}</lily-sankey-chart>`;

describe("SankeyChart", () => {
    test("renders a figure with the base class", () => {
        expect(render(BASIC).querySelector("figure.sankey-chart")).toBeTruthy();
    });

    test("exposes the graphic as a single named image, not the figure", () => {
        const host = render(BASIC);
        const g = host.querySelector(".sankey-chart-graphic")!;
        expect(g.tagName).toBe("DIV");
        expect(g.getAttribute("role")).toBe("img");
        expect(g.getAttribute("aria-label")).toBe("Test");
        expect(host.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    test("appends the consumer class after the base class", () => {
        const host = render('<lily-sankey-chart label="T" class="mine"></lily-sankey-chart>');
        expect(host.querySelector("figure")!.getAttribute("class")).toBe("sankey-chart mine");
    });

    test("moves the consumer svg into the graphic wrapper", () => {
        const host = render(BASIC);
        expect(host.querySelector("svg")!.closest("[role=img]")).toBe(host.querySelector(".sankey-chart-graphic"));
    });

    test("spreads other attributes onto the figure", () => {
        const host = render('<lily-sankey-chart label="T" id="c1" data-testid="chart"></lily-sankey-chart>');
        const fig = host.querySelector("figure")!;
        expect(fig.id).toBe("c1");
        expect(fig.getAttribute("data-testid")).toBe("chart");
    });

    test("renders no data-table wrapper without a slot=data-table child", () => {
        expect(render(BASIC).querySelector(".sankey-chart-data-table")).toBeNull();
    });

    test("moves a slot=data-table child into a sibling wrapper after the graphic", () => {
        const host = render(WITH_TABLE);
        const wrap = host.querySelector(".sankey-chart-data-table")!;
        expect(wrap.querySelector("table")).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(host.querySelector(".sankey-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    test("keeps the table outside the role=img element so assistive technology can reach it", () => {
        const host = render(WITH_TABLE);
        expect(host.querySelector("table")!.closest("[role=img]")).toBeNull();
        expect(host.querySelector("[role=img] table")).toBeNull();
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render(WITH_TABLE);
        (host as unknown as SankeyChart).connectedCallback();
        expect(host.querySelectorAll("figure").length).toBe(1);
        expect(host.querySelectorAll(".sankey-chart-data-table").length).toBe(1);
    });
});
