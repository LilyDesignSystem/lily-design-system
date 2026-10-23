import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Button.vue";


describe("Button", () => {
    test("renders as a button", () => {
        render(Subject, { slots: { default: "Click me" } });

        const button: HTMLElement = screen.getByRole("button", { name: "Click me" });
        expect(button).toBeTruthy();
    });

    test("defaults to type button", () => {
        render(Subject, { slots: { default: "Click" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("accepts submit type", () => {
        render(Subject, { props: { type: "submit" }, slots: { default: "Submit" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("submit");
    });

    test("can be disabled", () => {
        render(Subject, { props: { disabled: true }, slots: { default: "Disabled" } });

        const button: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: { onClick: handleClick }, slots: { default: "Click" } });

        const button: HTMLElement = screen.getByRole("button");
        await user.click(button);
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("does not fire click when disabled", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: { disabled: true,
            onClick: handleClick }, slots: { default: "Disabled" } });

        const button: HTMLElement = screen.getByRole("button");
        await user.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    test("supports aria-pressed for toggle buttons", () => {
        render(Subject, { props: { pressed: true }, slots: { default: "Toggle" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-pressed")).toBe("true");
    });

    test("does not have aria-pressed when not a toggle button", () => {
        render(Subject, { slots: { default: "Normal" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-pressed")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        render(Subject, { props: { label: "Close dialog" }, slots: { default: "X" } });

        const button: HTMLElement = screen.getByRole("button", { name: "Close dialog" });
        expect(button).toBeTruthy();
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { slots: { default: "Focus me" } });

        const button: HTMLElement = screen.getByRole("button");
        await user.tab();
        expect(document.activeElement).toBe(button);
    });

    test("activates via Enter key", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: { onClick: handleClick }, slots: { default: "Press Enter" } });

        const button: HTMLElement = screen.getByRole("button");
        await user.tab();
        await user.keyboard("{Enter}");
        expect(handleClick).toHaveBeenCalled();
    });

    test("activates via Space key", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: { onClick: handleClick }, slots: { default: "Press Space" } });

        const button: HTMLElement = screen.getByRole("button");
        await user.tab();
        await user.keyboard(" ");
        expect(handleClick).toHaveBeenCalled();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "my-btn",
            id: "btn-1" }, slots: { default: "Custom" } });

        const button: HTMLElement = screen.getByTestId("my-btn");
        expect(button.getAttribute("id")).toBe("btn-1");
    });

    test("a pending button stays enabled and focusable, carrying aria-busy and aria-disabled", () => {
        render(Subject, { props: { "aria-busy": "true", "aria-disabled": "true" }, slots: { default: "Saving" } });
        const button = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(false);
        expect(button.getAttribute("aria-busy")).toBe("true");
        expect(button.getAttribute("aria-disabled")).toBe("true");
        button.focus();
        expect(document.activeElement).toBe(button);
    });
});
