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
        const host = render(
            '<lily-date-time-now-input label="Event time"></lily-date-time-now-input>',
        );

        expect(host.className).toBe("date-time-now-input");
        expect(host.getAttribute("role")).toBe("group");
        expect(host.getAttribute("aria-label")).toBe("Event time");
    });

    test("has no English default: without labels the controls carry no name or text", () => {
        const host = render(
            '<lily-date-time-now-input label="Event time"></lily-date-time-now-input>',
        );

        const dateInput = host.querySelector('input[type="date"]') as HTMLInputElement;
        const timeInput = host.querySelector('input[type="time"]') as HTMLInputElement;
        const button = host.querySelector("button") as HTMLButtonElement;

        expect(dateInput.hasAttribute("aria-label")).toBe(false);
        expect(timeInput.hasAttribute("aria-label")).toBe(false);
        expect(button.hasAttribute("aria-label")).toBe(false);
        expect(button.textContent).toBe("");
    });

    test("uses custom labels when provided", () => {
        const host = render(
            '<lily-date-time-now-input label="Heure" date-label="Date" time-label="Heure" now-label="Maintenant"></lily-date-time-now-input>',
        );

        expect(host.querySelector('input[type="date"]')!.getAttribute("aria-label")).toBe("Date");
        expect(host.querySelector('input[type="time"]')!.getAttribute("aria-label")).toBe("Heure");
        expect(host.querySelector("button")!.textContent).toBe("Maintenant");
        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Maintenant");
    });

    test("the Now button sets both inputs to the current date and time and dispatches lily-change", () => {
        const host = render(
            '<lily-date-time-now-input label="Event time"></lily-date-time-now-input>',
        ) as unknown as DateTimeNowInput;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);

        (host as unknown as HTMLElement)
            .querySelector("button")!
            .dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(host.dateValue).not.toBe("");
        expect(host.timeValue).not.toBe("");
        expect(handler).toHaveBeenCalledTimes(1);
        const event = handler.mock.calls[0][0] as CustomEvent<{
            dateValue: string;
            timeValue: string;
        }>;
        expect(event.detail.dateValue).toBe(host.dateValue);
        expect(event.detail.timeValue).toBe(host.timeValue);
    });

    test("required and disabled apply to both inputs; disabled also applies to the button", () => {
        const host = render(
            '<lily-date-time-now-input label="Event time" required disabled></lily-date-time-now-input>',
        );

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
        const host = render(
            '<lily-date-time-now-input label="Event time"></lily-date-time-now-input>',
        ) as unknown as DateTimeNowInput;

        host.dateValue = "2026-06-01";
        host.timeValue = "09:30";

        expect(host.dateValue).toBe("2026-06-01");
        expect(host.timeValue).toBe("09:30");
    });
});

describe("DateTimeNowInput follows its attributes (P50-T28)", () => {
    test("shows a change to its labels, values, required, disabled and class", () => {
        const host = render(
            '<lily-date-time-now-input label="Old" date-label="Day" time-label="Hour" now-label="Now"></lily-date-time-now-input>',
        );
        host.setAttribute("label", "New");
        host.setAttribute("date-label", "Date");
        host.setAttribute("time-label", "Time");
        host.setAttribute("now-label", "Today");
        host.setAttribute("date-value", "2026-11-28");
        host.setAttribute("time-value", "09:30");
        host.setAttribute("required", "");
        host.setAttribute("disabled", "");
        host.setAttribute("class", "wide");
        const [date, time] = Array.from(host.querySelectorAll("input"));
        const button = host.querySelector("button") as HTMLButtonElement;
        expect(host.className).toBe("date-time-now-input wide");
        expect(host.getAttribute("aria-label")).toBe("New");
        expect(date.getAttribute("aria-label")).toBe("Date");
        expect(time.getAttribute("aria-label")).toBe("Time");
        expect(button.textContent).toBe("Today");
        expect(date.value).toBe("2026-11-28");
        expect(time.value).toBe("09:30");
        expect(date.required && time.required).toBe(true);
        expect(date.disabled && time.disabled && button.disabled).toBe(true);
        host.removeAttribute("disabled");
        expect(date.disabled || time.disabled || button.disabled).toBe(false);
    });
});
