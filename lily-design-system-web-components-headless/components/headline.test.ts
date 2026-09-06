import { afterEach, describe, expect, test } from "vitest";

import { Headline } from "./headline.js";

if (!customElements.get("lily-headline")) {
    customElements.define("lily-headline", Headline);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Headline", () => {
    test("renders as itself with the base class", () => {
        const host = render("<lily-headline>Breaking News</lily-headline>");

        expect(host.tagName.toLowerCase()).toBe("lily-headline");
        expect(host.className).toBe("headline");
    });

    test("defaults to an h1 heading", () => {
        const host = render("<lily-headline>Breaking News</lily-headline>");

        const heading = host.querySelector(".headline-heading")!;
        expect(heading.tagName.toLowerCase()).toBe("h1");
        expect(heading.textContent).toBe("Breaking News");
    });

    test("renders the requested heading level", () => {
        const host = render('<lily-headline level="2">Economic Analysis</lily-headline>');

        const heading = host.querySelector(".headline-heading")!;
        expect(heading.tagName.toLowerCase()).toBe("h2");
    });

    test("moves a slot=subtitle child into a subtitle wrapper below the heading", () => {
        const host = render(
            '<lily-headline>Headline text<span slot="subtitle">A supporting dek</span></lily-headline>',
        );

        const subtitle = host.querySelector(".headline-subtitle");
        expect(subtitle).not.toBeNull();
        expect(subtitle!.textContent).toBe("A supporting dek");
        expect(host.querySelector(".headline-heading")!.textContent).toBe("Headline text");
    });

    test("moves a slot=byline child into a byline wrapper below the subtitle", () => {
        const host = render(
            '<lily-headline>Headline<span slot="subtitle">Dek</span><span slot="byline">By Jane Smith</span></lily-headline>',
        );

        const byline = host.querySelector(".headline-byline");
        expect(byline).not.toBeNull();
        expect(byline!.textContent).toBe("By Jane Smith");
    });

    test("omits subtitle and byline wrappers when not provided", () => {
        const host = render("<lily-headline>Headline only</lily-headline>");

        expect(host.querySelector(".headline-subtitle")).toBeNull();
        expect(host.querySelector(".headline-byline")).toBeNull();
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-headline class="editorial">Title</lily-headline>');

        expect(host.className).toBe("headline editorial");
    });
});
