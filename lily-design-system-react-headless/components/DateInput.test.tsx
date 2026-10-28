import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./DateInput";

describe("DateInput", () => {
    test("renders a date input", () => {
        render(<Subject label="Date" />);
        const input = screen.getByLabelText("Date") as HTMLInputElement;
        expect(input).toBeTruthy();
        expect(input.type).toBe("date");
    });

    test("has aria-label", () => {
        render(<Subject label="Pick a date" />);
        expect(screen.getByLabelText("Pick a date")).toBeTruthy();
    });

    test("supports min attribute", () => {
        render(
            <Subject
                label="Date"
                min="2024-01-01"
            />,
        );
        expect((screen.getByLabelText("Date") as HTMLInputElement).min).toBe("2024-01-01");
    });

    test("supports max attribute", () => {
        render(
            <Subject
                label="Date"
                max="2024-12-31"
            />,
        );
        expect((screen.getByLabelText("Date") as HTMLInputElement).max).toBe("2024-12-31");
    });

    test("supports required attribute", () => {
        render(
            <Subject
                label="Date"
                required
            />,
        );
        expect((screen.getByLabelText("Date") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled attribute", () => {
        render(
            <Subject
                label="Date"
                disabled
            />,
        );
        expect((screen.getByLabelText("Date") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Date"
                data-testid="di"
            />,
        );
        expect(screen.getByTestId("di")).toBeTruthy();
    });
});
