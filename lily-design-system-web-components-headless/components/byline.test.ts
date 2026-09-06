import { afterEach, describe, expect, test } from "vitest";

import { Byline } from "./byline.js";

if (!customElements.get("lily-byline")) {
    customElements.define("lily-byline", Byline);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Byline", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-byline>By Jane Doe</lily-byline>");

        expect(host.className).toBe("byline");
    });

    test("has no aria-label when label is absent", () => {
        const host = render("<lily-byline>By Jane Doe</lily-byline>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as aria-label", () => {
        const host = render('<lily-byline label="Article byline">By Jane Doe</lily-byline>');

        expect(host.getAttribute("aria-label")).toBe("Article byline");
    });

    test("preserves author and time markup as authored", () => {
        const host = render(
            '<lily-byline>By <a rel="author" href="/authors/jane">Jane Doe</a> ' +
                '<time datetime="2026-09-06">6 September 2026</time></lily-byline>',
        );

        expect(host.querySelector("a[rel='author']")!.textContent).toBe("Jane Doe");
        expect(host.querySelector("time")!.getAttribute("datetime")).toBe("2026-09-06");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-byline>By Jane Doe</lily-byline>");

        (host as unknown as Byline).connectedCallback();

        expect(host.className).toBe("byline");
    });
});
