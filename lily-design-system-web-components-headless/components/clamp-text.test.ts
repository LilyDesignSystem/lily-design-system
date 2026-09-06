import { afterEach, describe, expect, test } from "vitest";

import { ClampText } from "./clamp-text.js";

if (!customElements.get("lily-clamp-text")) {
    customElements.define("lily-clamp-text", ClampText);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ClampText", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-clamp-text>Long paragraph text.</lily-clamp-text>");

        expect(host.className).toBe("clamp-text");
    });

    test("defaults lines to 2", () => {
        const host = render("<lily-clamp-text>Long paragraph text.</lily-clamp-text>");

        expect(host.getAttribute("data-lines")).toBe("2");
        expect(host.style.getPropertyValue("--clamp-text-lines")).toBe("2");
    });

    test("honours an explicit lines value", () => {
        const host = render('<lily-clamp-text lines="4">Long paragraph text.</lily-clamp-text>');

        expect(host.getAttribute("data-lines")).toBe("4");
        expect(host.style.getPropertyValue("--clamp-text-lines")).toBe("4");
    });

    test("has no aria-label when label is absent", () => {
        const host = render("<lily-clamp-text>Long paragraph text.</lily-clamp-text>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as aria-label when provided", () => {
        const host = render('<lily-clamp-text label="Article summary">Long paragraph text.</lily-clamp-text>');

        expect(host.getAttribute("aria-label")).toBe("Article summary");
    });

    test("preserves the full content in the DOM", () => {
        const host = render('<lily-clamp-text lines="1">Long paragraph text.</lily-clamp-text>');

        expect(host.textContent).toBe("Long paragraph text.");
    });
});
