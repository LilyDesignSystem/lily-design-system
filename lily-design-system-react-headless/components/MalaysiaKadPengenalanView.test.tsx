import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MalaysiaKadPengenalanView";

describe("MalaysiaKadPengenalanView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="MyKad Number (NRIC)"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("MyKad Number (NRIC)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("malaysia-kad-pengenalan-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="MyKad Number (NRIC)"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("MyKad Number (NRIC)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="MyKad Number (NRIC)" />);

        const el = screen.getByLabelText("MyKad Number (NRIC)");
        expect(el.getAttribute("aria-label")).toBe("MyKad Number (NRIC)");
    });
});
