import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Form";

describe("Form", () => {
    test("renders as a form", () => {
        render(<Subject label="Login">Fields</Subject>);
        expect(screen.getByRole("form", { name: "Login" })).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Register">C</Subject>);
        expect(screen.getByRole("form").getAttribute("aria-label")).toBe("Register");
    });

    test("calls onSubmit and prevents default", async () => {
        const user: UserEvent = userEvent.setup();
        const handleSubmit = vi.fn();
        render(
            <Subject
                label="F"
                onSubmit={handleSubmit}
            >
                <button type="submit">Go</button>
            </Subject>,
        );
        await user.click(screen.getByRole("button", { name: "Go" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
    });

    test("renders children", () => {
        render(<Subject label="F">Form content</Subject>);
        expect(screen.getByRole("form").textContent).toContain("Form content");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="F"
                data-testid="fm"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("fm")).toBeTruthy();
    });
});
