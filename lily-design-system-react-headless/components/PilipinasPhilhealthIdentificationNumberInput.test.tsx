import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PilipinasPhilhealthIdentificationNumberInput";

describe("PilipinasPhilhealthIdentificationNumberInput", () => {
    test("renders a text input", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" />);

        const input = screen.getByLabelText("PhilHealth Identification Number (PIN)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" />);

        const input = screen.getByLabelText("PhilHealth Identification Number (PIN)");
        expect(input.getAttribute("class")).toContain("pilipinas-philhealth-identification-number-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" />);

        const input = screen.getByLabelText("PhilHealth Identification Number (PIN)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" />);

        const input = screen.getByLabelText("PhilHealth Identification Number (PIN)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" required />);

        const input = screen.getByLabelText("PhilHealth Identification Number (PIN)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" />);

        const input = screen.getByLabelText("PhilHealth Identification Number (PIN)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" disabled />);

        const input = screen.getByLabelText("PhilHealth Identification Number (PIN)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
