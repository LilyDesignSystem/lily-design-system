import { afterEach, describe, expect, test } from "vitest";

import { Timer } from "./timer.js";

if (!customElements.get("lily-timer")) {
    customElements.define("lily-timer", Timer);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Timer", () => {
    test("renders a native time element with role=timer", () => {
        const host = render('<lily-timer label="Countdown">05:30</lily-timer>');

        const time = host.querySelector("time") as HTMLTimeElement;
        expect(time.classList.contains("timer")).toBe(true);
        expect(time.getAttribute("role")).toBe("timer");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-timer label="Session timeout">5:30</lily-timer>');

        expect(host.querySelector("time")!.getAttribute("aria-label")).toBe("Session timeout");
    });

    test("sets aria-live=polite", () => {
        const host = render('<lily-timer label="Countdown">05:30</lily-timer>');

        expect(host.querySelector("time")!.getAttribute("aria-live")).toBe("polite");
    });

    test("moves children into the time element", () => {
        const host = render('<lily-timer label="Countdown">05:30</lily-timer>');

        expect(host.querySelector("time")!.textContent).toBe("05:30");
    });

    test("passes through a datetime attribute", () => {
        const host = render('<lily-timer label="Session timeout" datetime="PT5M30S">5:30</lily-timer>');

        expect(host.querySelector("time")!.getAttribute("datetime")).toBe("PT5M30S");
    });
});
