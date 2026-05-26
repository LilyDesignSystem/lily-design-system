import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MaltaNationalIdentificationNumberInput";

describe("MaltaNationalIdentificationNumberInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Malta National Identification Number" />);

        const input = screen.getByLabelText("Malta National Identification Number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Malta National Identification Number" />);

        const input = screen.getByLabelText("Malta National Identification Number");
        expect(input.getAttribute("class")).toContain("malta-national-identification-number-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Malta National Identification Number" />);

        const input = screen.getByLabelText("Malta National Identification Number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Malta National Identification Number" />);

        const input = screen.getByLabelText("Malta National Identification Number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Malta National Identification Number" required />);

        const input = screen.getByLabelText("Malta National Identification Number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Malta National Identification Number" />);

        const input = screen.getByLabelText("Malta National Identification Number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Malta National Identification Number" disabled />);

        const input = screen.getByLabelText("Malta National Identification Number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Malta National Identification Number" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
