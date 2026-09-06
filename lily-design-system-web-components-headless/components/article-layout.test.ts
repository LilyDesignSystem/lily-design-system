import { afterEach, describe, expect, test } from "vitest";

import { ArticleLayout } from "./article-layout.js";

if (!customElements.get("lily-article-layout")) {
    customElements.define("lily-article-layout", ArticleLayout);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ArticleLayout", () => {
    test("renders a native article", () => {
        const host = render("<lily-article-layout></lily-article-layout>");

        expect(host.querySelector("article.article-layout")).toBeTruthy();
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-article-layout></lily-article-layout>");

        expect(host.querySelector("article")!.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as the accessible name when provided", () => {
        const host = render('<lily-article-layout label="Feature story"></lily-article-layout>');

        expect(host.querySelector("article")!.getAttribute("aria-label")).toBe("Feature story");
    });

    test("moves its children into the article", () => {
        const host = render('<lily-article-layout><p id="body"></p></lily-article-layout>');

        expect(host.querySelector("article > #body")).toBeTruthy();
    });

    test("carries no inline style", () => {
        const host = render("<lily-article-layout></lily-article-layout>");

        expect(host.querySelector("article")!.getAttribute("style")).toBeNull();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-article-layout class="extra"></lily-article-layout>');

        expect(host.querySelector("article")!.className).toBe("article-layout extra");
    });
});
