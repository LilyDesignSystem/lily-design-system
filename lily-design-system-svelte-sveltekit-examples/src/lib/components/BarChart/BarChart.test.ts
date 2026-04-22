import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BarChart from "./BarChart.svelte";

describe("BarChart", () => {
    test("renders the component", () => {
        render(BarChart, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
