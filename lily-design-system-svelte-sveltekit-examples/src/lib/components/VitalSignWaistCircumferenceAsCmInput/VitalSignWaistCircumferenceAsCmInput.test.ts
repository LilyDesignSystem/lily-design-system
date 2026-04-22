import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignWaistCircumferenceAsCmInput from "./VitalSignWaistCircumferenceAsCmInput.svelte";

describe("VitalSignWaistCircumferenceAsCmInput", () => {
    test("renders with content", () => {
        render(VitalSignWaistCircumferenceAsCmInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-waist-circumference-as-cm-input");
    });
});
