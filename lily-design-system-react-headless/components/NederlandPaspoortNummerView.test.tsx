import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./NederlandPaspoortNummerView";

describe("NederlandPaspoortNummerView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Dutch Passport Number" value="test-value" />);

        const el = screen.getByLabelText("Dutch Passport Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nederland-paspoort-nummer-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Dutch Passport Number" value="test-value" />);

        const el = screen.getByLabelText("Dutch Passport Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Dutch Passport Number" />);

        const el = screen.getByLabelText("Dutch Passport Number");
        expect(el.getAttribute("aria-label")).toBe("Dutch Passport Number");
    });
});
