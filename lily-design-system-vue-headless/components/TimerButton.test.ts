import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";

import Subject from "./TimerButton.vue";

describe("TimerButton", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("renders a button with class timer-button", () => {
        const { container } = render(Subject, {
            props: { label: "Auto", duration: 5 },
            slots: { default: "Auto" },
        });
        const btn = container.querySelector(".timer-button");
        expect(btn).toBeTruthy();
        expect(btn?.tagName).toBe("BUTTON");
    });

    test("type defaults to button", () => {
        render(Subject, { props: { label: "x", duration: 5 }, slots: { default: "x" } });
        expect(screen.getByRole("button").getAttribute("type")).toBe("button");
    });

    test("applies aria-label and aria-live=polite", () => {
        render(Subject, { props: { label: "Continue", duration: 5 }, slots: { default: "x" } });
        const btn = screen.getByRole("button", { name: "Continue" });
        expect(btn.getAttribute("aria-live")).toBe("polite");
    });

    test("emits click automatically when countdown reaches zero", async () => {
        const { emitted } = render(Subject, {
            props: { label: "x", duration: 1 },
            slots: { default: "x" },
        });
        await vi.advanceTimersByTimeAsync(1500);
        expect(emitted().click?.length).toBe(1);
    });

    test("emits click when the button is clicked manually", async () => {
        vi.useRealTimers();
        const { emitted } = render(Subject, {
            props: { label: "x", duration: 60 },
            slots: { default: "x" },
        });
        await fireEvent.click(screen.getByRole("button"));
        expect(emitted().click?.length).toBe(1);
    });

    test("does not emit click twice if clicked after auto-activation", async () => {
        const { emitted } = render(Subject, {
            props: { label: "x", duration: 1 },
            slots: { default: "x" },
        });
        await vi.advanceTimersByTimeAsync(1500);
        const btn = screen.getByRole("button");
        await fireEvent.click(btn);
        expect(emitted().click?.length).toBe(1);
    });

    test("does not start the timer when disabled", async () => {
        const { emitted } = render(Subject, {
            props: { label: "x", duration: 1, disabled: true },
            slots: { default: "x" },
        });
        await vi.advanceTimersByTimeAsync(2000);
        expect(emitted().click).toBeUndefined();
    });
});
