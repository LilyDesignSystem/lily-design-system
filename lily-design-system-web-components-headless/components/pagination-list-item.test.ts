// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ol> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { PaginationListItem } from "./pagination-list-item.js";

if (!customElements.get("lily-pagination-list-item")) {
    customElements.define("lily-pagination-list-item", PaginationListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ol class="pagination-list">' +
    '<lily-pagination-list-item><a href="/page/1">1</a></lily-pagination-list-item>' +
    '<lily-pagination-list-item><a href="/page/2" aria-current="page">2</a></lily-pagination-list-item>' +
    '<lily-pagination-list-item><a href="/page/3">3</a></lily-pagination-list-item>' +
    "</ol>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("PaginationListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-pagination-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-pagination-list-item")).toBeNull();
        expect(document.querySelectorAll("li.pagination-list-item").length).toBe(3);
    });

    test("the <ol>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ol = document.querySelector("ol.pagination-list") as HTMLOListElement;
        const tags = Array.from(ol.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI", "LI"]);
    });

    test("moves the host's children into the <li>", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.pagination-list-item"));
        expect(items[1]!.querySelector("a")!.getAttribute("aria-current")).toBe("page");
        expect(items[0]!.textContent).toBe("1");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML = '<ol><lily-pagination-list-item class="extra">X</lily-pagination-list-item></ol>';

        expect(document.querySelector("li")!.className).toBe("pagination-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML =
            '<ol><lily-pagination-list-item data-testid="page">X</lily-pagination-list-item></ol>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("page");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
