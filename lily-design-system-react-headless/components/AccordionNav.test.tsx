import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AccordionNav";

describe("AccordionNav", () => {
    test("renders a nav element", () => {
        render(<Subject label="FAQ">content</Subject>);
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="FAQ">content</Subject>);
        expect(screen.getByLabelText("FAQ")).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject label="FAQ">Question</Subject>);
        expect(screen.getByText("Question")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="F"
                data-testid="aan"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("aan")).toBeTruthy();
    });
});
