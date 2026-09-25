import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./RossiyaSnilsInput";

describe("RossiyaSnilsInput", () => {
    test("renders a text input", () => {
        render(<Subject label="SNILS (СНИЛС)" />);

        const input = screen.getByLabelText("SNILS (СНИЛС)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="SNILS (СНИЛС)" />);

        const input = screen.getByLabelText("SNILS (СНИЛС)");
        expect(input.getAttribute("class")).toContain("rossiya-snils-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="SNILS (СНИЛС)" />);

        const input = screen.getByLabelText("SNILS (СНИЛС)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="SNILS (СНИЛС)" />);

        const input = screen.getByLabelText("SNILS (СНИЛС)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="SNILS (СНИЛС)" required />);

        const input = screen.getByLabelText("SNILS (СНИЛС)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="SNILS (СНИЛС)" />);

        const input = screen.getByLabelText("SNILS (СНИЛС)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="SNILS (СНИЛС)" disabled />);

        const input = screen.getByLabelText("SNILS (СНИЛС)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="SNILS (СНИЛС)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
