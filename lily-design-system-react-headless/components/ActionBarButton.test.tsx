import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ActionBarButton";

describe("ActionBarButton", () => {
    test("renders as a button with the required aria-label", () => {
        render(<Subject label="Delete">Delete</Subject>);

        const button: HTMLElement = screen.getByRole("button", { name: "Delete" });
        expect(button).toBeTruthy();
        expect(button.getAttribute("aria-label")).toBe("Delete");
    });

    test("applies the action-bar-button root class", () => {
        render(<Subject label="Delete">Delete</Subject>);

        const button: HTMLElement = screen.getByRole("button");
        expect(button.className.includes("action-bar-button")).toBe(true);
    });

    test("defaults to type button", () => {
        render(<Subject label="Delete">Delete</Subject>);

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("can be disabled", () => {
        render(<Subject label="Delete" disabled>Delete</Subject>);

        const button: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(<Subject label="Delete" onClick={handleClick}>Delete</Subject>);

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("renders children content", () => {
        render(<Subject label="Delete"><span>icon</span>Delete</Subject>);

        expect(screen.getByText("Delete")).toBeTruthy();
        expect(screen.getByText("icon")).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Delete" id="del-btn">Delete</Subject>);

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("id")).toBe("del-btn");
    });
});
