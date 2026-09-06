import { afterEach, describe, expect, test, vi } from "vitest";

import { DateTimeNowInput } from "./date-time-now-input.js";

if (!customElements.get("lily-date-time-now-input")) {
    customElements.define("lily-date-time-now-input", DateTimeNowInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DateTimeNowInput", () => {
    test("the custom element itself is the wrapper, role=group (self-is-the-wrapper)", () => {
        const host = render('<lily-date-time-now-input label="Event time"></lily-date-time-now-input>');

        expect(host.className).toBe("date-time-now-input");
        expect(host.getAttribute("role")).toBe("group");
        expect(host.getAttribute("aria-label")).toBe("Event time");
    });

    test("contains a date input, a time input, and a Now button with default labels", () => {
        const host = render('<lily-date-time-now-input label="Event time"></lily-date-time-now-input>');

        const dateInput = host.querySelector('input[type="date"]') as HTMLInputElement;
        const timeInput = host.querySelector('input[type="time"]') as HTMLInputElement;
        const button = host.querySelector("button") as HTMLButtonElement;

        expect(dateInput.getAttribute("aria-label")).toBe("Date");
        expect(timeInput.getAttribute("aria-label")).toBe("Time");
        expect(button.getAttribute("aria-label")).toBe("Now");
        expect(button.textContent).toBe("Now");
    });

    test("uses custom labels when provided", () => {
        const host = render(
            '<lily-date-time-now-input label="Heure" date-label="Date" time-label="Heure" now-label="Maintenant"></lily-date-time-now-input>',
        );

        expect(host.querySelector('input[type="date"]')!.getAttribute("aria-label")).toBe("Date");
        expect(host.querySelector('input[type="time"]')!.getAttribute("aria-label")).toBe("Heure");
        expect(host.querySelector("button")!.textContent).toBe("Maintenant");
    });

    test("the Now button sets both inputs to the current date and time and dispatches lily-change", () => {
        const host = render('<lily-date-time-now-input label="Event time"></lily-date-time-now-input>') as unknown as DateTimeNowInput;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);

        (host as unknown as HTMLElement).querySelector("button")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(host.dateValue).not.toBe("");
        expect(host.timeValue).not.toBe("");
        expect(handler).toHaveBeenCalledTimes(1);
        const event = handler.mock.calls[0][0] as CustomEvent<{ dateValue: string; timeValue: string }>;
        expect(event.detail.dateValue).toBe(host.dateValue);
        expect(event.detail.timeValue).toBe(host.timeValue);
    });

    test("required and disabled apply to both inputs; disabled also applies to the button", () => {
        const host = render('<lily-date-time-now-input label="Event time" required disabled></lily-date-time-now-input>');

        const dateInput = host.querySelector('input[type="date"]') as HTMLInputElement;
        const timeInput = host.querySelector('input[type="time"]') as HTMLInputElement;
        const button = host.querySelector("button") as HTMLButtonElement;

        expect(dateInput.required).toBe(true);
        expect(timeInput.required).toBe(true);
        expect(dateInput.disabled).toBe(true);
        expect(timeInput.disabled).toBe(true);
        expect(button.disabled).toBe(true);
    });

    test("exposes live dateValue/timeValue properties", () => {
        const host = render('<lily-date-time-now-input label="Event time"></lily-date-time-now-input>') as unknown as DateTimeNowInput;

        host.dateValue = "2026-06-01";
        host.timeValue = "09:30";

        expect(host.dateValue).toBe("2026-06-01");
        expect(host.timeValue).toBe("09:30");
    });
});
