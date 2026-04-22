import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBellyCircumferenceAsCmInput from "./VitalSignBellyCircumferenceAsCmInput.svelte";

describe("VitalSignBellyCircumferenceAsCmInput", () => {
    test("renders with content", () => {
        render(VitalSignBellyCircumferenceAsCmInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-belly-circumference-as-cm-input
vital-sign-belly-circumference-as-cm-input");
    });
});
