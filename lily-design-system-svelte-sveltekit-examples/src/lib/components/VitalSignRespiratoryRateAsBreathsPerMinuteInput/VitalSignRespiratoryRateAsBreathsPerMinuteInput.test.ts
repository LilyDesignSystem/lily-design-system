import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignRespiratoryRateAsBreathsPerMinuteInput from "./VitalSignRespiratoryRateAsBreathsPerMinuteInput.svelte";

describe("VitalSignRespiratoryRateAsBreathsPerMinuteInput", () => {
    test("renders with content", () => {
        render(VitalSignRespiratoryRateAsBreathsPerMinuteInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-respiratory-rate-as-breaths-per-minute-input");
    });
});
