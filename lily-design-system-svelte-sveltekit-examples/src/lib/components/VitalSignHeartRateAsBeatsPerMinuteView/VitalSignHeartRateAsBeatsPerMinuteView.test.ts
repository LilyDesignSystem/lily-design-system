import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignHeartRateAsBeatsPerMinuteView from "./VitalSignHeartRateAsBeatsPerMinuteView.svelte";

describe("VitalSignHeartRateAsBeatsPerMinuteView", () => {
    test("renders with content", () => {
        render(VitalSignHeartRateAsBeatsPerMinuteView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-heart-rate-as-beats-per-minute-view");
    });
});
