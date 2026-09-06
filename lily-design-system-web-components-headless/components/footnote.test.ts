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
    test("renders a native aside with the correct class", () => {
        const host = render('<lily-footnote id="fn1">Source: Example et al., 2024</lily-footnote>');

        const aside = host.querySelector("aside") as HTMLElement;
        expect(aside).not.toBeNull();
        expect(aside.className).toBe("footnote");
    });

    test("has role=note", () => {
        const host = render('<lily-footnote id="fn1">Content</lily-footnote>');

        expect(host.querySelector("aside")!.getAttribute("role")).toBe("note");
    });

    test("uses the id both as the element id and the aria-label", () => {
        const host = render('<lily-footnote id="fn1">Content</lily-footnote>');

        const aside = host.querySelector("aside")!;
        expect(aside.id).toBe("fn1");
        expect(aside.getAttribute("aria-label")).toBe("fn1");
    });

    test("moves children into the inner aside", () => {
        const host = render('<lily-footnote id="fn1"><a href="#ref1">1.</a> Example, A. (2024).</lily-footnote>');

        const aside = host.querySelector("aside")!;
        expect(aside.querySelector("a")).not.toBeNull();
        expect(aside.textContent).toContain("Example, A. (2024).");
    });

    test("passes through the class hook", () => {
        const host = render('<lily-footnote id="fn1" class="citation">Content</lily-footnote>');

        expect(host.querySelector("aside")!.className).toBe("footnote citation");
    });
});
