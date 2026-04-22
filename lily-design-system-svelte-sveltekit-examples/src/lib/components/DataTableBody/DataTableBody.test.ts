import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DataTableBody from "./DataTableBody.svelte";

describe("DataTableBody", () => {
    test("renders the component", () => {
        render(DataTableBody, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
