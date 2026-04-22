import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DataFilterForm from "./DataFilterForm.svelte";

describe("DataFilterForm", () => {
    test("renders the component", () => {
        render(DataFilterForm, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
