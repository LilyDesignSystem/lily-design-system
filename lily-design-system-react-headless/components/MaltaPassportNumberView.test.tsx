import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MaltaPassportNumberView";

describe("MaltaPassportNumberView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Malta Passport Number" value="test-value" />);

        const el = screen.getByLabelText("Malta Passport Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("malta-passport-number-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Malta Passport Number" value="test-value" />);

        const el = screen.getByLabelText("Malta Passport Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Malta Passport Number" />);

        const el = screen.getByLabelText("Malta Passport Number");
        expect(el.getAttribute("aria-label")).toBe("Malta Passport Number");
    });
});
