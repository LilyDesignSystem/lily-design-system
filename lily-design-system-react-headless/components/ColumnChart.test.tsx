import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ColumnChart from "./ColumnChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;
const table = <table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>;

describe("ColumnChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<ColumnChart label="Test">{art}</ColumnChart>);
        expect(container.querySelector("figure.column-chart")).toBeTruthy();
    });

    it("exposes the graphic as a single named image", () => {
        render(<ColumnChart label="Test">{art}</ColumnChart>);
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("column-chart-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    it("omits aria-label when no label is given", () => {
        const { container } = render(<ColumnChart>{art}</ColumnChart>);
        expect(container.querySelector(".column-chart-graphic")!.hasAttribute("aria-label")).toBe(false);
    });

    it("does not put role=img on the figure", () => {
        const { container } = render(<ColumnChart label="T">{art}</ColumnChart>);
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<ColumnChart label="T" className="mine">{art}</ColumnChart>);
        expect(container.querySelector("figure")!.getAttribute("class")).toBe("column-chart mine");
    });

    it("renders the consumer svg inside the image wrapper", () => {
        render(<ColumnChart label="T">{art}</ColumnChart>);
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    it("renders no data-table wrapper without dataTable", () => {
        const { container } = render(<ColumnChart label="T">{art}</ColumnChart>);
        expect(container.querySelector(".column-chart-data-table")).toBeNull();
    });

    it("renders dataTable in a .column-chart-data-table sibling after the graphic", () => {
        const { container } = render(<ColumnChart label="T" dataTable={table}>{art}</ColumnChart>);
        const wrap = container.querySelector(".column-chart-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".column-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    it("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(<ColumnChart label="T" dataTable={table}>{art}</ColumnChart>);
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    it("spreads rest props onto the figure", () => {
        render(<ColumnChart label="T" id="c1" data-testid="chart">{art}</ColumnChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
