import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NorthernIrelandHealthAndCareNumberInput from "./NorthernIrelandHealthAndCareNumberInput.svelte";

describe("NorthernIrelandHealthAndCareNumberInput", () => {
    test("renders the component", () => {
        render(NorthernIrelandHealthAndCareNumberInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
