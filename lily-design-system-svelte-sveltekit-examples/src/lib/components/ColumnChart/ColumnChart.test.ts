import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ColumnChart from "./ColumnChart.svelte";

describe("ColumnChart", () => {
    test("renders the component", () => {
        render(ColumnChart, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
