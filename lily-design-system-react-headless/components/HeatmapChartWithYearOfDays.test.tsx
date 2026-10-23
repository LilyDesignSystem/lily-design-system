import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeatmapChartWithYearOfDays from "./HeatmapChartWithYearOfDays";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;
const table = <table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>;

describe("HeatmapChartWithYearOfDays", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<HeatmapChartWithYearOfDays label="Test" year={2026} weekStart={0}>{art}</HeatmapChartWithYearOfDays>);
        expect(container.querySelector("figure.heatmap-chart-with-year-of-days")).toBeTruthy();
    });

    it("exposes the graphic as a single named image", () => {
        render(<HeatmapChartWithYearOfDays label="Test" year={2026} weekStart={0}>{art}</HeatmapChartWithYearOfDays>);
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("heatmap-chart-with-year-of-days-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    it("does not put role=img on the figure", () => {
        const { container } = render(<HeatmapChartWithYearOfDays label="T" year={2026} weekStart={0}>{art}</HeatmapChartWithYearOfDays>);
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<HeatmapChartWithYearOfDays label="T" year={2026} weekStart={0} className="mine">{art}</HeatmapChartWithYearOfDays>);
        expect(container.querySelector("figure")!.getAttribute("class")).toBe("heatmap-chart-with-year-of-days mine");
    });

    it("renders the consumer svg inside the image wrapper", () => {
        render(<HeatmapChartWithYearOfDays label="T" year={2026} weekStart={0}>{art}</HeatmapChartWithYearOfDays>);
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    it("renders no data-table wrapper without dataTable", () => {
        const { container } = render(<HeatmapChartWithYearOfDays label="T" year={2026} weekStart={0}>{art}</HeatmapChartWithYearOfDays>);
        expect(container.querySelector(".heatmap-chart-with-year-of-days-data-table")).toBeNull();
    });

    it("renders dataTable in a .heatmap-chart-with-year-of-days-data-table sibling after the graphic", () => {
        const { container } = render(<HeatmapChartWithYearOfDays label="T" year={2026} weekStart={0} dataTable={table}>{art}</HeatmapChartWithYearOfDays>);
        const wrap = container.querySelector(".heatmap-chart-with-year-of-days-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".heatmap-chart-with-year-of-days-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    it("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(<HeatmapChartWithYearOfDays label="T" year={2026} weekStart={0} dataTable={table}>{art}</HeatmapChartWithYearOfDays>);
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    it("spreads rest props onto the figure", () => {
        render(<HeatmapChartWithYearOfDays label="T" year={2026} weekStart={0} id="c1" data-testid="chart">{art}</HeatmapChartWithYearOfDays>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });

    it("reflects year and weekStart as data attributes on the figure", () => {
        const { container } = render(<HeatmapChartWithYearOfDays label="T" year={2025} weekStart={1}>{art}</HeatmapChartWithYearOfDays>);
        const fig = container.querySelector("figure")!;
        expect(fig.getAttribute("data-year")).toBe("2025");
        expect(fig.getAttribute("data-week-start")).toBe("1");
    });
});
