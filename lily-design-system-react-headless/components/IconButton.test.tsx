import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./IconButton";

describe("IconButton", () => {
    test("renders as a button with the required aria-label", () => {
        render(<Subject label="Close">X</Subject>);

        const button: HTMLElement = screen.getByRole("button", { name: "Close" });
        expect(button).toBeTruthy();
        expect(button.getAttribute("aria-label")).toBe("Close");
    });

    test("applies the icon-button root class", () => {
        render(<Subject label="Close">X</Subject>);

        const button: HTMLElement = screen.getByRole("button");
        expect(button.className.includes("icon-button")).toBe(true);
    });

    test("defaults to type button", () => {
        render(<Subject label="Close">X</Subject>);

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("can be disabled", () => {
        render(<Subject label="Close" disabled>X</Subject>);

        const button: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(<Subject label="Close" onClick={handleClick}>X</Subject>);

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("supports aria-pressed for toggle buttons", () => {
        render(<Subject label="Mute" pressed>M</Subject>);

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-pressed")).toBe("true");
    });

    test("does not have aria-pressed when not a toggle button", () => {
        render(<Subject label="Close">X</Subject>);

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-pressed")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Close" id="x-btn">X</Subject>);

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("id")).toBe("x-btn");
    });
});
