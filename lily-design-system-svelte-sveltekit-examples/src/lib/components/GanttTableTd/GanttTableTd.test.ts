import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableTD from "./GanttTableTD.svelte";

describe("GanttTableTd", () => {
    test("renders the component", () => {
        render(GanttTableTD, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
