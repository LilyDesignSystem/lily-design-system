import { afterEach, describe, expect, test } from "vitest";

import { ScrollBar } from "./scroll-bar.js";

if (!customElements.get("lily-scroll-bar")) {
    customElements.define("lily-scroll-bar", ScrollBar);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ScrollBar", () => {
    test("renders itself with the base class and role=scrollbar", () => {
        const host = render('<lily-scroll-bar label="Chat scroll"></lily-scroll-bar>');

        expect(host.classList.contains("scroll-bar")).toBe(true);
        expect(host.getAttribute("role")).toBe("scrollbar");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-scroll-bar label="Chat scroll"></lily-scroll-bar>');

        expect(host.getAttribute("aria-label")).toBe("Chat scroll");
    });

    test("defaults to vertical orientation", () => {
        const host = render('<lily-scroll-bar label="Chat scroll"></lily-scroll-bar>');

        expect(host.getAttribute("aria-orientation")).toBe("vertical");
    });

    test("reflects orientation attribute", () => {
        const host = render('<lily-scroll-bar label="Timeline scroll" orientation="horizontal"></lily-scroll-bar>');

        expect(host.getAttribute("aria-orientation")).toBe("horizontal");
    });

    test("sets initial value range attributes", () => {
        const host = render('<lily-scroll-bar label="Chat scroll"></lily-scroll-bar>');

        expect(host.getAttribute("aria-valuenow")).toBe("0");
        expect(host.getAttribute("aria-valuemin")).toBe("0");
        expect(host.getAttribute("aria-valuemax")).toBe("100");
    });

    test("renders child thumb content in place", () => {
        const host = render(
            '<lily-scroll-bar label="Chat scroll"><div data-testid="thumb"></div></lily-scroll-bar>',
        );

        expect(host.querySelector('[data-testid="thumb"]')).toBeTruthy();
    });

    test("appends the consumer's class attribute to the base class", () => {
        const host = render('<lily-scroll-bar label="Chat scroll" class="my-extra"></lily-scroll-bar>');

        expect(host.className).toBe("scroll-bar my-extra");
    });
});
