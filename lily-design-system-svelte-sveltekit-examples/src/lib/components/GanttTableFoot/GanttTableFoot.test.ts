import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableFoot from "./GanttTableFoot.svelte";

describe("GanttTableFoot", () => {
    test("renders the component", () => {
        render(GanttTableFoot, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
