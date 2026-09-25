import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CanadaSocialInsuranceNumberInput";

describe("CanadaSocialInsuranceNumberInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Social Insurance Number (SIN)" />);

        const input = screen.getByLabelText("Social Insurance Number (SIN)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Social Insurance Number (SIN)" />);

        const input = screen.getByLabelText("Social Insurance Number (SIN)");
        expect(input.getAttribute("class")).toContain("canada-social-insurance-number-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Social Insurance Number (SIN)" />);

        const input = screen.getByLabelText("Social Insurance Number (SIN)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Social Insurance Number (SIN)" />);

        const input = screen.getByLabelText("Social Insurance Number (SIN)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Social Insurance Number (SIN)" required />);

        const input = screen.getByLabelText("Social Insurance Number (SIN)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Social Insurance Number (SIN)" />);

        const input = screen.getByLabelText("Social Insurance Number (SIN)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Social Insurance Number (SIN)" disabled />);

        const input = screen.getByLabelText("Social Insurance Number (SIN)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Social Insurance Number (SIN)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
