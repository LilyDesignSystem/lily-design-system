import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SingaporeNationalRegistrationIdentityCardInput";

describe("SingaporeNationalRegistrationIdentityCardInput", () => {
    test("renders a text input", () => {
        render(<Subject label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" />);

        const input = screen.getByLabelText("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" />);

        const input = screen.getByLabelText("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)");
        expect(input.getAttribute("class")).toContain("singapore-national-registration-identity-card-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" />);

        const input = screen.getByLabelText("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" />);

        const input = screen.getByLabelText("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" required />);

        const input = screen.getByLabelText("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" />);

        const input = screen.getByLabelText("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" disabled />);

        const input = screen.getByLabelText("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
