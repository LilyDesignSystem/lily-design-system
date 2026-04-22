import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTable from "./GanttTable.svelte";

describe("GanttTable", () => {
    test("renders the component", () => {
        render(GanttTable, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
