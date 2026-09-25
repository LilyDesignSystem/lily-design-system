import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BharatAadhaarView";

describe("BharatAadhaarView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Aadhaar (आधार)" value="test-value" />);

        const el = screen.getByLabelText("Aadhaar (आधार)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("bharat-aadhaar-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Aadhaar (आधार)" value="test-value" />);

        const el = screen.getByLabelText("Aadhaar (आधार)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Aadhaar (आधार)" />);

        const el = screen.getByLabelText("Aadhaar (आधार)");
        expect(el.getAttribute("aria-label")).toBe("Aadhaar (आधार)");
    });
});
