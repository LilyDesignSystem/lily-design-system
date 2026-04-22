import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignWeightAsKgInput.svelte";

describe("VitalSignWeightAsKgInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "Weight (kg)" } });
        expect((screen.getByLabelText("Weight (kg)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Weight (kg)" } });
        expect(screen.getByLabelText("Weight (kg)")).toBeTruthy();
    });

    test("has default min=0, max=500, step=1", () => {
        render(Subject, { props: { label: "Weight" } });
        const input = screen.getByLabelText("Weight") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("500");
        expect(input.step).toBe("1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Weight", disabled: true } });
        expect((screen.getByLabelText("Weight") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Weight", required: true } });
        expect((screen.getByLabelText("Weight") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Weight", "data-testid": "pr" } });
        expect(screen.getByTestId("pr")).toBeTruthy();
    });
});
