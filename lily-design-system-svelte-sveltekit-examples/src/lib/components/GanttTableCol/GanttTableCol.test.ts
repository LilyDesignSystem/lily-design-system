import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableCol from "./GanttTableCol.svelte";

describe("GanttTableCol", () => {
    test("renders the component", () => {
        render(GanttTableCol, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
