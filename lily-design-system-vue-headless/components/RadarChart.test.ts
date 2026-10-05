import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./RadarChart.vue";

const svg = `<svg data-testid="art" viewBox="0 0 10 10"><circle r="4" /></svg>`;
const table = `<table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>`;

describe("RadarChart", () => {
    test("renders a <figure> with the base class", () => {
        const { container } = render(Subject, { props: { label: "Test" }, slots: { default: svg } });
        expect(container.querySelector("figure.radar-chart")).toBeTruthy();
    });

    test("exposes the graphic as a single named image", () => {
        render(Subject, { props: { label: "Test" }, slots: { default: svg } });
        const img = screen.getByRole("img", { name: "Test" });
        expect(img.tagName).toBe("DIV");
        expect(img.getAttribute("class")).toBe("radar-chart-graphic");
        expect(img.getAttribute("aria-label")).toBe("Test");
    });

    test("does not put role=img on the figure", () => {
        const { container } = render(Subject, { props: { label: "T" }, slots: { default: svg } });
        expect(container.querySelector("figure")!.hasAttribute("role")).toBe(false);
    });

    test("renders the consumer svg inside the image wrapper", () => {
        render(Subject, { props: { label: "T" }, slots: { default: svg } });
        expect(screen.getByTestId("art").closest("[role=img]")).toBe(screen.getByRole("img"));
    });

    test("renders no data-table wrapper without the dataTable slot", () => {
        const { container } = render(Subject, { props: { label: "T" }, slots: { default: svg } });
        expect(container.querySelector(".radar-chart-data-table")).toBeNull();
    });

    test("renders the dataTable slot in a .radar-chart-data-table sibling after the graphic", () => {
        const { container } = render(Subject, { props: { label: "T" }, slots: { default: svg, dataTable: table } });
        const wrap = container.querySelector(".radar-chart-data-table")!;
        expect(wrap).toBeTruthy();
        expect(wrap.previousElementSibling).toBe(container.querySelector(".radar-chart-graphic"));
        expect(wrap.parentElement!.tagName).toBe("FIGURE");
    });

    test("keeps the table outside the role=img element so assistive technology can reach it", () => {
        render(Subject, { props: { label: "T" }, slots: { default: svg, dataTable: table } });
        expect(screen.getByRole("table").closest("[role=img]")).toBeNull();
    });

    test("passes attrs (class, id, data-*) through onto the figure", () => {
        render(Subject, { props: { label: "T" }, attrs: { class: "mine", id: "c1", "data-testid": "chart" }, slots: { default: svg } });
        const el = screen.getByTestId("chart");
        expect(el.tagName).toBe("FIGURE");
        expect(el.id).toBe("c1");
        expect(el.getAttribute("class")).toBe("radar-chart mine");
    });
});
