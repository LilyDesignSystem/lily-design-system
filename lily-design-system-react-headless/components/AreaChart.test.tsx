import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AreaChart from "./AreaChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;
const table = <table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>;

describe("AreaChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<AreaChart label="Test">{art}</AreaChart>);
        expect(container.querySelector("figure.area-chart")).toBeTruthy();
    });

    it("exposes the graphic as a single named image", () => {
        render(<AreaChart label="Test">{art}</AreaChart>);
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("area-chart-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    it("omits aria-label when no label is given", () => {
        const { container } = render(<AreaChart>{art}</AreaChart>);
        expect(container.querySelector(".area-chart-graphic")!.hasAttribute("aria-label")).toBe(false);
    });

    it("does not put role=img on the figure", () => {
        const { container } = render(<AreaChart label="T">{art}</AreaChart>);
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<AreaChart label="T" className="mine">{art}</AreaChart>);
        expect(container.querySelector("figure")!.getAttribute("class")).toBe("area-chart mine");
    });

    it("renders the consumer svg inside the image wrapper", () => {
        render(<AreaChart label="T">{art}</AreaChart>);
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    it("renders no data-table wrapper without dataTable", () => {
        const { container } = render(<AreaChart label="T">{art}</AreaChart>);
        expect(container.querySelector(".area-chart-data-table")).toBeNull();
    });

    it("renders dataTable in a .area-chart-data-table sibling after the graphic", () => {
        const { container } = render(<AreaChart label="T" dataTable={table}>{art}</AreaChart>);
        const wrap = container.querySelector(".area-chart-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".area-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    it("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(<AreaChart label="T" dataTable={table}>{art}</AreaChart>);
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    it("spreads rest props onto the figure", () => {
        render(<AreaChart label="T" id="c1" data-testid="chart">{art}</AreaChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
