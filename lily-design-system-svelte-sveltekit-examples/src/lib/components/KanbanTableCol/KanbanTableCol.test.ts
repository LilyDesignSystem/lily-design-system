import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import KanbanTableCol from "./KanbanTableCol.svelte";

describe("KanbanTableCol", () => {
    test("renders the component", () => {
        render(KanbanTableCol, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
