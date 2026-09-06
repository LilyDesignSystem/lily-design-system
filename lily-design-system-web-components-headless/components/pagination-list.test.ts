import { afterEach, describe, expect, test } from "vitest";

import { PaginationList } from "./pagination-list.js";

if (!customElements.get("lily-pagination-list")) {
    customElements.define("lily-pagination-list", PaginationList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PaginationList", () => {
    test("renders a native ordered list", () => {
        const host = render("<lily-pagination-list></lily-pagination-list>");

        expect(host.querySelector("ol.pagination-list")).toBeTruthy();
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-pagination-list></lily-pagination-list>");

        expect(host.querySelector("ol")!.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-pagination-list label="Pages"></lily-pagination-list>');

        expect(host.querySelector("ol")!.getAttribute("aria-label")).toBe("Pages");
    });

    test("moves its children into the ol", () => {
        const host = render('<lily-pagination-list><li><a href="/page/1">1</a></li></lily-pagination-list>');

        expect(host.querySelector("ol > li")!.textContent).toBe("1");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-pagination-list class="extra"></lily-pagination-list>');

        expect(host.querySelector("ol")!.className).toBe("pagination-list extra");
    });

    test("passes through rest attributes to the ol", () => {
        const host = render('<lily-pagination-list data-testid="pages"></lily-pagination-list>');

        expect(host.querySelector("ol")!.getAttribute("data-testid")).toBe("pages");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-pagination-list></lily-pagination-list>");

        (host as unknown as PaginationList).connectedCallback();

        expect(host.querySelectorAll("ol").length).toBe(1);
    });
});
