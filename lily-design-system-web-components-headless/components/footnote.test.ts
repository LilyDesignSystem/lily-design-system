import { afterEach, describe, expect, test } from "vitest";

import { Footnote } from "./footnote.js";

if (!customElements.get("lily-footnote")) {
    customElements.define("lily-footnote", Footnote);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Footnote", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-footnote id="fn1">Source: Example et al., 2024</lily-footnote>');

        const span = host.querySelector("span.footnote") as HTMLElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("footnote");
    });

    test("has role=note", () => {
        const host = render('<lily-footnote id="fn1">Content</lily-footnote>');

        expect(host.querySelector("span.footnote")!.getAttribute("role")).toBe("note");
    });

    test("moves the id to the span, and is not named by it", () => {
        const host = render('<lily-footnote id="fn1">Content</lily-footnote>');

        const span = host.querySelector("span.footnote")!;
        expect(span.id).toBe("fn1");
        expect(host.hasAttribute("id")).toBe(false);
        expect(span.hasAttribute("aria-label")).toBe(false);
    });

    test("moves children into the inner span", () => {
        const host = render(
            '<lily-footnote id="fn1"><a href="#ref1">1.</a> Example, A. (2024).</lily-footnote>',
        );

        const span = host.querySelector("span.footnote")!;
        expect(span.querySelector("a")).not.toBeNull();
        expect(span.textContent).toContain("Example, A. (2024).");
    });

    test("passes through the class hook", () => {
        const host = render('<lily-footnote id="fn1" class="citation">Content</lily-footnote>');

        expect(host.querySelector("span.footnote")!.className).toBe("footnote citation");
    });
});
