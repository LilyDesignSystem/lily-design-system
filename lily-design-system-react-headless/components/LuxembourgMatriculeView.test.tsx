import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./LuxembourgMatriculeView";

describe("LuxembourgMatriculeView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Matricule National" value="test-value" />);

        const el = screen.getByLabelText("Matricule National");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("luxembourg-matricule-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Matricule National" value="test-value" />);

        const el = screen.getByLabelText("Matricule National");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Matricule National" />);

        const el = screen.getByLabelText("Matricule National");
        expect(el.getAttribute("aria-label")).toBe("Matricule National");
    });
});
