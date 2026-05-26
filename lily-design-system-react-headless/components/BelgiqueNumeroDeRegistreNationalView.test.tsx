import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BelgiqueNumeroDeRegistreNationalView";

describe("BelgiqueNumeroDeRegistreNationalView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="National Register Number" value="test-value" />);

        const el = screen.getByLabelText("National Register Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("belgique-numero-de-registre-national-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="National Register Number" value="test-value" />);

        const el = screen.getByLabelText("National Register Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National Register Number" />);

        const el = screen.getByLabelText("National Register Number");
        expect(el.getAttribute("aria-label")).toBe("National Register Number");
    });
});
