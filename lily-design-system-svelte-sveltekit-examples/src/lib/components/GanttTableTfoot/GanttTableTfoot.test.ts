import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableTfoot from "./GanttTableTfoot.svelte";

describe("GanttTableTfoot", () => {
    test("renders the component", () => {
        render(GanttTableTfoot, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
