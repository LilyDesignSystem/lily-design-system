import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Table from "./Table.svelte";

describe("Table", () => {
    test("renders the component", () => {
        render(Table, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
