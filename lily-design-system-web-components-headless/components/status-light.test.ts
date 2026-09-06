import { afterEach, describe, expect, test } from "vitest";

import { StatusLight } from "./status-light.js";

if (!customElements.get("lily-status-light")) {
    customElements.define("lily-status-light", StatusLight);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("StatusLight", () => {
    test("renders a native span with role=status", () => {
        const host = render('<lily-status-light label="Active"></lily-status-light>');

        const span = host.querySelector("span.status-light") as HTMLSpanElement;
        expect(span).toBeTruthy();
        expect(span.getAttribute("role")).toBe("status");
    });

    test("defaults data-variant to neutral", () => {
        const host = render('<lily-status-light label="Active"></lily-status-light>');

        expect(host.querySelector(".status-light")!.getAttribute("data-variant")).toBe("neutral");
    });

    test("honours an explicit variant", () => {
        const host = render('<lily-status-light variant="positive" label="Active"></lily-status-light>');

        expect(host.querySelector(".status-light")!.getAttribute("data-variant")).toBe("positive");
    });

    test("renders the dot as aria-hidden", () => {
        const host = render('<lily-status-light label="Active"></lily-status-light>');

        const dot = host.querySelector(".status-light-dot");
        expect(dot?.getAttribute("aria-hidden")).toBe("true");
    });

    test("renders the label as the accessible content", () => {
        const host = render('<lily-status-light label="Offline"></lily-status-light>');

        expect(host.querySelector(".status-light-label")?.textContent).toBe("Offline");
    });

    test("merges the consumer's class attribute with the base class", () => {
        const host = render('<lily-status-light label="Active" class="my-light"></lily-status-light>');

        const span = host.querySelector("span.status-light") as HTMLSpanElement;
        expect(span.classList.contains("status-light")).toBe(true);
        expect(span.classList.contains("my-light")).toBe(true);
    });
});
