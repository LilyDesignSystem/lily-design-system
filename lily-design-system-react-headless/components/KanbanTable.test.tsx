import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./KanbanTable";

describe("KanbanTable", () => {
    test("renders a grid", () => {
        render(<Subject label="Board">cols</Subject>);
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(<Subject label="Board">cols</Subject>);
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has aria-label", () => {
        render(<Subject label="Sprint 5 board">cols</Subject>);
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Sprint 5 board");
    });

    test("renders caption when provided", () => {
        render(
            <Subject
                label="Board"
                caption="Sprint 5 board"
            >
                cols
            </Subject>,
        );
        const table = screen.getByRole("grid");
        const cap = table.querySelector("caption");
        expect(cap).toBeTruthy();
        expect(cap?.textContent).toBe("Sprint 5 board");
    });

    test("renders without caption by default", () => {
        render(<Subject label="Board">cols</Subject>);
        const cap = screen.getByRole("grid").querySelector("caption");
        expect(cap).toBeNull();
    });

    test("renders children content", () => {
        render(<Subject label="Board">Tasks here</Subject>);
        expect(screen.getByText("Tasks here")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="K"
                data-testid="kb"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("kb")).toBeTruthy();
    });
});
