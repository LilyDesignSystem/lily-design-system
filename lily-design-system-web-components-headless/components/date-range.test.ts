import { afterEach, describe, expect, test } from "vitest";

import { DateRange } from "./date-range.js";

if (!customElements.get("lily-date-range")) {
    customElements.define("lily-date-range", DateRange);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DateRange", () => {
    test("renders a real fieldset carrying the base class and the group name", () => {
        const host = render(
            '<lily-date-range label="Trip dates" start-label="Departure" end-label="Return"></lily-date-range>',
        );

        const span = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(span.className).toBe("date-range");
        expect(span.hasAttribute("role")).toBe(false);
        expect(span.getAttribute("aria-label")).toBe("Trip dates");
    });

    test("renders two date inputs with their own accessible names", () => {
        const host = render(
            '<lily-date-range label="Trip dates" start-label="Departure" end-label="Return"></lily-date-range>',
        );

        const inputs = host.querySelectorAll("input[type=date]");
        expect(inputs).toHaveLength(2);
        expect(inputs[0].getAttribute("aria-label")).toBe("Departure");
        expect(inputs[1].getAttribute("aria-label")).toBe("Return");
    });

    test("seeds start/end from attributes", () => {
        const host = render(
            '<lily-date-range label="Trip dates" start-label="Departure" end-label="Return" start="2026-06-01" end="2026-06-10"></lily-date-range>',
        ) as unknown as DateRange;

        expect(host.start).toBe("2026-06-01");
        expect(host.end).toBe("2026-06-10");
    });

    test("exposes live start/end properties", () => {
        const host = render(
            '<lily-date-range label="Trip dates" start-label="Departure" end-label="Return"></lily-date-range>',
        ) as unknown as DateRange;

        host.start = "2026-07-01";
        host.end = "2026-07-14";

        const inputs = host.querySelectorAll("input[type=date]");
        expect((inputs[0] as HTMLInputElement).value).toBe("2026-07-01");
        expect((inputs[1] as HTMLInputElement).value).toBe("2026-07-14");
    });
});

describe("DateRange follows its attributes (P50-T28)", () => {
    test("shows a change to its labels, dates and class, never overwriting what was typed", () => {
        const host = render(
            '<lily-date-range label="Old" start-label="From" end-label="To"></lily-date-range>',
        );
        const [start, end] = Array.from(host.querySelectorAll("input"));
        host.setAttribute("label", "Stay");
        host.setAttribute("start-label", "Arrive");
        host.removeAttribute("end-label");
        host.setAttribute("start", "2026-12-01");
        host.setAttribute("class", "wide");
        expect(host.querySelector("fieldset")?.className).toBe("date-range wide");
        expect(host.querySelector("fieldset")?.getAttribute("aria-label")).toBe("Stay");
        expect(start.getAttribute("aria-label")).toBe("Arrive");
        expect(end.hasAttribute("aria-label")).toBe(false);
        expect(start.value).toBe("2026-12-01");
        end.value = "2026-12-09";
        host.setAttribute("end", "2026-12-05");
        expect(end.value).toBe("2026-12-09");
    });
});
