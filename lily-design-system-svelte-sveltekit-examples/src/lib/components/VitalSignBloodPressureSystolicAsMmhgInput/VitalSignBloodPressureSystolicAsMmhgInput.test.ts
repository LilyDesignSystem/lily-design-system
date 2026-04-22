import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBloodPressureSystolicAsMmhgInput from "./VitalSignBloodPressureSystolicAsMmhgInput.svelte";

describe("VitalSignBloodPressureSystolicAsMmhgInput", () => {
    test("renders with content", () => {
        render(VitalSignBloodPressureSystolicAsMmhgInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-blood-pressure-systolic-as-mmhg-input");
    });
});
