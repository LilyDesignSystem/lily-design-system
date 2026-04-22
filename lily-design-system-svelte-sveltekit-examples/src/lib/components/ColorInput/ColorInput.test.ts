import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ColorInput from "./ColorInput.svelte";

describe("ColorInput", () => {
    test("renders the component", () => {
        render(ColorInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
