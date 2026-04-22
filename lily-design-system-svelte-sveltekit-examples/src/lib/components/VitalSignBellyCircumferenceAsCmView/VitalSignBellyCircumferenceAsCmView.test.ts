import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBellyCircumferenceAsCmView from "./VitalSignBellyCircumferenceAsCmView.svelte";

describe("VitalSignBellyCircumferenceAsCmView", () => {
    test("renders the component", () => {
        render(VitalSignBellyCircumferenceAsCmView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
