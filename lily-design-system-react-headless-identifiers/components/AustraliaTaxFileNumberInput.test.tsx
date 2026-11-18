import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AustraliaTaxFileNumberInput";

describe("AustraliaTaxFileNumberInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Tax File Number (TFN)" />);

        const input = screen.getByLabelText("Tax File Number (TFN)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Tax File Number (TFN)" />);

        const input = screen.getByLabelText("Tax File Number (TFN)");
        expect(input.getAttribute("class")).toContain("australia-tax-file-number-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Tax File Number (TFN)" />);

        const input = screen.getByLabelText("Tax File Number (TFN)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Tax File Number (TFN)" />);

        const input = screen.getByLabelText("Tax File Number (TFN)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(
            <Subject
                label="Tax File Number (TFN)"
                required
            />,
        );

        const input = screen.getByLabelText("Tax File Number (TFN)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Tax File Number (TFN)" />);

        const input = screen.getByLabelText("Tax File Number (TFN)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(
            <Subject
                label="Tax File Number (TFN)"
                disabled
            />,
        );

        const input = screen.getByLabelText("Tax File Number (TFN)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Tax File Number (TFN)"
                data-testid="subject"
            />,
        );

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
