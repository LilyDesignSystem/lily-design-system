import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./LiechtensteinNationalIdentityCardNumberInput";

describe("LiechtensteinNationalIdentityCardNumberInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Liechtenstein National Identity Card Number" />);

        const input = screen.getByLabelText("Liechtenstein National Identity Card Number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Liechtenstein National Identity Card Number" />);

        const input = screen.getByLabelText("Liechtenstein National Identity Card Number");
        expect(input.getAttribute("class")).toContain("liechtenstein-national-identity-card-number-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Liechtenstein National Identity Card Number" />);

        const input = screen.getByLabelText("Liechtenstein National Identity Card Number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Liechtenstein National Identity Card Number" />);

        const input = screen.getByLabelText("Liechtenstein National Identity Card Number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Liechtenstein National Identity Card Number" required />);

        const input = screen.getByLabelText("Liechtenstein National Identity Card Number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Liechtenstein National Identity Card Number" />);

        const input = screen.getByLabelText("Liechtenstein National Identity Card Number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Liechtenstein National Identity Card Number" disabled />);

        const input = screen.getByLabelText("Liechtenstein National Identity Card Number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Liechtenstein National Identity Card Number" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
