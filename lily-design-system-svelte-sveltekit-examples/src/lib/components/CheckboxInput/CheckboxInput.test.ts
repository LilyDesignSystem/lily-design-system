import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CheckboxInput from "./CheckboxInput.svelte";

describe("CheckboxInput", () => {
    test("renders the component", () => {
        render(CheckboxInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
