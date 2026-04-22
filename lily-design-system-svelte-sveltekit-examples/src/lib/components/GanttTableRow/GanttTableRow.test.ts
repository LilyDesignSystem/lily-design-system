import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableRow from "./GanttTableRow.svelte";

describe("GanttTableRow", () => {
    test("renders the component", () => {
        render(GanttTableRow, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
