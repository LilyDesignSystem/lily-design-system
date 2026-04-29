import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import KanbanTableTD from "./KanbanTableTD.svelte";

describe("KanbanTableTD", () => {
    test("renders the component", () => {
        render(KanbanTableTD, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
