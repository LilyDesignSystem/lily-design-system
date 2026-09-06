// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ul> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { CollectionListItem } from "./collection-list-item.js";

if (!customElements.get("lily-collection-list-item")) {
    customElements.define("lily-collection-list-item", CollectionListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ul class="collection-list" aria-label="Articles">' +
    '<lily-collection-list-item heading="First article" href="/articles/1" meta="Jan 2026" description="A short summary."></lily-collection-list-item>' +
    '<lily-collection-list-item heading="Second article" image-url="/img/2.png" image-alt="Cover"><p>Extra body content.</p></lily-collection-list-item>' +
    '<lily-collection-list-item heading="Third article" label="Third article override"></lily-collection-list-item>' +
    "</ul>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("CollectionListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-collection-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-collection-list-item")).toBeNull();
        expect(document.querySelectorAll("li.collection-list-item").length).toBe(3);
    });

    test("the <ul>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ul = document.querySelector("ul.collection-list") as HTMLUListElement;
        const tags = Array.from(ul.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI", "LI"]);
    });

    test("heading renders inside an <h3>, wrapped in <a> when href is provided", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.collection-list-item"));
        const first = items[0]!.querySelector("h3.collection-list-item-heading")!;
        expect(first.querySelector("a")!.getAttribute("href")).toBe("/articles/1");
        expect(first.textContent).toBe("First article");

        const second = items[1]!.querySelector("h3.collection-list-item-heading")!;
        expect(second.querySelector("a")).toBeNull();
        expect(second.textContent).toBe("Second article");
    });

    test("meta and description render only when provided", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.collection-list-item"));
        expect(items[0]!.querySelector("p.collection-list-item-meta")!.textContent).toBe("Jan 2026");
        expect(items[0]!.querySelector("p.collection-list-item-description")!.textContent).toBe(
            "A short summary.",
        );
        expect(items[1]!.querySelector("p.collection-list-item-meta")).toBeNull();
        expect(items[1]!.querySelector("p.collection-list-item-description")).toBeNull();
    });

    test("image renders only when image-url is provided", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.collection-list-item"));
        expect(items[0]!.querySelector("img.collection-list-item-image")).toBeNull();
        const img = items[1]!.querySelector("img.collection-list-item-image") as HTMLImageElement;
        expect(img.getAttribute("src")).toBe("/img/2.png");
        expect(img.getAttribute("alt")).toBe("Cover");
    });

    test("extra children render after the description", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.collection-list-item"));
        expect(items[1]!.querySelector("p")!.textContent).toBe("Extra body content.");
    });

    test("aria-label is rendered only when label is provided", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.collection-list-item"));
        expect(items[0]!.getAttribute("aria-label")).toBeNull();
        expect(items[2]!.getAttribute("aria-label")).toBe("Third article override");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML =
            '<ul><lily-collection-list-item class="extra" heading="X"></lily-collection-list-item></ul>';

        expect(document.querySelector("li")!.className).toBe("collection-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML =
            '<ul><lily-collection-list-item data-testid="entry" heading="X"></lily-collection-list-item></ul>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("entry");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
