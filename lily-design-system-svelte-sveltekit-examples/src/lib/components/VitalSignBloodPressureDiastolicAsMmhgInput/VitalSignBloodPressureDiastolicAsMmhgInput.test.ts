import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignBloodPressureDiastolicAsMmhgInput from "./VitalSignBloodPressureDiastolicAsMmhgInput.svelte";

describe("VitalSignBloodPressureDiastolicAsMmhgInput", () => {
    test("renders with content", () => {
        render(VitalSignBloodPressureDiastolicAsMmhgInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-blood-pressure-diastolic-as-mmhg-input");
    });
});
