import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ItaliaCodiceFiscaleView";

describe("ItaliaCodiceFiscaleView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Italian Fiscal Code" value="test-value" />);

        const el = screen.getByLabelText("Italian Fiscal Code");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("italia-codice-fiscale-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Italian Fiscal Code" value="test-value" />);

        const el = screen.getByLabelText("Italian Fiscal Code");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Italian Fiscal Code" />);

        const el = screen.getByLabelText("Italian Fiscal Code");
        expect(el.getAttribute("aria-label")).toBe("Italian Fiscal Code");
    });
});
