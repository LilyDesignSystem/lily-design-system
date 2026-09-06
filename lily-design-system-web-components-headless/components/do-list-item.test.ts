// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ul> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { DoListItem } from "./do-list-item.js";

if (!customElements.get("lily-do-list-item")) {
    customElements.define("lily-do-list-item", DoListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ul class="do-list" aria-label="Do">' +
    "<lily-do-list-item>Use descriptive alt text</lily-do-list-item>" +
    "<lily-do-list-item>Provide visible focus indicators</lily-do-list-item>" +
    "<lily-do-list-item>Use sufficient color contrast</lily-do-list-item>" +
    "</ul>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("DoListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-do-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-do-list-item")).toBeNull();
        expect(document.querySelectorAll("li.do-list-item").length).toBe(3);
    });

    test("the <ul>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ul = document.querySelector("ul.do-list") as HTMLUListElement;
        const tags = Array.from(ul.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI", "LI"]);
    });

    test("sets data-recommendation=do on every item", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.do-list-item"));
        expect(items.map((li) => li.getAttribute("data-recommendation"))).toEqual(["do", "do", "do"]);
    });

    test("moves the host's children into the <li>", () => {
        renderList();

        const first = document.querySelector("li.do-list-item") as HTMLLIElement;
        expect(first.textContent).toBe("Use descriptive alt text");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML = '<ul><lily-do-list-item class="extra">X</lily-do-list-item></ul>';

        expect(document.querySelector("li")!.className).toBe("do-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML = '<ul><lily-do-list-item data-testid="rule">X</lily-do-list-item></ul>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("rule");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
