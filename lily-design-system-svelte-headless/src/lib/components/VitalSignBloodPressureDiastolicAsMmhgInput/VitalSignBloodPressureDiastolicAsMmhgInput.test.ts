import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignBloodPressureDiastolicAsMmhgInput.svelte";

describe("VitalSignBloodPressureDiastolicAsMmhgInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "Diastolic blood pressure (mmHg)" } });
        expect((screen.getByLabelText("Diastolic blood pressure (mmHg)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Diastolic blood pressure (mmHg)" } });
        expect(screen.getByLabelText("Diastolic blood pressure (mmHg)")).toBeTruthy();
    });

    test("has default min=0, max=200, step=1", () => {
        render(Subject, { props: { label: "Diastolic" } });
        const input = screen.getByLabelText("Diastolic") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("200");
        expect(input.step).toBe("1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Diastolic", disabled: true } });
        expect((screen.getByLabelText("Diastolic") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Diastolic", required: true } });
        expect((screen.getByLabelText("Diastolic") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Diastolic", "data-testid": "bp" } });
        expect(screen.getByTestId("bp")).toBeTruthy();
    });
});
