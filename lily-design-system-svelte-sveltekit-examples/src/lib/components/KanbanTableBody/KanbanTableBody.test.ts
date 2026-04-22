import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import KanbanTableBody from "./KanbanTableBody.svelte";

describe("KanbanTableBody", () => {
    test("renders the component", () => {
        render(KanbanTableBody, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
