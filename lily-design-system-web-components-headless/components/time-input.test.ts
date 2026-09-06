import { afterEach, describe, expect, test } from "vitest";

import { TimeInput } from "./time-input.js";

if (!customElements.get("lily-time-input")) {
    customElements.define("lily-time-input", TimeInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TimeInput", () => {
    test("renders a native input type=time", () => {
        const host = render('<lily-time-input label="Appointment time"></lily-time-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("time");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-time-input label="Appointment time"></lily-time-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Appointment time");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-time-input label="Appointment time" value="14:30"></lily-time-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("14:30");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render(
            '<lily-time-input label="Appointment time"></lily-time-input>',
        ) as unknown as TimeInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "09:00";

        expect(input.value).toBe("09:00");
        expect(host.value).toBe("09:00");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-time-input label="Appointment time" required disabled></lily-time-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as step", () => {
        const host = render('<lily-time-input label="Appointment time" step="60"></lily-time-input>');

        expect(host.querySelector("input")!.getAttribute("step")).toBe("60");
    });
});
