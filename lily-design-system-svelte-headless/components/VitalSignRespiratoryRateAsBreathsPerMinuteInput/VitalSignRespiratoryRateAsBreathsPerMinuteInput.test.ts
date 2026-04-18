import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignRespiratoryRateAsBreathsPerMinuteInput.svelte";

describe("VitalSignRespiratoryRateAsBreathsPerMinuteInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "Respiratory rate (breaths/min)" } });
        expect((screen.getByLabelText("Respiratory rate (breaths/min)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Respiratory rate (breaths/min)" } });
        expect(screen.getByLabelText("Respiratory rate (breaths/min)")).toBeTruthy();
    });

    test("has default min=0, max=100, step=1", () => {
        render(Subject, { props: { label: "RR" } });
        const input = screen.getByLabelText("RR") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("100");
        expect(input.step).toBe("1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "RR", disabled: true } });
        expect((screen.getByLabelText("RR") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "RR", required: true } });
        expect((screen.getByLabelText("RR") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "RR", "data-testid": "rr" } });
        expect(screen.getByTestId("rr")).toBeTruthy();
    });
});
