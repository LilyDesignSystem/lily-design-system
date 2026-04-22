import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import KanbanTable from "./KanbanTable.svelte";

describe("KanbanTable", () => {
    test("renders the component", () => {
        render(KanbanTable, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
