import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignHeartRateAsBeatsPerMinuteInput from "./VitalSignHeartRateAsBeatsPerMinuteInput.svelte";

describe("VitalSignHeartRateAsBeatsPerMinuteInput", () => {
    test("renders with content", () => {
        render(VitalSignHeartRateAsBeatsPerMinuteInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-heart-rate-as-beats-per-minute-input");
    });
});
