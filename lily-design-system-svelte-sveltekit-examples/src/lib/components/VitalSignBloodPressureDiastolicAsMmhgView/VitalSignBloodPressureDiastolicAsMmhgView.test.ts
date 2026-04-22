import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBloodPressureDiastolicAsMmhgView from "./VitalSignBloodPressureDiastolicAsMmhgView.svelte";

describe("VitalSignBloodPressureDiastolicAsMmhgView", () => {
    test("renders with content", () => {
        render(VitalSignBloodPressureDiastolicAsMmhgView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-blood-pressure-diastolic-as-mmhg-view");
    });
});
