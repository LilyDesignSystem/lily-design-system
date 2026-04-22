import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import KanbanTableRow from "./KanbanTableRow.svelte";

describe("KanbanTableRow", () => {
    test("renders the component", () => {
        render(KanbanTableRow, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
