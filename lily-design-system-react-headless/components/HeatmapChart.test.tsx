import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeatmapChart from "./HeatmapChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;

describe("HeatmapChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<HeatmapChart label="Test">{art}</HeatmapChart>);
        expect(container.querySelector("figure.heatmap-chart")).toBeTruthy();
    });

    it("exposes the chart as a single image", () => {
        render(<HeatmapChart label="Test">{art}</HeatmapChart>);
        expect(screen.getByRole("img", { name: "Test" }).tagName).toBe("FIGURE");
    });

    it("sets aria-label from label", () => {
        render(<HeatmapChart label="Quarterly figures">{art}</HeatmapChart>);
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Quarterly figures");
    });

    it("appends the consumer class after the base class", () => {
        render(<HeatmapChart label="T" className="mine">{art}</HeatmapChart>);
        expect(screen.getByRole("img").getAttribute("class")).toBe("heatmap-chart mine");
    });

    it("renders the consumer svg as children", () => {
        render(<HeatmapChart label="T">{art}</HeatmapChart>);
        expect(screen.getByTestId("art").closest("figure")).toBe(screen.getByRole("img"));
    });

    it("passes aria-describedby through to the figure", () => {
        render(<HeatmapChart label="T" aria-describedby="desc">{art}</HeatmapChart>);
        expect(screen.getByRole("img").getAttribute("aria-describedby")).toBe("desc");
    });

    it("spreads rest props onto the figure", () => {
        render(<HeatmapChart label="T" id="c1" data-testid="chart">{art}</HeatmapChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
