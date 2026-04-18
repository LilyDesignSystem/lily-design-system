import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignBloodPressureSystolicAsMmhgInput.svelte";

describe("VitalSignBloodPressureSystolicAsMmhgInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "Systolic blood pressure (mmHg)" } });
        expect((screen.getByLabelText("Systolic blood pressure (mmHg)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Systolic blood pressure (mmHg)" } });
        expect(screen.getByLabelText("Systolic blood pressure (mmHg)")).toBeTruthy();
    });

    test("has default min=0, max=300, step=1", () => {
        render(Subject, { props: { label: "Systolic" } });
        const input = screen.getByLabelText("Systolic") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("300");
        expect(input.step).toBe("1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Systolic", disabled: true } });
        expect((screen.getByLabelText("Systolic") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Systolic", required: true } });
        expect((screen.getByLabelText("Systolic") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Systolic", "data-testid": "bp" } });
        expect(screen.getByTestId("bp")).toBeTruthy();
    });
});
