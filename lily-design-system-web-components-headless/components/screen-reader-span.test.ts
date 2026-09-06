import { afterEach, describe, expect, test } from "vitest";

import { ScreenReaderSpan } from "./screen-reader-span.js";

if (!customElements.get("lily-screen-reader-span")) {
    customElements.define("lily-screen-reader-span", ScreenReaderSpan);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ScreenReaderSpan", () => {
    test("renders a native span with the correct class", () => {
        const host = render("<lily-screen-reader-span>Opens in a new tab</lily-screen-reader-span>");

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("screen-reader-span");
    });

    test("moves children into the span", () => {
        const host = render("<lily-screen-reader-span>Opens in a new tab</lily-screen-reader-span>");

        expect(host.querySelector("span")!.textContent).toBe("Opens in a new tab");
    });

    test("sets aria-label when label is provided", () => {
        const host = render(
            '<lily-screen-reader-span label="Additional context">Opens in a new tab</lily-screen-reader-span>',
        );

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Additional context");
    });

    test("omits aria-label when label is absent", () => {
        const host = render("<lily-screen-reader-span>Opens in a new tab</lily-screen-reader-span>");

        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("passes through rest attributes onto the span", () => {
        const host = render(
            '<lily-screen-reader-span data-testid="sr-text">Opens in a new tab</lily-screen-reader-span>',
        );

        expect(host.querySelector("span")!.getAttribute("data-testid")).toBe("sr-text");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-screen-reader-span class="visually-hidden">Opens in a new tab</lily-screen-reader-span>',
        );

        expect(host.querySelector("span")!.className).toBe("screen-reader-span visually-hidden");
    });
});
