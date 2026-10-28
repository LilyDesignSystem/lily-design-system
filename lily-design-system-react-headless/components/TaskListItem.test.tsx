import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./TaskListItem";

describe("TaskListItem", () => {
    test("renders a list item", () => {
        render(<Subject label="Buy groceries" />);
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders a checkbox", () => {
        render(<Subject label="Buy groceries" />);
        expect(screen.getByRole("checkbox")).toBeTruthy();
    });

    test("renders the label text", () => {
        render(<Subject label="Buy groceries" />);
        expect(screen.getByText("Buy groceries")).toBeTruthy();
    });

    test("checkbox is unchecked by default", () => {
        render(<Subject label="Task" />);
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
    });

    test("checkbox is checked when checked prop is true", () => {
        render(
            <Subject
                label="Done task"
                checked
            />,
        );
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    test("checkbox toggles on user click", async () => {
        const user = userEvent.setup();
        render(<Subject label="Toggle me" />);
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
        await user.click(checkbox);
        expect(checkbox.checked).toBe(true);
        await user.click(checkbox);
        expect(checkbox.checked).toBe(false);
    });

    test("checkbox is disabled when disabled prop is true", () => {
        render(
            <Subject
                label="Locked task"
                disabled
            />,
        );
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.disabled).toBe(true);
    });

    test("disabled checkbox does not toggle on click", async () => {
        const user = userEvent.setup();
        render(
            <Subject
                label="Locked"
                disabled
            />,
        );
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        await user.click(checkbox);
        expect(checkbox.checked).toBe(false);
    });

    test("sets data-checked attribute", () => {
        render(
            <Subject
                label="Task"
                checked
            />,
        );
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-checked")).toBe("true");
    });

    test("sets data-disabled attribute when disabled", () => {
        render(
            <Subject
                label="Task"
                disabled
            />,
        );
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-disabled")).toBe("true");
    });

    test("no data-disabled when not disabled", () => {
        render(<Subject label="Task" />);
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-disabled")).toBeNull();
    });

    test("label wraps the checkbox for click association", () => {
        render(<Subject label="Wrapped" />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox.closest("label")).toBeTruthy();
    });

    test("passes through data-testid attribute", () => {
        render(
            <Subject
                label="Task"
                data-testid="task-item"
            />,
        );
        expect(screen.getByTestId("task-item")).toBeTruthy();
        expect(screen.getByTestId("task-item").tagName).toBe("LI");
    });

    test("passes through id attribute", () => {
        render(
            <Subject
                label="Task"
                id="task-1"
            />,
        );
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("task-1");
    });
});
