import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignSleepScoreAs0To100Input from "./VitalSignSleepScoreAs0To100Input.svelte";

describe("VitalSignSleepScoreAs0To100Input", () => {
    test("renders with content", () => {
        render(VitalSignSleepScoreAs0To100Input, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-sleep-score-as-0-to-100-input");
    });
});
