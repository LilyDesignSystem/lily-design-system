import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import HeatmapChart from "./HeatmapChart.svelte";

function svgSnippet() {
    return createRawSnippet(() => ({
        render: () => `<svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>`,
    }));
}

describe("HeatmapChart", () => {
    it("renders a <figure> with the base class", () => {
        const { container } = render(HeatmapChart, { props: { label: "Test", children: svgSnippet() } });
        const el = container.querySelector("figure.heatmap-chart");
        expect(el).toBeTruthy();
    });

    it("exposes the chart as a single image", () => {
        render(HeatmapChart, { props: { label: "Test", children: svgSnippet() } });
        expect(screen.getByRole("img", { name: "Test" }).tagName).toBe("FIGURE");
    });

    it("sets aria-label from label", () => {
        render(HeatmapChart, { props: { label: "Quarterly figures", children: svgSnippet() } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Quarterly figures");
    });

    it("appends the consumer class after the base class", () => {
        render(HeatmapChart, { props: { label: "T", class: "mine", children: svgSnippet() } });
        expect(screen.getByRole("img").getAttribute("class")).toBe("heatmap-chart mine");
    });

    it("renders the consumer svg as children", () => {
        render(HeatmapChart, { props: { label: "T", children: svgSnippet() } });
        expect(screen.getByTestId("art").closest("figure")).toBe(screen.getByRole("img"));
    });

    it("passes aria-describedby through to the figure", () => {
        render(HeatmapChart, { props: { label: "T", "aria-describedby": "desc", children: svgSnippet() } });
        expect(screen.getByRole("img").getAttribute("aria-describedby")).toBe("desc");
    });

    it("spreads rest props onto the figure", () => {
        render(HeatmapChart, { props: { label: "T", id: "c1", "data-testid": "chart", children: svgSnippet() } });
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
