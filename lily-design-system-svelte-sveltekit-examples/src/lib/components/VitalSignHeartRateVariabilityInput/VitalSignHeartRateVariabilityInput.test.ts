import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignHeartRateVariabilityInput from "./VitalSignHeartRateVariabilityInput.svelte";

describe("VitalSignHeartRateVariabilityInput", () => {
    test("renders with content", () => {
        render(VitalSignHeartRateVariabilityInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-heart-rate-variability-input");
    });
});
