import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DataTable from "./DataTable.svelte";

describe("DataTable", () => {
    test("renders the component", () => {
        render(DataTable, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
