import { afterEach, describe, expect, test } from "vitest";

import { ThemeView } from "./theme-view.js";

if (!customElements.get("lily-theme-view")) {
    customElements.define("lily-theme-view", ThemeView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ThemeView", () => {
    test("renders a native span with the base class", () => {
        const host = render(
            '<lily-theme-view label="Current theme" value="dark"></lily-theme-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span.classList.contains("theme-view")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-theme-view label="Current theme" value="dark"></lily-theme-view>',
        );

        expect(
            host
                .querySelector("span .screen-reader-span")
                ?.textContent?.replace(
                    host
                        .querySelector("span .screen-reader-span")
                        ?.querySelector(".screen-reader-span")?.textContent ?? "",
                    "",
                ),
        ).toBe(`${"Current theme"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("renders value as the text content", () => {
        const host = render(
            '<lily-theme-view label="Current theme" value="dark"></lily-theme-view>',
        );

        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("dark");
    });

    test("passes through rest attributes onto the span", () => {
        const host = render(
            '<lily-theme-view label="Current theme" value="dark" data-testid="theme-view-1"></lily-theme-view>',
        );

        expect(host.querySelector("span")!.getAttribute("data-testid")).toBe("theme-view-1");
    });

    test("merges the consumer's class attribute with the base class", () => {
        const host = render(
            '<lily-theme-view label="Current theme" value="dark" class="my-view"></lily-theme-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span.classList.contains("theme-view")).toBe(true);
        expect(span.classList.contains("my-view")).toBe(true);
    });
});
