import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Form.vue";

describe("Form", () => {
    test("renders as a form", () => {
        render(Subject, { props: { label: "Login" }, slots: { default: "Fields" } });
        expect(screen.getByRole("form", { name: "Login" })).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Register" }, slots: { default: "C" } });
        expect(screen.getByRole("form").getAttribute("aria-label")).toBe("Register");
    });

    test("calls onsubmit and prevents default", async () => {
        const user: UserEvent = userEvent.setup();
        const handleSubmit = vi.fn();
        render(Subject, {
            props: { label: "F", onSubmit: handleSubmit },
            slots: { default: '<button type="submit">Go</button>' },
        });
        await user.click(screen.getByRole("button", { name: "Go" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "F" }, slots: { default: "Form content" } });
        expect(screen.getByRole("form").textContent).toContain("Form content");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "fm" }, slots: { default: "C" } });
        expect(screen.getByTestId("fm")).toBeTruthy();
    });
});
