import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ScatterChart from "./ScatterChart.svelte";

describe("ScatterChart", () => {
    test("renders the component", () => {
        render(ScatterChart, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.classList.contains("scatter-chart")).toBe(true);
    });
});
