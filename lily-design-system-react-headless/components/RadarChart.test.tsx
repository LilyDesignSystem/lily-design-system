import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RadarChart from "./RadarChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;
const table = <table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>;

describe("RadarChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<RadarChart label="Test">{art}</RadarChart>);
        expect(container.querySelector("figure.radar-chart")).toBeTruthy();
    });

    it("exposes the graphic as a single named image", () => {
        render(<RadarChart label="Test">{art}</RadarChart>);
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("radar-chart-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    it("does not put role=img on the figure", () => {
        const { container } = render(<RadarChart label="T">{art}</RadarChart>);
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<RadarChart label="T" className="mine">{art}</RadarChart>);
        expect(container.querySelector("figure")!.getAttribute("class")).toBe("radar-chart mine");
    });

    it("renders the consumer svg inside the image wrapper", () => {
        render(<RadarChart label="T">{art}</RadarChart>);
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    it("renders no data-table wrapper without dataTable", () => {
        const { container } = render(<RadarChart label="T">{art}</RadarChart>);
        expect(container.querySelector(".radar-chart-data-table")).toBeNull();
    });

    it("renders dataTable in a .radar-chart-data-table sibling after the graphic", () => {
        const { container } = render(<RadarChart label="T" dataTable={table}>{art}</RadarChart>);
        const wrap = container.querySelector(".radar-chart-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".radar-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    it("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(<RadarChart label="T" dataTable={table}>{art}</RadarChart>);
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    it("spreads rest props onto the figure", () => {
        render(<RadarChart label="T" id="c1" data-testid="chart">{art}</RadarChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
