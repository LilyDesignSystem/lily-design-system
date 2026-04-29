import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableTR from "./GanttTableTR.svelte";

describe("GanttTableTR", () => {
    test("renders the component", () => {
        render(GanttTableTR, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
