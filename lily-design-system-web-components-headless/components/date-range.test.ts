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
    test("wraps a real span carrying the base class and role=group (per the AGENTS.md metadata field)", () => {
        const host = render(
            '<lily-date-range label="Trip dates" start-label="Departure" end-label="Return"></lily-date-range>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span.className).toBe("date-range");
        expect(span.getAttribute("role")).toBe("group");
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
