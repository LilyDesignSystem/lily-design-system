import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PakistanComputerizedNationalIdentityCardInput";

describe("PakistanComputerizedNationalIdentityCardInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Computerized National Identity Card Number (CNIC)" />);

        const input = screen.getByLabelText(
            "Computerized National Identity Card Number (CNIC)",
        ) as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Computerized National Identity Card Number (CNIC)" />);

        const input = screen.getByLabelText("Computerized National Identity Card Number (CNIC)");
        expect(input.getAttribute("class")).toContain(
            "pakistan-computerized-national-identity-card-input",
        );
    });

    test("has autocomplete off", () => {
        render(<Subject label="Computerized National Identity Card Number (CNIC)" />);

        const input = screen.getByLabelText("Computerized National Identity Card Number (CNIC)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Computerized National Identity Card Number (CNIC)" />);

        const input = screen.getByLabelText(
            "Computerized National Identity Card Number (CNIC)",
        ) as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(
            <Subject
                label="Computerized National Identity Card Number (CNIC)"
                required
            />,
        );

        const input = screen.getByLabelText(
            "Computerized National Identity Card Number (CNIC)",
        ) as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Computerized National Identity Card Number (CNIC)" />);

        const input = screen.getByLabelText(
            "Computerized National Identity Card Number (CNIC)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(
            <Subject
                label="Computerized National Identity Card Number (CNIC)"
                disabled
            />,
        );

        const input = screen.getByLabelText(
            "Computerized National Identity Card Number (CNIC)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Computerized National Identity Card Number (CNIC)"
                data-testid="subject"
            />,
        );

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
