import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignSleepScoreAs0To100View from "./VitalSignSleepScoreAs0To100View.svelte";

describe("VitalSignSleepScoreAs0To100View", () => {
    test("renders with content", () => {
        render(VitalSignSleepScoreAs0To100View, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-sleep-score-as-0-to-100-view");
    });
});
