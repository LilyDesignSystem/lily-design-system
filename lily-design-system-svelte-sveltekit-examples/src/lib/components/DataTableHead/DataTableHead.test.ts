import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DataTableHead from "./DataTableHead.svelte";

describe("DataTableHead", () => {
    test("renders the component", () => {
        render(DataTableHead, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
