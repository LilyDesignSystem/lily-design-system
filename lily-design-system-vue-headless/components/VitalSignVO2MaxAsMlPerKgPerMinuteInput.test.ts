import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignVo2MaxAsMlPerKgPerMinuteInput.vue";

describe("VitalSignVo2MaxAsMlPerKgPerMinuteInput", () => {
    test("renders a number input", () => {
        render(Subject, { props: { label: "VO2 max" } });
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).type).toBe("number");
    });

    test("aria-label from label prop", () => {
        render(Subject, { props: { label: "VO2 max (ml/kg/min)" } });
        expect(screen.getByLabelText("VO2 max (ml/kg/min)")).toBeTruthy();
    });

    test("default min=0, max=100, step=1", () => {
        render(Subject, { props: { label: "VO2 max" } });
        const input = screen.getByLabelText("VO2 max") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("100");
        expect(input.step).toBe("1");
    });

    test("disabled propagates", () => {
        render(Subject, { props: { label: "VO2 max", disabled: true } });
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).disabled).toBe(true);
    });

    test("required propagates", () => {
        render(Subject, { props: { label: "VO2 max", required: true } });
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "VO2 max", "data-testid": "pr" } });
        expect(screen.getByTestId("pr")).toBeTruthy();
    });
});
