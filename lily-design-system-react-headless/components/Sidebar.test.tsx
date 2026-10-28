import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Sidebar";

describe("Sidebar", () => {
    test("renders an aside", () => {
        render(
            <Subject
                label="Nav"
                data-testid="sb"
            >
                content
            </Subject>,
        );
        expect(screen.getByTestId("sb").tagName).toBe("ASIDE");
    });

    test("has aria-label", () => {
        render(<Subject label="Navigation">content</Subject>);
        expect(screen.getByLabelText("Navigation")).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject label="Nav">Menu</Subject>);
        expect(screen.getByText("Menu")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="N"
                data-testid="sb"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("sb")).toBeTruthy();
    });
});
