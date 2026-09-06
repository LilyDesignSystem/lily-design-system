import { afterEach, describe, expect, test } from "vitest";

import { TimePickerInput } from "./time-picker-input.js";

if (!customElements.get("lily-time-picker-input")) {
    customElements.define("lily-time-picker-input", TimePickerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TimePickerInput", () => {
    test("renders a native input[type=time]", () => {
        const host = render('<lily-time-picker-input label="Appointment time"></lily-time-picker-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("time");
        expect(input.classList.contains("time-picker-input")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-time-picker-input label="Departure time"></lily-time-picker-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Departure time");
    });

    test("seeds the input from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-time-picker-input label="Appointment time" value="09:30"></lily-time-picker-input>',
        ) as unknown as TimePickerInput;

        expect(host.value).toBe("09:30");
        host.value = "14:00";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("14:00");
    });

    test("required and disabled propagate to the input", () => {
        const host = render(
            '<lily-time-picker-input label="Appointment time" required disabled></lily-time-picker-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes onto the input", () => {
        const host = render(
            '<lily-time-picker-input label="Appointment time" min="09:00" max="17:00"></lily-time-picker-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.getAttribute("min")).toBe("09:00");
        expect(input.getAttribute("max")).toBe("17:00");
    });
});
