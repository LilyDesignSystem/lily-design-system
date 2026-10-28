import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MeasurementUnitInput";

describe("MeasurementUnitInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Unit" />);
        expect((screen.getByLabelText("Unit") as HTMLInputElement).type).toBe("text");
    });

    test("has accessible label", () => {
        render(<Subject label="Unit of measure" />);
        expect(screen.getByLabelText("Unit of measure")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="Unit"
                required
            />,
        );
        expect((screen.getByLabelText("Unit") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Unit"
                disabled
            />,
        );
        expect((screen.getByLabelText("Unit") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="U"
                data-testid="mui"
            />,
        );
        expect(screen.getByTestId("mui")).toBeTruthy();
    });
});
