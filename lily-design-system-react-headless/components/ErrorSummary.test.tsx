import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ErrorSummary";

describe("ErrorSummary", () => {
    test("renders with alert role", () => {
        render(<Subject title="Errors">Fix these</Subject>);
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("displays title as heading", () => {
        render(<Subject title="There are errors">List</Subject>);
        expect(screen.getByRole("heading", { name: "There are errors" })).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject title="Errors">Name is required</Subject>);
        expect(screen.getByRole("alert").textContent).toContain("Name is required");
    });

    test("is focusable", () => {
        render(<Subject title="Errors">Fix</Subject>);
        const alert = screen.getByRole("alert");
        alert.focus();
        expect(document.activeElement).toBe(alert);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                title="E"
                data-testid="es"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("es")).toBeTruthy();
    });
});
