import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GaugeChart from "./GaugeChart";

const art = <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>;

describe("GaugeChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(<GaugeChart label="Test">{art}</GaugeChart>);
        expect(container.querySelector("figure.gauge-chart")).toBeTruthy();
    });

    it("exposes the chart as a single image", () => {
        render(<GaugeChart label="Test">{art}</GaugeChart>);
        expect(screen.getByRole("img", { name: "Test" }).tagName).toBe("FIGURE");
    });

    it("sets aria-label from label", () => {
        render(<GaugeChart label="Quarterly figures">{art}</GaugeChart>);
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Quarterly figures");
    });

    it("appends the consumer class after the base class", () => {
        render(<GaugeChart label="T" className="mine">{art}</GaugeChart>);
        expect(screen.getByRole("img").getAttribute("class")).toBe("gauge-chart mine");
    });

    it("renders the consumer svg as children", () => {
        render(<GaugeChart label="T">{art}</GaugeChart>);
        expect(screen.getByTestId("art").closest("figure")).toBe(screen.getByRole("img"));
    });

    it("passes aria-describedby through to the figure", () => {
        render(<GaugeChart label="T" aria-describedby="desc">{art}</GaugeChart>);
        expect(screen.getByRole("img").getAttribute("aria-describedby")).toBe("desc");
    });

    it("spreads rest props onto the figure", () => {
        render(<GaugeChart label="T" id="c1" data-testid="chart">{art}</GaugeChart>);
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
