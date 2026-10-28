import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TimeInput";

describe("TimeInput", () => {
    test("renders a time input", () => {
        render(<Subject label="Start time" />);
        const input = screen.getByLabelText("Start time") as HTMLInputElement;
        expect(input.type).toBe("time");
    });

    test("has aria-label", () => {
        render(<Subject label="Meeting time" />);
        expect(screen.getByLabelText("Meeting time")).toBeTruthy();
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
                label="Time"
                data-testid="ti"
            />,
        );
        expect(screen.getByTestId("ti")).toBeTruthy();
    });
});
