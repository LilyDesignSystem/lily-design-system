import { afterEach, describe, expect, test } from "vitest";

import { AspectRatioContainer } from "./aspect-ratio-container.js";

if (!customElements.get("lily-aspect-ratio-container")) {
    customElements.define("lily-aspect-ratio-container", AspectRatioContainer);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AspectRatioContainer", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-aspect-ratio-container>Content</lily-aspect-ratio-container>");

        expect(host.className).toBe("aspect-ratio-container");
    });

    test("defaults ratio to 1", () => {
        const host = render("<lily-aspect-ratio-container>Content</lily-aspect-ratio-container>");

        expect(host.getAttribute("data-aspect-ratio")).toBe("1");
        expect(host.style.getPropertyValue("--aspect-ratio-container-ratio")).toBe("1");
    });

    test("honours an explicit ratio", () => {
        const host = render('<lily-aspect-ratio-container ratio="1.777">Content</lily-aspect-ratio-container>');

        expect(host.getAttribute("data-aspect-ratio")).toBe("1.777");
        expect(host.style.getPropertyValue("--aspect-ratio-container-ratio")).toBe("1.777");
    });

    test("preserves original content", () => {
        const host = render("<lily-aspect-ratio-container><img src='/x.png' /></lily-aspect-ratio-container>");

        expect(host.querySelector("img")).toBeTruthy();
    });

    test("updates when ratio changes externally", () => {
        const host = render("<lily-aspect-ratio-container>Content</lily-aspect-ratio-container>");

        host.setAttribute("ratio", "2");

        expect(host.getAttribute("data-aspect-ratio")).toBe("2");
    });
});
