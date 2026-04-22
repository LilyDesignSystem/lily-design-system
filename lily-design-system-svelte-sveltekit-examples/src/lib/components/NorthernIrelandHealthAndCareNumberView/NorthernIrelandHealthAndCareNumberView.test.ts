import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NorthernIrelandHealthAndCareNumberView from "./NorthernIrelandHealthAndCareNumberView.svelte";

describe("NorthernIrelandHealthAndCareNumberView", () => {
    test("renders the component", () => {
        render(NorthernIrelandHealthAndCareNumberView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
