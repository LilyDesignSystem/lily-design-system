import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChoroplethChart from "./ChoroplethChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;
const table = <table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>;

describe("ChoroplethChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<ChoroplethChart label="Test">{art}</ChoroplethChart>);
        expect(container.querySelector("figure.choropleth-chart")).toBeTruthy();
    });

    it("exposes the graphic as a single named image", () => {
        render(<ChoroplethChart label="Test">{art}</ChoroplethChart>);
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("choropleth-chart-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    it("omits aria-label when no label is given", () => {
        const { container } = render(<ChoroplethChart>{art}</ChoroplethChart>);
        expect(container.querySelector(".choropleth-chart-graphic")!.hasAttribute("aria-label")).toBe(false);
    });

    it("does not put role=img on the figure", () => {
        const { container } = render(<ChoroplethChart label="T">{art}</ChoroplethChart>);
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<ChoroplethChart label="T" className="mine">{art}</ChoroplethChart>);
        expect(container.querySelector("figure")!.getAttribute("class")).toBe("choropleth-chart mine");
    });

    it("renders the consumer svg inside the image wrapper", () => {
        render(<ChoroplethChart label="T">{art}</ChoroplethChart>);
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    it("renders no data-table wrapper without dataTable", () => {
        const { container } = render(<ChoroplethChart label="T">{art}</ChoroplethChart>);
        expect(container.querySelector(".choropleth-chart-data-table")).toBeNull();
    });

    it("renders dataTable in a .choropleth-chart-data-table sibling after the graphic", () => {
        const { container } = render(<ChoroplethChart label="T" dataTable={table}>{art}</ChoroplethChart>);
        const wrap = container.querySelector(".choropleth-chart-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".choropleth-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    it("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(<ChoroplethChart label="T" dataTable={table}>{art}</ChoroplethChart>);
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    it("spreads rest props onto the figure", () => {
        render(<ChoroplethChart label="T" id="c1" data-testid="chart">{art}</ChoroplethChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
