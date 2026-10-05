import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RadarChart from "./RadarChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;

describe("RadarChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<RadarChart label="Test">{art}</RadarChart>);
        expect(container.querySelector("figure.radar-chart")).toBeTruthy();
    });

    it("exposes the chart as a single image", () => {
        render(<RadarChart label="Test">{art}</RadarChart>);
        expect(screen.getByRole("img", { name: "Test" }).tagName).toBe("FIGURE");
    });

    it("sets aria-label from label", () => {
        render(<RadarChart label="Quarterly figures">{art}</RadarChart>);
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Quarterly figures");
    });

    it("appends the consumer class after the base class", () => {
        render(<RadarChart label="T" className="mine">{art}</RadarChart>);
        expect(screen.getByRole("img").getAttribute("class")).toBe("radar-chart mine");
    });

    it("renders the consumer svg as children", () => {
        render(<RadarChart label="T">{art}</RadarChart>);
        expect(screen.getByTestId("art").closest("figure")).toBe(screen.getByRole("img"));
    });

    it("passes aria-describedby through to the figure", () => {
        render(<RadarChart label="T" aria-describedby="desc">{art}</RadarChart>);
        expect(screen.getByRole("img").getAttribute("aria-describedby")).toBe("desc");
    });

    it("spreads rest props onto the figure", () => {
        render(<RadarChart label="T" id="c1" data-testid="chart">{art}</RadarChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
