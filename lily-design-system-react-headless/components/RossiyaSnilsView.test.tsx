import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./RossiyaSnilsView";

describe("RossiyaSnilsView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="SNILS (СНИЛС)" value="test-value" />);

        const el = screen.getByLabelText("SNILS (СНИЛС)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("rossiya-snils-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="SNILS (СНИЛС)" value="test-value" />);

        const el = screen.getByLabelText("SNILS (СНИЛС)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="SNILS (СНИЛС)" />);

        const el = screen.getByLabelText("SNILS (СНИЛС)");
        expect(el.getAttribute("aria-label")).toBe("SNILS (СНИЛС)");
    });
});
