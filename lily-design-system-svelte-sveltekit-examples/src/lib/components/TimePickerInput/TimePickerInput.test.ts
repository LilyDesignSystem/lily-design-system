import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TimePickerInput from "./TimePickerInput.svelte";

describe("TimePickerInput", () => {
    test("renders the component", () => {
        render(TimePickerInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
