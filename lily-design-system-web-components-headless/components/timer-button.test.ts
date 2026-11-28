import { afterEach, describe, expect, test, vi } from "vitest";

import { TimerButton } from "./timer-button.js";

if (!customElements.get("lily-timer-button")) {
    customElements.define("lily-timer-button", TimerButton);
}

afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TimerButton", () => {
    test("renders a native button with the base class", () => {
        const host = render(
            '<lily-timer-button label="Continue" duration="5">Continue</lily-timer-button>',
        );

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.className).toBe("timer-button");
        expect(button.type).toBe("button");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-timer-button label="Continue" duration="5">Continue</lily-timer-button>',
        );

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Continue");
    });

    test("exposes duration as the initial data-remaining-seconds", () => {
        const host = render(
            '<lily-timer-button label="Continue" duration="5">Continue</lily-timer-button>',
        );

        expect(host.querySelector("button")!.getAttribute("data-remaining-seconds")).toBe("5");
    });

    test("disabled propagates to the native button", () => {
        const host = render(
            '<lily-timer-button label="Continue" duration="5" disabled>Continue</lily-timer-button>',
        );

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("manual click activates immediately and fires lily-activate", () => {
        const host = render(
            '<lily-timer-button label="Continue" duration="5">Continue</lily-timer-button>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-activate", handler);

        (host.querySelector("button") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("counts down and activates automatically at zero", () => {
        vi.useFakeTimers();
        const host = render(
            '<lily-timer-button label="Continue" duration="2">Continue</lily-timer-button>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-activate", handler);

        vi.advanceTimersByTime(1000);
        expect(host.querySelector("button")!.getAttribute("data-remaining-seconds")).toBe("1");
        expect(handler).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);
        expect(host.querySelector("button")!.getAttribute("data-remaining-seconds")).toBe("0");
        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("activating only fires lily-activate once even if clicked again", () => {
        const host = render(
            '<lily-timer-button label="Continue" duration="5">Continue</lily-timer-button>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-activate", handler);
        const button = host.querySelector("button") as HTMLButtonElement;

        button.click();
        button.click();

        expect(handler).toHaveBeenCalledTimes(1);
    });
});

describe("TimerButton follows its attributes (P50-T28)", () => {
    test("shows a change to label, disabled and class, and counts again from a new duration", () => {
        vi.useFakeTimers();
        const host = render('<lily-timer-button label="Old" duration="10">Go</lily-timer-button>');
        vi.advanceTimersByTime(3000);
        host.setAttribute("label", "New");
        host.setAttribute("disabled", "");
        host.setAttribute("class", "wide");
        host.setAttribute("duration", "5");
        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.getAttribute("aria-label")).toBe("New");
        expect(button.disabled).toBe(true);
        expect(button.className).toBe("timer-button wide");
        expect(button.getAttribute("data-remaining-seconds")).toBe("5");
        const fired = vi.fn();
        host.addEventListener("lily-activate", fired);
        vi.advanceTimersByTime(5000);
        expect(fired).toHaveBeenCalledTimes(1);
        host.setAttribute("duration", "8");
        vi.advanceTimersByTime(9000);
        expect(fired).toHaveBeenCalledTimes(1);
    });
});
