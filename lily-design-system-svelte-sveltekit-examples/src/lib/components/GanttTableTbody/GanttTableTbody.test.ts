import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableBody from "./GanttTableBody.svelte";

describe("GanttTableTbody", () => {
    test("renders the component", () => {
        render(GanttTableBody, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
