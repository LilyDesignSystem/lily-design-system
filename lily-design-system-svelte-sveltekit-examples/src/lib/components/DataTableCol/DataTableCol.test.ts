import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DataTableTD from "./DataTableTD.svelte";

describe("DataTableTD", () => {
    test("renders the component", () => {
        render(DataTableTD, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
