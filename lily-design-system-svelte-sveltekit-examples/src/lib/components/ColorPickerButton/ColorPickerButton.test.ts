import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ColorPickerButton from "./ColorPickerButton.svelte";

describe("ColorPickerButton", () => {
    test("renders the component", () => {
        render(ColorPickerButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
