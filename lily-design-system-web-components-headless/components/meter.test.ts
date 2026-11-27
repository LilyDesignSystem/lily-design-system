import { afterEach, describe, expect, test } from "vitest";

import { Meter } from "./meter.js";

if (!customElements.get("lily-meter")) {
    customElements.define("lily-meter", Meter);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Meter", () => {
    test("renders a native meter with the given value", () => {
        const host = render('<lily-meter label="Disk usage" value="72"></lily-meter>');

        expect((host.querySelector("meter") as HTMLMeterElement).value).toBe(72);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-meter label="Disk usage" value="72"></lily-meter>');

        expect(host.querySelector("meter")!.getAttribute("aria-label")).toBe("Disk usage");
    });

    test("defaults min to 0 and max to 100", () => {
        const host = render('<lily-meter label="Disk usage" value="72"></lily-meter>');

        const meter = host.querySelector("meter") as HTMLMeterElement;
        expect(meter.min).toBe(0);
        expect(meter.max).toBe(100);
    });

    test("honours explicit min/max/low/high/optimum", () => {
        const host = render(
            '<lily-meter label="Disk usage" value="7" min="0" max="10" low="2" high="8" optimum="5"></lily-meter>',
        );

        const meter = host.querySelector("meter") as HTMLMeterElement;
        expect(meter.low).toBe(2);
        expect(meter.high).toBe(8);
        expect(meter.optimum).toBe(5);
    });

    test("renders the value as fallback text content", () => {
        const host = render('<lily-meter label="Disk usage" value="72"></lily-meter>');

        expect(host.querySelector("meter")!.textContent).toBe("72");
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", async () => {
        document.body.innerHTML = `<lily-meter label="Fuel" value="20"></lily-meter>`;
        const el = document.querySelector("lily-meter")!;
        const span = el.querySelector("meter.meter")!;
        el.setAttribute("max", "500");
        el.setAttribute("value", "300");
        el.setAttribute("low", "100");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(el.querySelector("meter.meter")).toBe(span);
        expect((span as HTMLMeterElement).value).toBe(300);
        expect((span as HTMLMeterElement).max).toBe(500);
        expect(span.getAttribute("low")).toBe("100");
        expect(span.textContent).toBe("300");
    });
});
