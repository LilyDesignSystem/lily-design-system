import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DataTableCol from "./DataTableCol.svelte";

describe("DataTableCol", () => {
    test("renders the component", () => {
        render(DataTableCol, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
