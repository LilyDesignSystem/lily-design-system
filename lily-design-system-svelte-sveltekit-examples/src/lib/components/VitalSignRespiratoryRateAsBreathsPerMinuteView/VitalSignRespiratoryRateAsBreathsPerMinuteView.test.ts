import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignRespiratoryRateAsBreathsPerMinuteView from "./VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte";

describe("VitalSignRespiratoryRateAsBreathsPerMinuteView", () => {
    test("renders with content", () => {
        render(VitalSignRespiratoryRateAsBreathsPerMinuteView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-respiratory-rate-as-breaths-per-minute-view");
    });
});
