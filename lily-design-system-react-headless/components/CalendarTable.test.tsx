import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CalendarTable";

describe("CalendarTable", () => {
    test("renders a grid", () => {
        render(<Subject label="January">1</Subject>);
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(<Subject label="January">1</Subject>);
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has aria-label", () => {
        render(<Subject label="January 2025">1</Subject>);
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("January 2025");
    });

    test("renders caption when provided", () => {
        render(
            <Subject
                label="January"
                caption="January 2025"
            >
                1
            </Subject>,
        );
        const table = screen.getByRole("grid");
        const cap = table.querySelector("caption");
        expect(cap).toBeTruthy();
        expect(cap?.textContent).toBe("January 2025");
    });

    test("renders without caption by default", () => {
        render(<Subject label="January">1</Subject>);
        const cap = screen.getByRole("grid").querySelector("caption");
        expect(cap).toBeNull();
    });

    test("renders children content", () => {
        render(<Subject label="J">15</Subject>);
        expect(screen.getByText("15")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="J"
                data-testid="cal"
            >
                1
            </Subject>,
        );
        expect(screen.getByTestId("cal")).toBeTruthy();
    });
});
