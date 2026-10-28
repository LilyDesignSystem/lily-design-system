import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementSystemInput";

describe("MeasurementSystemInput", () => {
    test("renders a text input", () => {
        render(<Subject label="System" />);
        expect((screen.getByLabelText("System") as HTMLInputElement).type).toBe("text");
    });

    test("has accessible label", () => {
        render(<Subject label="Measurement system" />);
        expect(screen.getByLabelText("Measurement system")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="System"
                required
            />,
        );
        expect((screen.getByLabelText("System") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="System"
                disabled
            />,
        );
        expect((screen.getByLabelText("System") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="S"
                data-testid="msi"
            />,
        );
        expect(screen.getByTestId("msi")).toBeTruthy();
    });
});
