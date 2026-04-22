import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DataTableFoot from "./DataTableFoot.svelte";

describe("DataTableFoot", () => {
    test("renders the component", () => {
        render(DataTableFoot, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
