import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import KanbanTableHead from "./KanbanTableHead.svelte";

describe("KanbanTableHead", () => {
    test("renders the component", () => {
        render(KanbanTableHead, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
