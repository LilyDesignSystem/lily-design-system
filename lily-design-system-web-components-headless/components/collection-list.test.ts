import { afterEach, describe, expect, test } from "vitest";

import { CollectionList } from "./collection-list.js";

if (!customElements.get("lily-collection-list")) {
    customElements.define("lily-collection-list", CollectionList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CollectionList", () => {
    test("renders a native unordered list", () => {
        const host = render("<lily-collection-list></lily-collection-list>");

        expect(host.querySelector("ul.collection-list")).toBeTruthy();
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-collection-list></lily-collection-list>");

        expect(host.querySelector("ul")!.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-collection-list label="Recent articles"></lily-collection-list>');

        expect(host.querySelector("ul")!.getAttribute("aria-label")).toBe("Recent articles");
    });

    test("moves its children into the ul", () => {
        const host = render("<lily-collection-list><li>Article one</li></lily-collection-list>");

        expect(host.querySelector("ul > li")!.textContent).toBe("Article one");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-collection-list class="extra"></lily-collection-list>');

        expect(host.querySelector("ul")!.className).toBe("collection-list extra");
    });

    test("passes through rest attributes to the ul", () => {
        const host = render('<lily-collection-list data-testid="collection"></lily-collection-list>');

        expect(host.querySelector("ul")!.getAttribute("data-testid")).toBe("collection");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-collection-list></lily-collection-list>");

        (host as unknown as CollectionList).connectedCallback();

        expect(host.querySelectorAll("ul").length).toBe(1);
    });
});
