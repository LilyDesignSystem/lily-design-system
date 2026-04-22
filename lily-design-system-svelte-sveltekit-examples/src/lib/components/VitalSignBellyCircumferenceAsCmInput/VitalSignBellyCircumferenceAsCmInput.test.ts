import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBellyCircumferenceAsCmInput from "./VitalSignBellyCircumferenceAsCmInput.svelte";

describe("VitalSignBellyCircumferenceAsCmInput", () => {
    test("renders the component", () => {
        render(VitalSignBellyCircumferenceAsCmInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
