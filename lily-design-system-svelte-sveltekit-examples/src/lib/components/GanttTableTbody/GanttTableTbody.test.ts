import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import GanttTableTbody from "./GanttTableTbody.svelte";

describe("GanttTableTbody", () => {
    test("renders the component", () => {
        render(GanttTableTbody, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
