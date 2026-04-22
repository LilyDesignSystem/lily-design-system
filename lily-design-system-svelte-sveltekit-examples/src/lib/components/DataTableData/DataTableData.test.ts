import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DataTableData from "./DataTableData.svelte";

describe("DataTableData", () => {
    test("renders the component", () => {
        render(DataTableData, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
