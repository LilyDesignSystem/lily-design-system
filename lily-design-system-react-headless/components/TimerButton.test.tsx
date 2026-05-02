import { render, screen, act } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";

import Subject from "./TimerButton";

describe("TimerButton", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("renders a button with class timer-button", () => {
        const { container } = render(<Subject label="Auto" duration={5}>Auto</Subject>);
        const btn = container.querySelector(".timer-button");
        expect(btn).toBeTruthy();
        expect(btn?.tagName).toBe("BUTTON");
    });

    test("type defaults to button", () => {
        render(<Subject label="Auto" duration={5}>Auto</Subject>);
        expect(screen.getByRole("button").getAttribute("type")).toBe("button");
    });

    test("applies aria-label and aria-live=polite", () => {
        render(<Subject label="Continue" duration={5}>x</Subject>);
        const btn = screen.getByRole("button", { name: "Continue" });
        expect(btn.getAttribute("aria-live")).toBe("polite");
    });

    test("renders children content", () => {
        render(<Subject label="x" duration={5}>Click me</Subject>);
        expect(screen.getByRole("button").textContent).toContain("Click me");
    });

    test("fires onClick automatically when countdown reaches zero", () => {
        const onClick = vi.fn();
        render(<Subject label="x" duration={1} onClick={onClick}>x</Subject>);
        act(() => {
            vi.advanceTimersByTime(1500);
        });
        expect(onClick).toHaveBeenCalledOnce();
    });

    test("fires onClick when the button is clicked manually", async () => {
        vi.useRealTimers();
        const user: UserEvent = userEvent.setup();
        const onClick = vi.fn();
        render(<Subject label="x" duration={60} onClick={onClick}>x</Subject>);
        await user.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledOnce();
    });

    test("does not fire onClick twice if clicked after auto-activation", () => {
        const onClick = vi.fn();
        const { container } = render(<Subject label="x" duration={1} onClick={onClick}>x</Subject>);
        act(() => {
            vi.advanceTimersByTime(1500);
        });
        const btn = container.querySelector("button") as HTMLButtonElement;
        btn.click();
        expect(onClick).toHaveBeenCalledOnce();
    });

    test("does not start the timer when disabled", () => {
        const onClick = vi.fn();
        render(<Subject label="x" duration={1} disabled onClick={onClick}>x</Subject>);
        act(() => {
            vi.advanceTimersByTime(2000);
        });
        expect(onClick).not.toHaveBeenCalled();
    });
});
