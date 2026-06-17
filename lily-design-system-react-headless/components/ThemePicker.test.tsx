import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ThemeSelect";

describe("ThemeSelect", () => {
    test("renders a radiogroup", () => {
        render(<Subject label="Theme">options</Subject>);
        expect(screen.getByRole("radiogroup")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Choose theme">options</Subject>);
        expect(screen.getByLabelText("Choose theme")).toBeTruthy();
    });

    test("uses fieldset element", () => {
        render(<Subject label="Theme">options</Subject>);
        expect(screen.getByRole("radiogroup").tagName).toBe("FIELDSET");
    });

    test("passes through attributes", () => {
        render(<Subject label="T" data-testid="tp">x</Subject>);
        expect(screen.getByTestId("tp")).toBeTruthy();
    });
});
