import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PakistanComputerizedNationalIdentityCardView";

describe("PakistanComputerizedNationalIdentityCardView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Computerized National Identity Card Number (CNIC)"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("Computerized National Identity Card Number (CNIC)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "pakistan-computerized-national-identity-card-view",
        );
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Computerized National Identity Card Number (CNIC)"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("Computerized National Identity Card Number (CNIC)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Computerized National Identity Card Number (CNIC)" />);

        const el = screen.getByLabelText("Computerized National Identity Card Number (CNIC)");
        expect(el.getAttribute("aria-label")).toBe(
            "Computerized National Identity Card Number (CNIC)",
        );
    });
});
