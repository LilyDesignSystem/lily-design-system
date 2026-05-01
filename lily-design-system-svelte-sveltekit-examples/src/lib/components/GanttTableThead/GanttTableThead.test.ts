import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableHead from "./GanttTableHead.svelte";

describe("GanttTableThead", () => {
    test("renders the component", () => {
        render(GanttTableHead, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
