import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import TaskManagementPage from "../../app/task-management/page";

describe("TaskManagement", () => {
    test("renders the heading", () => {
        render(<TaskManagementPage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Task Management");
    });

    test("renders task list", () => {
        render(<TaskManagementPage />);
        expect(screen.getByText("Set up project repository")).toBeTruthy();
    });

    test("renders add task input and button", () => {
        render(<TaskManagementPage />);
        expect(screen.getByLabelText("New task title")).toBeTruthy();
        expect(screen.getByRole("button", { name: "Add Task" })).toBeTruthy();
    });

    test("adds a new task", async () => {
        const user = userEvent.setup();
        render(<TaskManagementPage />);
        await user.type(screen.getByLabelText("New task title"), "New test task");
        await user.click(screen.getByRole("button", { name: "Add Task" }));
        expect(screen.getByText("New test task")).toBeTruthy();
    });

    test("renders progress bar", () => {
        render(<TaskManagementPage />);
        const progressBar = screen.getByRole("progressbar");
        expect(progressBar).toBeTruthy();
    });
});
