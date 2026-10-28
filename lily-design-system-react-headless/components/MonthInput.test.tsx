import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MonthInput";

describe("MonthInput", () => {
    test("renders a month input", () => {
        render(<Subject label="Month" />);
        expect((screen.getByLabelText("Month") as HTMLInputElement).type).toBe("month");
    });

    test("supports required", () => {
        render(
            <Subject
                label="Month"
                required
            />,
        );
        expect((screen.getByLabelText("Month") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Month"
                disabled
            />,
        );
        expect((screen.getByLabelText("Month") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="M"
                data-testid="mi"
            />,
        );
        expect(screen.getByTestId("mi")).toBeTruthy();
    });
});
