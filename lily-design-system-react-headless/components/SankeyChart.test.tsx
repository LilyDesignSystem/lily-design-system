import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SankeyChart from "./SankeyChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;

describe("SankeyChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<SankeyChart label="Test">{art}</SankeyChart>);
        expect(container.querySelector("figure.sankey-chart")).toBeTruthy();
    });

    it("exposes the chart as a single image", () => {
        render(<SankeyChart label="Test">{art}</SankeyChart>);
        expect(screen.getByRole("img", { name: "Test" }).tagName).toBe("FIGURE");
    });

    it("sets aria-label from label", () => {
        render(<SankeyChart label="Quarterly figures">{art}</SankeyChart>);
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Quarterly figures");
    });

    it("appends the consumer class after the base class", () => {
        render(<SankeyChart label="T" className="mine">{art}</SankeyChart>);
        expect(screen.getByRole("img").getAttribute("class")).toBe("sankey-chart mine");
    });

    it("renders the consumer svg as children", () => {
        render(<SankeyChart label="T">{art}</SankeyChart>);
        expect(screen.getByTestId("art").closest("figure")).toBe(screen.getByRole("img"));
    });

    it("passes aria-describedby through to the figure", () => {
        render(<SankeyChart label="T" aria-describedby="desc">{art}</SankeyChart>);
        expect(screen.getByRole("img").getAttribute("aria-describedby")).toBe("desc");
    });

    it("spreads rest props onto the figure", () => {
        render(<SankeyChart label="T" id="c1" data-testid="chart">{art}</SankeyChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
