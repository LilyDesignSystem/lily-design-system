import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignVO2MaxAsMlPerKgPerMinuteInput.svelte";

describe("VitalSignVO2MaxAsMlPerKgPerMinuteInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "VO2 max (ml/kg/min)" } });
        expect((screen.getByLabelText("VO2 max (ml/kg/min)") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "VO2 max (ml/kg/min)" } });
        expect(screen.getByLabelText("VO2 max (ml/kg/min)")).toBeTruthy();
    });

    test("has default min=0, max=100, step=1", () => {
        render(Subject, { props: { label: "VO2 max" } });
        const input = screen.getByLabelText("VO2 max") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("100");
        expect(input.step).toBe("1");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "VO2 max", disabled: true } });
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(Subject, { props: { label: "VO2 max", required: true } });
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "VO2 max", "data-testid": "pr" } });
        expect(screen.getByTestId("pr")).toBeTruthy();
    });
});
