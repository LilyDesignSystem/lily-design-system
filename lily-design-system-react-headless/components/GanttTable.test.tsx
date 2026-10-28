import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./GanttTable";

describe("GanttTable", () => {
    test("renders a grid", () => {
        render(<Subject label="Project">tasks</Subject>);
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(<Subject label="Project">tasks</Subject>);
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has aria-label", () => {
        render(<Subject label="Project timeline">tasks</Subject>);
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Project timeline");
    });

    test("renders caption when provided", () => {
        render(
            <Subject
                label="Project"
                caption="Q1 Schedule"
            >
                tasks
            </Subject>,
        );
        const table = screen.getByRole("grid");
        const cap = table.querySelector("caption");
        expect(cap).toBeTruthy();
        expect(cap?.textContent).toBe("Q1 Schedule");
    });

    test("renders without caption by default", () => {
        render(<Subject label="Project">tasks</Subject>);
        const cap = screen.getByRole("grid").querySelector("caption");
        expect(cap).toBeNull();
    });

    test("renders children content", () => {
        render(<Subject label="G">My tasks</Subject>);
        expect(screen.getByText("My tasks")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="G"
                data-testid="gt"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("gt")).toBeTruthy();
    });
});
