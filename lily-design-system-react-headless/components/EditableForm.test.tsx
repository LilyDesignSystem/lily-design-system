import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./EditableForm";

describe("EditableForm", () => {
    test("hidden when not editing", () => {
        render(<Subject label="Edit" editing={false}>Form</Subject>);
        expect(screen.queryByRole("form")).toBeNull();
    });

    test("visible when editing", () => {
        render(<Subject label="Edit" editing>Form</Subject>);
        expect(screen.getByRole("form", { name: "Edit" })).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject label="Edit" editing>My form</Subject>);
        expect(screen.getByRole("form").textContent).toContain("My form");
    });

    test("calls onSubmit on form submit", async () => {
        const user: UserEvent = userEvent.setup();
        const handleSubmit = vi.fn();
        render(
            <Subject label="Edit" editing onSubmit={handleSubmit}>
                <button type="submit">Save</button>
            </Subject>
        );

        await user.click(screen.getByRole("button", { name: "Save" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
    });

    test("calls onCancel on Escape", async () => {
        const user: UserEvent = userEvent.setup();
        const handleCancel = vi.fn();
        render(<Subject label="Edit" editing onCancel={handleCancel}>Form</Subject>);

        screen.getByRole("form").focus();
        await user.keyboard("{Escape}");
        expect(handleCancel).toHaveBeenCalledOnce();
    });

    test("passes through attributes", () => {
        render(<Subject label="Edit" editing data-testid="ef">C</Subject>);
        expect(screen.getByTestId("ef")).toBeTruthy();
    });
});
