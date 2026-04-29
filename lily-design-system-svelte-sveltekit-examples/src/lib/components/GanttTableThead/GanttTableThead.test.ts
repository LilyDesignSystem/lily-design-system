import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableThead from "./GanttTableThead.svelte";

describe("GanttTableThead", () => {
    test("renders the component", () => {
        render(GanttTableThead, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
