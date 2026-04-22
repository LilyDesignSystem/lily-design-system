import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignTotalSleepTimeAsMinPerDayInput from "./VitalSignTotalSleepTimeAsMinPerDayInput.svelte";

describe("VitalSignTotalSleepTimeAsMinPerDayInput", () => {
    test("renders with content", () => {
        render(VitalSignTotalSleepTimeAsMinPerDayInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-total-sleep-time-as-min-per-day-input");
    });
});
