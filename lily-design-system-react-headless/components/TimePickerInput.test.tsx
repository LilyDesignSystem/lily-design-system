import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./TimePickerInput";

describe("TimePickerInput", () => {
    test("renders a time input", () => {
        render(<Subject label="Time" />);
        expect((screen.getByLabelText("Time") as HTMLInputElement).type).toBe("time");
    });

    test("has aria-label", () => {
        render(<Subject label="Start time" />);
        expect(screen.getByLabelText("Start time")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="Time"
                required
            />,
        );
        expect((screen.getByLabelText("Time") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Time"
                disabled
            />,
        );
        expect((screen.getByLabelText("Time") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="T"
                data-testid="tp"
            />,
        );
        expect(screen.getByTestId("tp")).toBeTruthy();
    });
});
