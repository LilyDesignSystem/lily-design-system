import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignVo2MaxAsMlPerKgPerMinuteInput from "./VitalSignVo2MaxAsMlPerKgPerMinuteInput.svelte";

describe("VitalSignVo2MaxAsMlPerKgPerMinuteInput", () => {
    test("renders with content", () => {
        render(VitalSignVo2MaxAsMlPerKgPerMinuteInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-vo2-max-as-ml-per-kg-per-minute-input");
    });
});
