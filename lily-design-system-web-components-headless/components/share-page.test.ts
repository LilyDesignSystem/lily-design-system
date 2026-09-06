import { afterEach, describe, expect, test } from "vitest";

import { SharePage } from "./share-page.js";

if (!customElements.get("lily-share-page")) {
    customElements.define("lily-share-page", SharePage);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SharePage", () => {
    test("carries the base class", () => {
        const host = render('<lily-share-page label="Share this page"></lily-share-page>');

        expect(host.classList.contains("share-page")).toBe(true);
    });

    test("has role=group", () => {
        const host = render('<lily-share-page label="Share this page"></lily-share-page>');

        expect(host.getAttribute("role")).toBe("group");
    });

    test("sets aria-label when label is provided", () => {
        const host = render('<lily-share-page label="Share this page"></lily-share-page>');

        expect(host.getAttribute("aria-label")).toBe("Share this page");
    });

    test("omits aria-label when label is absent", () => {
        const host = render("<lily-share-page></lily-share-page>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps consumer-supplied share controls in place", () => {
        const host = render(
            '<lily-share-page label="Share this page"><a href="mailto:?body=url" aria-label="Share on email">Email</a></lily-share-page>',
        );

        expect(host.querySelector("a[aria-label='Share on email']")).toBeTruthy();
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-share-page label="Share this page" class="my-share"></lily-share-page>');

        expect(host.getAttribute("class")).toBe("share-page my-share");
    });
});
