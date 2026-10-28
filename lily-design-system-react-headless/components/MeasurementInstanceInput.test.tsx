import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementInstanceInput";

describe("MeasurementInstanceInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Weight" />);
        expect((screen.getByLabelText("Weight") as HTMLInputElement).type).toBe("text");
    });

    test("has accessible label", () => {
        render(<Subject label="Temperature" />);
        expect(screen.getByLabelText("Temperature")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="Weight"
                required
            />,
        );
        expect((screen.getByLabelText("Weight") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Weight"
                disabled
            />,
        );
        expect((screen.getByLabelText("Weight") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="W"
                data-testid="mii"
            />,
        );
        expect(screen.getByTestId("mii")).toBeTruthy();
    });
});
