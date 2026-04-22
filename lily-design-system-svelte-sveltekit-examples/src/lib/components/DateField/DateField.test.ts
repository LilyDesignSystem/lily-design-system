import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DateField from "./DateField.svelte";

describe("DateField", () => {
    test("renders the component", () => {
        render(DateField, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
