import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignTotalSleepTimeAsMinPerDayView from "./VitalSignTotalSleepTimeAsMinPerDayView.svelte";

describe("VitalSignTotalSleepTimeAsMinPerDayView", () => {
    test("renders with content", () => {
        render(VitalSignTotalSleepTimeAsMinPerDayView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-total-sleep-time-as-min-per-day-view");
    });
});
