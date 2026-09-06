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
        const host = render('<lily-timer-button label="Continue" duration="5">Continue</lily-timer-button>');

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.className).toBe("timer-button");
        expect(button.type).toBe("button");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-timer-button label="Continue" duration="5">Continue</lily-timer-button>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Continue");
    });

    test("exposes duration as the initial data-remaining-seconds", () => {
        const host = render('<lily-timer-button label="Continue" duration="5">Continue</lily-timer-button>');

        expect(host.querySelector("button")!.getAttribute("data-remaining-seconds")).toBe("5");
    });

    test("disabled propagates to the native button", () => {
        const host = render('<lily-timer-button label="Continue" duration="5" disabled>Continue</lily-timer-button>');

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("manual click activates immediately and fires lily-activate", () => {
        const host = render('<lily-timer-button label="Continue" duration="5">Continue</lily-timer-button>');
        const handler = vi.fn();
        host.addEventListener("lily-activate", handler);

        (host.querySelector("button") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("counts down and activates automatically at zero", () => {
        vi.useFakeTimers();
        const host = render('<lily-timer-button label="Continue" duration="2">Continue</lily-timer-button>');
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
        const host = render('<lily-timer-button label="Continue" duration="5">Continue</lily-timer-button>');
        const handler = vi.fn();
        host.addEventListener("lily-activate", handler);
        const button = host.querySelector("button") as HTMLButtonElement;

        button.click();
        button.click();

        expect(handler).toHaveBeenCalledTimes(1);
    });
});
