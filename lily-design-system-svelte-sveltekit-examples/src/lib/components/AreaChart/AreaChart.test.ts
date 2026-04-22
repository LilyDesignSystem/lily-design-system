import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AreaChart from "./AreaChart.svelte";

describe("AreaChart", () => {
    test("renders the component", () => {
        render(AreaChart, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
