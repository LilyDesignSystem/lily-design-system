import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ColorPicker from "./ColorPicker.svelte";

describe("ColorPicker", () => {
    test("renders the component", () => {
        render(ColorPicker, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
