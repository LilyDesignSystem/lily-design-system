import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TaskList";

describe("TaskList", () => {
    test("renders an ordered list element", () => {
        render(<Subject label="Tasks">items</Subject>);

        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
    });

    test("has role list", () => {
        render(<Subject label="Tasks">items</Subject>);

        const list = screen.getByRole("list");
        expect(list.getAttribute("role")).toBe("list");
    });

    test("has aria-label from label prop", () => {
        render(<Subject label="Today's tasks">items</Subject>);

        const list = screen.getByRole("list");
        expect(list.getAttribute("aria-label")).toBe("Today's tasks");
    });

    test("renders children content", () => {
        render(<Subject label="Tasks">Review code</Subject>);

        const list = screen.getByRole("list");
        expect(list.textContent).toContain("Review code");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Tasks"
                data-testid="my-tasks"
            >
                items
            </Subject>,
        );

        const list = screen.getByTestId("my-tasks");
        expect(list).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(
            <Subject
                label="Tasks"
                id="task-list-1"
            >
                items
            </Subject>,
        );

        const list = screen.getByRole("list");
        expect(list.getAttribute("id")).toBe("task-list-1");
    });
});
