import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./EnglandNationalHealthServiceNumberView";

describe("EnglandNationalHealthServiceNumberView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="National Health Service Number" value="test-value" />);

        const el = screen.getByLabelText("National Health Service Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("england-national-health-service-number-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="National Health Service Number" value="test-value" />);

        const el = screen.getByLabelText("National Health Service Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National Health Service Number" />);

        const el = screen.getByLabelText("National Health Service Number");
        expect(el.getAttribute("aria-label")).toBe("National Health Service Number");
    });
});
