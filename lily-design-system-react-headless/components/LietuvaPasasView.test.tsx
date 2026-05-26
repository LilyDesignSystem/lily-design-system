import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./LietuvaPasasView";

describe("LietuvaPasasView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Lithuanian Passport" value="test-value" />);

        const el = screen.getByLabelText("Lithuanian Passport");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("lietuva-pasas-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Lithuanian Passport" value="test-value" />);

        const el = screen.getByLabelText("Lithuanian Passport");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Lithuanian Passport" />);

        const el = screen.getByLabelText("Lithuanian Passport");
        expect(el.getAttribute("aria-label")).toBe("Lithuanian Passport");
    });
});
