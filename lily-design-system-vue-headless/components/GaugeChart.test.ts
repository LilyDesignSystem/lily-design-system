import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./GaugeChart.vue";

const svg = `<svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>`;

describe("GaugeChart", () => {
    test("renders a <figure> with the base class", () => {
        const { container } = render(Subject, { props: { label: "Test" }, slots: { default: svg } });
        expect(container.querySelector("figure.gauge-chart")).toBeTruthy();
    });

    test("exposes the chart as a single image", () => {
        render(Subject, { props: { label: "Test" }, slots: { default: svg } });
        expect(screen.getByRole("img", { name: "Test" }).tagName).toBe("FIGURE");
    });

    test("sets aria-label from label", () => {
        render(Subject, { props: { label: "Quarterly figures" }, slots: { default: svg } });
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Quarterly figures");
    });

    test("appends the consumer class after the base class", () => {
        render(Subject, { props: { label: "T" }, attrs: { class: "mine" }, slots: { default: svg } });
        expect(screen.getByRole("img").getAttribute("class")).toBe("gauge-chart mine");
    });

    test("renders the consumer svg as the slot", () => {
        render(Subject, { props: { label: "T" }, slots: { default: svg } });
        expect(screen.getByTestId("art").closest("figure")).toBe(screen.getByRole("img"));
    });

    test("passes aria-describedby through to the figure", () => {
        render(Subject, { props: { label: "T" }, attrs: { "aria-describedby": "desc" }, slots: { default: svg } });
        expect(screen.getByRole("img").getAttribute("aria-describedby")).toBe("desc");
    });

    test("spreads rest props onto the figure", () => {
        render(Subject, { props: { label: "T" }, attrs: { id: "c1", "data-testid": "chart" }, slots: { default: svg } });
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
    });
});
