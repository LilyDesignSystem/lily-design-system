import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./NederlandBurgerserviceNummerView";

describe("NederlandBurgerserviceNummerView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Citizen Service Number" value="test-value" />);

        const el = screen.getByLabelText("Citizen Service Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nederland-burgerservice-nummer-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Citizen Service Number" value="test-value" />);

        const el = screen.getByLabelText("Citizen Service Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Citizen Service Number" />);

        const el = screen.getByLabelText("Citizen Service Number");
        expect(el.getAttribute("aria-label")).toBe("Citizen Service Number");
    });
});
