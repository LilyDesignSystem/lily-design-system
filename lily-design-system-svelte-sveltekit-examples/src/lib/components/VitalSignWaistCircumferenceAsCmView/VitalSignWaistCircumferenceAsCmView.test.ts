import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignWaistCircumferenceAsCmView from "./VitalSignWaistCircumferenceAsCmView.svelte";

describe("VitalSignWaistCircumferenceAsCmView", () => {
    test("renders with content", () => {
        render(VitalSignWaistCircumferenceAsCmView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-waist-circumference-as-cm-view");
    });
});
