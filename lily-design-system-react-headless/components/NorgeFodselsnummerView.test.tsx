import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./NorgeFodselsnummerView";

describe("NorgeFodselsnummerView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Norwegian Birth Number" value="test-value" />);

        const el = screen.getByLabelText("Norwegian Birth Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("norge-fodselsnummer-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Norwegian Birth Number" value="test-value" />);

        const el = screen.getByLabelText("Norwegian Birth Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Norwegian Birth Number" />);

        const el = screen.getByLabelText("Norwegian Birth Number");
        expect(el.getAttribute("aria-label")).toBe("Norwegian Birth Number");
    });
});
