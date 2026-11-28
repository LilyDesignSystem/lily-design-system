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

const SVG =
    '<svg viewBox="0 0 100 20"><polyline points="0,20 20,10 40,15 60,5 80,12 100,2"></polyline></svg>';

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
        const host = render(
            `<lily-sparkline label="Sales trend" data-testid="trend">${SVG}</lily-sparkline>`,
        );

        expect(host.querySelector("span")!.getAttribute("data-testid")).toBe("trend");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            `<lily-sparkline label="Sales trend" class="my-sparkline">${SVG}</lily-sparkline>`,
        );

        expect(host.querySelector("span")!.className).toBe("sparkline my-sparkline");
    });

    test("below minimum-points it shows the consumer's words as text, not the graphic", () => {
        document.body.innerHTML = `<lily-sparkline label="Weight trend" point-count="2" minimum-points="3" insufficient-label="Not enough readings for a trend"><svg></svg></lily-sparkline>`;
        const root = document.querySelector(".sparkline") as HTMLElement;
        expect(root.hasAttribute("data-insufficient")).toBe(true);
        expect(root.getAttribute("role")).toBeNull();
        expect(root.querySelector("svg")).toBeNull();
        expect(root.querySelector(".sparkline-insufficient")?.textContent).toBe(
            "Not enough readings for a trend",
        );
    });
});

describe("Sparkline follows its attributes (P50-T28)", () => {
    test("shows a change to its point count, keeping the graphic", () => {
        const host = render(
            '<lily-sparkline label="Old" minimum-points="3" point-count="5" insufficient-label="Too few"><svg></svg></lily-sparkline>',
        );
        const span = host.querySelector("span.sparkline") as HTMLElement;
        host.setAttribute("point-count", "1");
        expect(span.hasAttribute("data-insufficient")).toBe(true);
        expect(span.hasAttribute("role")).toBe(false);
        expect(span.textContent).toBe("Too few");
        expect(span.querySelector("svg")).toBeNull();
        host.setAttribute("point-count", "4");
        host.setAttribute("label", "New");
        host.setAttribute("class", "wide");
        expect(span.hasAttribute("data-insufficient")).toBe(false);
        expect(span.getAttribute("role")).toBe("img");
        expect(span.getAttribute("aria-label")).toBe("New");
        expect(span.className).toBe("sparkline wide");
        expect(span.querySelector("svg")).toBeTruthy();
    });
});
