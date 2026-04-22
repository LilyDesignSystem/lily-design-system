import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignVo2MaxAsMlPerKgPerMinuteView from "./VitalSignVo2MaxAsMlPerKgPerMinuteView.svelte";

describe("VitalSignVo2MaxAsMlPerKgPerMinuteView", () => {
    test("renders with content", () => {
        render(VitalSignVo2MaxAsMlPerKgPerMinuteView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-vo2-max-as-ml-per-kg-per-minute-view");
    });
});
