import { afterEach, describe, expect, test } from "vitest";

import { GoToTop } from "./go-to-top.js";

if (!customElements.get("lily-go-to-top")) {
    customElements.define("lily-go-to-top", GoToTop);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GoToTop", () => {
    test("defaults href to #top", () => {
        const host = render('<lily-go-to-top label="Back to top"></lily-go-to-top>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("go-to-top");
        expect(a.getAttribute("href")).toBe("#top");
        expect(a.textContent).toBe("Back to top");
    });

    test("allows a configurable href", () => {
        const host = render('<lily-go-to-top href="#main-content" label="Back to top"></lily-go-to-top>');

        expect(host.querySelector("a")!.getAttribute("href")).toBe("#main-content");
    });

    test("consumer can override the accessible name via a plain aria-label rest attribute", () => {
        const host = render(
            '<lily-go-to-top label="↑" aria-label="Back to top of page"></lily-go-to-top>',
        );

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Back to top of page");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-go-to-top label="Top" class="extra"></lily-go-to-top>');

        expect(host.querySelector("a")!.className).toBe("go-to-top extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-go-to-top label="Top" data-testid="go-to-top"></lily-go-to-top>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("go-to-top");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-go-to-top label="Top"></lily-go-to-top>');

        (host as unknown as GoToTop).connectedCallback();

        expect(host.querySelectorAll("a.go-to-top").length).toBe(1);
    });
});
