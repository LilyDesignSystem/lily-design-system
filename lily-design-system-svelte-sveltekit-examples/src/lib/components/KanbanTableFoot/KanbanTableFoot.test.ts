import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import KanbanTableFoot from "./KanbanTableFoot.svelte";

describe("KanbanTableFoot", () => {
    test("renders the component", () => {
        render(KanbanTableFoot, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
