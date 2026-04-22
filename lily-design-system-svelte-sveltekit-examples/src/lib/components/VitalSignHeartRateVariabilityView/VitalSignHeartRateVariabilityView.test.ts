import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignHeartRateVariabilityView from "./VitalSignHeartRateVariabilityView.svelte";

describe("VitalSignHeartRateVariabilityView", () => {
    test("renders with content", () => {
        render(VitalSignHeartRateVariabilityView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-heart-rate-variability-view");
    });
});
