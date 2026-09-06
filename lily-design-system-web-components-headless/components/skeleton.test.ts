import { afterEach, describe, expect, test } from "vitest";

import { Skeleton } from "./skeleton.js";

if (!customElements.get("lily-skeleton")) {
    customElements.define("lily-skeleton", Skeleton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Skeleton", () => {
    test("carries the base class", () => {
        const host = render("<lily-skeleton></lily-skeleton>");

        expect(host.classList.contains("skeleton")).toBe(true);
    });

    test("is hidden from screen readers", () => {
        const host = render("<lily-skeleton></lily-skeleton>");

        expect(host.getAttribute("aria-hidden")).toBe("true");
    });

    test("signals a busy/loading state", () => {
        const host = render("<lily-skeleton></lily-skeleton>");

        expect(host.getAttribute("aria-busy")).toBe("true");
    });

    test("renders an empty div when no placeholder shapes are provided", () => {
        const host = render("<lily-skeleton></lily-skeleton>");

        expect(host.childNodes.length).toBe(0);
    });

    test("keeps optional placeholder shape children in place", () => {
        const host = render('<lily-skeleton><div class="skeleton-line"></div></lily-skeleton>');

        expect(host.querySelector(".skeleton-line")).toBeTruthy();
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-skeleton class="my-skeleton"></lily-skeleton>');

        expect(host.getAttribute("class")).toBe("skeleton my-skeleton");
    });
});
