import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./FloatButton";

describe("FloatButton", () => {
    test("renders a button with the required aria-label", () => {
        render(<Subject label="Scroll to top">↑</Subject>);

        const button: HTMLElement = screen.getByRole("button", { name: "Scroll to top" });
        expect(button).toBeTruthy();
    });

    test("applies the float-button root class", () => {
        render(<Subject label="x">↑</Subject>);
        const button: HTMLElement = screen.getByRole("button");
        expect(button.className.includes("float-button")).toBe(true);
    });

    test("defaults to bottom-right position", () => {
        render(<Subject label="x">↑</Subject>);
        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("data-position")).toBe("bottom-right");
        expect(button.style.position).toBe("fixed");
        expect(button.style.bottom).toBe("1rem");
        expect(button.style.right).toBe("1rem");
    });

    test("supports top-left position", () => {
        render(<Subject label="x" position="top-left">↑</Subject>);
        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("data-position")).toBe("top-left");
        expect(button.style.top).toBe("1rem");
        expect(button.style.left).toBe("1rem");
    });

    test("supports top-right position", () => {
        render(<Subject label="x" position="top-right">↑</Subject>);
        const button: HTMLElement = screen.getByRole("button");
        expect(button.style.top).toBe("1rem");
        expect(button.style.right).toBe("1rem");
    });

    test("supports bottom-left position", () => {
        render(<Subject label="x" position="bottom-left">↑</Subject>);
        const button: HTMLElement = screen.getByRole("button");
        expect(button.style.bottom).toBe("1rem");
        expect(button.style.left).toBe("1rem");
    });

    test("defaults to type button", () => {
        render(<Subject label="x">↑</Subject>);
        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("can be disabled", () => {
        render(<Subject label="x" disabled>↑</Subject>);
        const button: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(<Subject label="x" onClick={handleClick}>↑</Subject>);

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="x" id="fab-1">↑</Subject>);
        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("id")).toBe("fab-1");
    });
});
