import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableTH from "./GanttTableTH.svelte";

describe("GanttTableTH", () => {
    test("renders the component", () => {
        render(GanttTableTH, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
