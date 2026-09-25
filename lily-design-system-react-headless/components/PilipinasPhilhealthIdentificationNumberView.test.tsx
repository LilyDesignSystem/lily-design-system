import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PilipinasPhilhealthIdentificationNumberView";

describe("PilipinasPhilhealthIdentificationNumberView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" value="test-value" />);

        const el = screen.getByLabelText("PhilHealth Identification Number (PIN)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("pilipinas-philhealth-identification-number-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" value="test-value" />);

        const el = screen.getByLabelText("PhilHealth Identification Number (PIN)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="PhilHealth Identification Number (PIN)" />);

        const el = screen.getByLabelText("PhilHealth Identification Number (PIN)");
        expect(el.getAttribute("aria-label")).toBe("PhilHealth Identification Number (PIN)");
    });
});
