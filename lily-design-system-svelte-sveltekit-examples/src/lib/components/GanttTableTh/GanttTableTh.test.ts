import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableTh from "./GanttTableTh.svelte";

describe("GanttTableTh", () => {
    test("renders the component", () => {
        render(GanttTableTh, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
