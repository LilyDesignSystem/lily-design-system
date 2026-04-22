import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import KanbanTableData from "./KanbanTableData.svelte";

describe("KanbanTableData", () => {
    test("renders the component", () => {
        render(KanbanTableData, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
