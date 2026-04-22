import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBloodPressureSystolicAsMmhgView from "./VitalSignBloodPressureSystolicAsMmhgView.svelte";

describe("VitalSignBloodPressureSystolicAsMmhgView", () => {
    test("renders with content", () => {
        render(VitalSignBloodPressureSystolicAsMmhgView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-blood-pressure-systolic-as-mmhg-view");
    });
});
