import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableTd from "./GanttTableTd.svelte";

describe("GanttTableTd", () => {
    test("renders the component", () => {
        render(GanttTableTd, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
