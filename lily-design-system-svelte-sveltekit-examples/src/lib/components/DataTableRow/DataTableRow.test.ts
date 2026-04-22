import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DataTableRow from "./DataTableRow.svelte";

describe("DataTableRow", () => {
    test("renders the component", () => {
        render(DataTableRow, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
