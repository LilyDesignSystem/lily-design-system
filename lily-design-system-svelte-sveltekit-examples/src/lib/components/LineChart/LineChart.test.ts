import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import LineChart from "./LineChart.svelte";

describe("LineChart", () => {
    test("renders the component", () => {
        render(LineChart, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
