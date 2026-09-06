// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ol> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { ContentsListItem } from "./contents-list-item.js";

if (!customElements.get("lily-contents-list-item")) {
    customElements.define("lily-contents-list-item", ContentsListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ol class="contents-list">' +
    '<lily-contents-list-item><a href="#intro">Introduction</a></lily-contents-list-item>' +
    '<lily-contents-list-item><a href="#background">Background</a></lily-contents-list-item>' +
    '<lily-contents-list-item aria-current="page"><a href="#results">Results</a></lily-contents-list-item>' +
    "</ol>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContentsListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-contents-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-contents-list-item")).toBeNull();
        expect(document.querySelectorAll("li.contents-list-item").length).toBe(3);
    });

    test("the <ol>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ol = document.querySelector("ol.contents-list") as HTMLOListElement;
        const tags = Array.from(ol.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI", "LI"]);
    });

    test("aria-current passes through as a plain rest attribute", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.contents-list-item"));
        expect(items.map((li) => li.getAttribute("aria-current"))).toEqual([null, null, "page"]);
    });

    test("moves the host's children into the <li>", () => {
        renderList();

        const first = document.querySelector("li.contents-list-item") as HTMLLIElement;
        expect(first.querySelector("a")!.getAttribute("href")).toBe("#intro");
        expect(first.textContent).toBe("Introduction");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML = '<ol><lily-contents-list-item class="extra">X</lily-contents-list-item></ol>';

        expect(document.querySelector("li")!.className).toBe("contents-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML =
            '<ol><lily-contents-list-item data-testid="toc">X</lily-contents-list-item></ol>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("toc");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
