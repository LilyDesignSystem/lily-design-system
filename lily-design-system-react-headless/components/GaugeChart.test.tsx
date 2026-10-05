import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GaugeChart from "./GaugeChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;
const table = <table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>;

describe("GaugeChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<GaugeChart label="Test">{art}</GaugeChart>);
        expect(container.querySelector("figure.gauge-chart")).toBeTruthy();
    });

    it("exposes the graphic as a single named image", () => {
        render(<GaugeChart label="Test">{art}</GaugeChart>);
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("gauge-chart-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    it("does not put role=img on the figure", () => {
        const { container } = render(<GaugeChart label="T">{art}</GaugeChart>);
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<GaugeChart label="T" className="mine">{art}</GaugeChart>);
        expect(container.querySelector("figure")!.getAttribute("class")).toBe("gauge-chart mine");
    });

    it("renders the consumer svg inside the image wrapper", () => {
        render(<GaugeChart label="T">{art}</GaugeChart>);
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    it("renders no data-table wrapper without dataTable", () => {
        const { container } = render(<GaugeChart label="T">{art}</GaugeChart>);
        expect(container.querySelector(".gauge-chart-data-table")).toBeNull();
    });

    it("renders dataTable in a .gauge-chart-data-table sibling after the graphic", () => {
        const { container } = render(<GaugeChart label="T" dataTable={table}>{art}</GaugeChart>);
        const wrap = container.querySelector(".gauge-chart-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".gauge-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    it("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(<GaugeChart label="T" dataTable={table}>{art}</GaugeChart>);
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    it("spreads rest props onto the figure", () => {
        render(<GaugeChart label="T" id="c1" data-testid="chart">{art}</GaugeChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
