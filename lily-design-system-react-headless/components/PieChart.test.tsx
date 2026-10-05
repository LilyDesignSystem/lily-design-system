import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PieChart from "./PieChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;
const table = <table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>;

describe("PieChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<PieChart label="Test">{art}</PieChart>);
        expect(container.querySelector("figure.pie-chart")).toBeTruthy();
    });

    it("exposes the graphic as a single named image", () => {
        render(<PieChart label="Test">{art}</PieChart>);
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("pie-chart-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    it("omits aria-label when no label is given", () => {
        const { container } = render(<PieChart>{art}</PieChart>);
        expect(container.querySelector(".pie-chart-graphic")!.hasAttribute("aria-label")).toBe(false);
    });

    it("does not put role=img on the figure", () => {
        const { container } = render(<PieChart label="T">{art}</PieChart>);
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<PieChart label="T" className="mine">{art}</PieChart>);
        expect(container.querySelector("figure")!.getAttribute("class")).toBe("pie-chart mine");
    });

    it("renders the consumer svg inside the image wrapper", () => {
        render(<PieChart label="T">{art}</PieChart>);
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    it("renders no data-table wrapper without dataTable", () => {
        const { container } = render(<PieChart label="T">{art}</PieChart>);
        expect(container.querySelector(".pie-chart-data-table")).toBeNull();
    });

    it("renders dataTable in a .pie-chart-data-table sibling after the graphic", () => {
        const { container } = render(<PieChart label="T" dataTable={table}>{art}</PieChart>);
        const wrap = container.querySelector(".pie-chart-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".pie-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    it("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(<PieChart label="T" dataTable={table}>{art}</PieChart>);
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    it("spreads rest props onto the figure", () => {
        render(<PieChart label="T" id="c1" data-testid="chart">{art}</PieChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
