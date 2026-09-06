import { afterEach, describe, expect, test } from "vitest";

import { CalendarRangePicker } from "./calendar-range-picker.js";

if (!customElements.get("lily-calendar-range-picker")) {
    customElements.define("lily-calendar-range-picker", CalendarRangePicker);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CalendarRangePicker", () => {
    test("carries the base class", () => {
        const host = render('<lily-calendar-range-picker label="Select dates"></lily-calendar-range-picker>');

        expect(host.classList.contains("calendar-range-picker")).toBe(true);
    });

    test("has role=application", () => {
        const host = render('<lily-calendar-range-picker label="Select dates"></lily-calendar-range-picker>');

        expect(host.getAttribute("role")).toBe("application");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-calendar-range-picker label="Select dates"></lily-calendar-range-picker>');

        expect(host.getAttribute("aria-label")).toBe("Select dates");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-calendar-range-picker label="Select dates" class="my-picker"></lily-calendar-range-picker>',
        );

        expect(host.getAttribute("class")).toBe("calendar-range-picker my-picker");
    });

    test("keeps consumer-supplied children in place", () => {
        const host = render(
            '<lily-calendar-range-picker label="Select dates"><table><caption>January</caption></table></lily-calendar-range-picker>',
        );

        expect(host.querySelector("table caption")).toBeTruthy();
    });

    test("is idempotent across repeated connectedCallback invocations", () => {
        const host = render('<lily-calendar-range-picker label="Select dates"></lily-calendar-range-picker>');

        (host as unknown as CalendarRangePicker).connectedCallback();

        expect(host.getAttribute("role")).toBe("application");
        expect(host.getAttribute("aria-label")).toBe("Select dates");
    });
});
