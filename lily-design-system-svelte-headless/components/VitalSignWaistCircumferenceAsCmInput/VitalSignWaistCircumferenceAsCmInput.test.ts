import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignWaistCircumferenceAsCmInput.svelte";

describe("VitalSignWaistCircumferenceAsCmInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "Waist circumference (cm)" } });
        expect((screen.getByLabelText("Waist circumference (cm)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Waist circumference (cm)" } });
        expect(screen.getByLabelText("Waist circumference (cm)")).toBeTruthy();
    });

    test("has default min=0, max=300, step=1", () => {
        render(Subject, { props: { label: "Waist circumference" } });
        const input = screen.getByLabelText("Waist circumference") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("300");
        expect(input.step).toBe("1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Waist circumference", disabled: true } });
        expect((screen.getByLabelText("Waist circumference") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Waist circumference", required: true } });
        expect((screen.getByLabelText("Waist circumference") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Waist circumference", "data-testid": "pr" } });
        expect(screen.getByTestId("pr")).toBeTruthy();
    });
});
