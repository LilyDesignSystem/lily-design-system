import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AustraliaTaxFileNumberView";

describe("AustraliaTaxFileNumberView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Tax File Number (TFN)"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("Tax File Number (TFN)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("australia-tax-file-number-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Tax File Number (TFN)"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("Tax File Number (TFN)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Tax File Number (TFN)" />);

        const el = screen.getByLabelText("Tax File Number (TFN)");
        expect(el.getAttribute("aria-label")).toBe("Tax File Number (TFN)");
    });
});
