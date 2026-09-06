import { afterEach, describe, expect, test } from "vitest";

import { DateTimeLocalInput } from "./date-time-local-input.js";

if (!customElements.get("lily-date-time-local-input")) {
    customElements.define("lily-date-time-local-input", DateTimeLocalInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DateTimeLocalInput", () => {
    test("renders a native input type=datetime-local with the base class", () => {
        const host = render('<lily-date-time-local-input label="Appointment"></lily-date-time-local-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("datetime-local");
        expect(input.classList.contains("date-time-local-input")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-date-time-local-input label="Appointment"></lily-date-time-local-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Appointment");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render(
            '<lily-date-time-local-input label="Appointment" value="2026-09-06T10:30"></lily-date-time-local-input>',
        );

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("2026-09-06T10:30");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render(
            '<lily-date-time-local-input label="Appointment"></lily-date-time-local-input>',
        ) as unknown as DateTimeLocalInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "2026-12-25T09:00";

        expect(input.value).toBe("2026-12-25T09:00");
        expect(host.value).toBe("2026-12-25T09:00");
    });

    test("min and max propagate to the inner input", () => {
        const host = render(
            '<lily-date-time-local-input label="Appointment" min="2026-01-01T00:00" max="2026-12-31T23:59"></lily-date-time-local-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.min).toBe("2026-01-01T00:00");
        expect(input.max).toBe("2026-12-31T23:59");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-date-time-local-input label="Appointment" required disabled></lily-date-time-local-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });
});
