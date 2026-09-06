import { afterEach, describe, expect, test } from "vitest";

import { Sparkline } from "./sparkline.js";

if (!customElements.get("lily-sparkline")) {
    customElements.define("lily-sparkline", Sparkline);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const SVG = '<svg viewBox="0 0 100 20"><polyline points="0,20 20,10 40,15 60,5 80,12 100,2"></polyline></svg>';

describe("Sparkline", () => {
    test("renders a native span with the correct class", () => {
        const host = render(`<lily-sparkline label="Sales trend">${SVG}</lily-sparkline>`);

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("sparkline");
    });

    test("has role=img", () => {
        const host = render(`<lily-sparkline label="Sales trend">${SVG}</lily-sparkline>`);

        expect(host.querySelector("span")!.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-sparkline label="Sales trend">${SVG}</lily-sparkline>`);

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Sales trend");
    });

    test("moves the consumer's visualization children into the span", () => {
        const host = render(`<lily-sparkline label="Sales trend">${SVG}</lily-sparkline>`);

        expect(host.querySelector("span > svg")).toBeTruthy();
    });

    test("passes through rest attributes onto the span", () => {
        const host = render(`<lily-sparkline label="Sales trend" data-testid="trend">${SVG}</lily-sparkline>`);

        expect(host.querySelector("span")!.getAttribute("data-testid")).toBe("trend");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(`<lily-sparkline label="Sales trend" class="my-sparkline">${SVG}</lily-sparkline>`);

        expect(host.querySelector("span")!.className).toBe("sparkline my-sparkline");
    });
});
