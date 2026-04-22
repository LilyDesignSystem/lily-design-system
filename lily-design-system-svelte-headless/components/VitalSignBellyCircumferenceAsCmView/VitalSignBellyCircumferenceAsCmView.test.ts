import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBellyCircumferenceAsCmView from "./VitalSignBellyCircumferenceAsCmView.svelte";

describe("VitalSignBellyCircumferenceAsCmView", () => {
    test("renders with content", () => {
        render(VitalSignBellyCircumferenceAsCmView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-belly-circumference-as-cm-view
vital-sign-belly-circumference-as-cm-view");
    });
});
