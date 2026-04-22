import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableData from "./GanttTableData.svelte";

describe("GanttTableData", () => {
    test("renders the component", () => {
        render(GanttTableData, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
