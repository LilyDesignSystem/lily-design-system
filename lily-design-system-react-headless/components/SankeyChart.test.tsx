import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SankeyChart from "./SankeyChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;
const table = <table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>;

describe("SankeyChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<SankeyChart label="Test">{art}</SankeyChart>);
        expect(container.querySelector("figure.sankey-chart")).toBeTruthy();
    });

    it("exposes the graphic as a single named image", () => {
        render(<SankeyChart label="Test">{art}</SankeyChart>);
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("sankey-chart-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    it("does not put role=img on the figure", () => {
        const { container } = render(<SankeyChart label="T">{art}</SankeyChart>);
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<SankeyChart label="T" className="mine">{art}</SankeyChart>);
        expect(container.querySelector("figure")!.getAttribute("class")).toBe("sankey-chart mine");
    });

    it("renders the consumer svg inside the image wrapper", () => {
        render(<SankeyChart label="T">{art}</SankeyChart>);
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    it("renders no data-table wrapper without dataTable", () => {
        const { container } = render(<SankeyChart label="T">{art}</SankeyChart>);
        expect(container.querySelector(".sankey-chart-data-table")).toBeNull();
    });

    it("renders dataTable in a .sankey-chart-data-table sibling after the graphic", () => {
        const { container } = render(<SankeyChart label="T" dataTable={table}>{art}</SankeyChart>);
        const wrap = container.querySelector(".sankey-chart-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".sankey-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    it("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(<SankeyChart label="T" dataTable={table}>{art}</SankeyChart>);
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    it("spreads rest props onto the figure", () => {
        render(<SankeyChart label="T" id="c1" data-testid="chart">{art}</SankeyChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
