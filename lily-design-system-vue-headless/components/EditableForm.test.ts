import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./EditableForm.vue";

describe("EditableForm", () => {
    test("hidden when not editing", () => {
        render(Subject, { props: { label: "Edit", editing: false }, slots: { default: "Form" } });
        expect(screen.queryByRole("form")).toBeNull();
    });

    test("visible when editing", () => {
        render(Subject, { props: { label: "Edit", editing: true }, slots: { default: "Form" } });
        expect(screen.getByRole("form", { name: "Edit" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Edit", editing: true }, slots: { default: "My form" } });
        expect(screen.getByRole("form").textContent).toContain("My form");
    });

    test("calls onsubmit on form submit", async () => {
        const user: UserEvent = userEvent.setup();
        const handleSubmit = vi.fn();
        render(Subject, {
            props: { label: "Edit", editing: true, onSubmit: handleSubmit },
            slots: { default: '<button type="submit">Save</button>' },
        });

        await user.click(screen.getByRole("button", { name: "Save" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
    });

    test("calls oncancel on Escape", async () => {
        const user: UserEvent = userEvent.setup();
        const handleCancel = vi.fn();
        render(Subject, {
            props: { label: "Edit", editing: true, oncancel: handleCancel },
            slots: { default: "Form" },
        });

        screen.getByRole("form").focus();
        await user.keyboard("{Escape}");
        expect(handleCancel).toHaveBeenCalledOnce();
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Edit", editing: true, "data-testid": "ef" },
            slots: { default: "C" },
        });
        expect(screen.getByTestId("ef")).toBeTruthy();
    });
});
