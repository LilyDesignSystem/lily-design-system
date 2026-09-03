import { afterEach, describe, expect, test } from "vitest";

import { Card } from "./card.js";

if (!customElements.get("lily-card")) {
    customElements.define("lily-card", Card);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Card", () => {
    test("renders a native article", () => {
        const host = render("<lily-card>Body content.</lily-card>");

        expect(host.querySelector("article.card")).toBeTruthy();
    });

    test("renders no heading when heading is absent", () => {
        const host = render("<lily-card>Body content.</lily-card>");

        expect(host.querySelector("h2, h3, h4, h5, h6")).toBeNull();
    });

    test("defaults heading-level to 3", () => {
        const host = render('<lily-card heading="Title">Body content.</lily-card>');

        expect(host.querySelector("h3")!.textContent).toBe("Title");
    });

    test("honours an explicit heading-level", () => {
        const host = render('<lily-card heading="Title" heading-level="2">Body content.</lily-card>');

        expect(host.querySelector("h2")!.textContent).toBe("Title");
    });

    test("wraps the heading text in a link when href is given", () => {
        const host = render('<lily-card heading="Title" href="/item/1">Body content.</lily-card>');

        const link = host.querySelector("h3 a") as HTMLAnchorElement;
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/item/1");
        expect(link.textContent).toBe("Title");
    });

    test("uses label as an aria-label override on the article", () => {
        const host = render('<lily-card label="Featured article">Body content.</lily-card>');

        expect(host.querySelector("article")!.getAttribute("aria-label")).toBe("Featured article");
    });

    test("moves original content into the article, after the heading", () => {
        const host = render('<lily-card heading="Title">Body content.</lily-card>');

        const article = host.querySelector("article")!;
        expect(article.textContent).toContain("Title");
        expect(article.textContent).toContain("Body content.");
        expect(article.lastChild!.textContent).toBe("Body content.");
    });
});
