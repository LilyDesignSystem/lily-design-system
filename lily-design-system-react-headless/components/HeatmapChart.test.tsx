import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeatmapChart from "./HeatmapChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;
const table = <table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>;

describe("HeatmapChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<HeatmapChart label="Test">{art}</HeatmapChart>);
        expect(container.querySelector("figure.heatmap-chart")).toBeTruthy();
    });

    it("exposes the graphic as a single named image", () => {
        render(<HeatmapChart label="Test">{art}</HeatmapChart>);
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("heatmap-chart-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    it("does not put role=img on the figure", () => {
        const { container } = render(<HeatmapChart label="T">{art}</HeatmapChart>);
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<HeatmapChart label="T" className="mine">{art}</HeatmapChart>);
        expect(container.querySelector("figure")!.getAttribute("class")).toBe("heatmap-chart mine");
    });

    it("renders the consumer svg inside the image wrapper", () => {
        render(<HeatmapChart label="T">{art}</HeatmapChart>);
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    it("renders no data-table wrapper without dataTable", () => {
        const { container } = render(<HeatmapChart label="T">{art}</HeatmapChart>);
        expect(container.querySelector(".heatmap-chart-data-table")).toBeNull();
    });

    it("renders dataTable in a .heatmap-chart-data-table sibling after the graphic", () => {
        const { container } = render(<HeatmapChart label="T" dataTable={table}>{art}</HeatmapChart>);
        const wrap = container.querySelector(".heatmap-chart-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".heatmap-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    it("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(<HeatmapChart label="T" dataTable={table}>{art}</HeatmapChart>);
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    it("spreads rest props onto the figure", () => {
        render(<HeatmapChart label="T" id="c1" data-testid="chart">{art}</HeatmapChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
