import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./LiechtensteinPassportNumberView";

describe("LiechtensteinPassportNumberView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Liechtenstein Passport Number" value="test-value" />);

        const el = screen.getByLabelText("Liechtenstein Passport Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("liechtenstein-passport-number-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Liechtenstein Passport Number" value="test-value" />);

        const el = screen.getByLabelText("Liechtenstein Passport Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Liechtenstein Passport Number" />);

        const el = screen.getByLabelText("Liechtenstein Passport Number");
        expect(el.getAttribute("aria-label")).toBe("Liechtenstein Passport Number");
    });
});
