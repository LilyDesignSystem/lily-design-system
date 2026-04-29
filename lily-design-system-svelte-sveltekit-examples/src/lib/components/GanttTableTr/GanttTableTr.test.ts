import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableTr from "./GanttTableTr.svelte";

describe("GanttTableTr", () => {
    test("renders the component", () => {
        render(GanttTableTr, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
