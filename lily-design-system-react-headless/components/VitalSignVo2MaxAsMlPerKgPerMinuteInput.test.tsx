import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./VitalSignVo2MaxAsMlPerKgPerMinuteInput";

describe("VitalSignVo2MaxAsMlPerKgPerMinuteInput", () => {
    test("renders input with type number", () => {
        render(<Subject label="VO2 max" />);
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).type).toBe("number");
    });

    test("has aria-label from label prop", () => {
        render(<Subject label="VO2 max" />);
        expect(screen.getByLabelText("VO2 max")).toBeTruthy();
    });

    test("has default min=0", () => {
        render(<Subject label="VO2 max" />);
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).min).toBe("0");
    });

    test("has default max=100", () => {
        render(<Subject label="VO2 max" />);
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).max).toBe("100");
    });

    test("has default step=1", () => {
        render(<Subject label="VO2 max" />);
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).step).toBe("1");
    });

    test("supports disabled", () => {
        render(<Subject label="VO2 max" disabled />);
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(<Subject label="VO2 max" required />);
        expect((screen.getByLabelText("VO2 max") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(<Subject label="VO2 max" data-testid="pr" />);
        expect(screen.getByTestId("pr")).toBeTruthy();
    });
});
