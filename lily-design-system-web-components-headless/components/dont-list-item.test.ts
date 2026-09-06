// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ul> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { DontListItem } from "./dont-list-item.js";

if (!customElements.get("lily-dont-list-item")) {
    customElements.define("lily-dont-list-item", DontListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ul class="dont-list" aria-label="Don\'t">' +
    "<lily-dont-list-item>Use color alone to convey meaning</lily-dont-list-item>" +
    "<lily-dont-list-item>Remove focus outlines without replacement</lily-dont-list-item>" +
    "<lily-dont-list-item>Rely solely on placeholder text as labels</lily-dont-list-item>" +
    "</ul>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("DontListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-dont-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-dont-list-item")).toBeNull();
        expect(document.querySelectorAll("li.dont-list-item").length).toBe(3);
    });

    test("the <ul>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ul = document.querySelector("ul.dont-list") as HTMLUListElement;
        const tags = Array.from(ul.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI", "LI"]);
    });

    test("sets data-recommendation=dont on every item", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.dont-list-item"));
        expect(items.map((li) => li.getAttribute("data-recommendation"))).toEqual(["dont", "dont", "dont"]);
    });

    test("moves the host's children into the <li>", () => {
        renderList();

        const first = document.querySelector("li.dont-list-item") as HTMLLIElement;
        expect(first.textContent).toBe("Use color alone to convey meaning");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML = '<ul><lily-dont-list-item class="extra">X</lily-dont-list-item></ul>';

        expect(document.querySelector("li")!.className).toBe("dont-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML = '<ul><lily-dont-list-item data-testid="rule">X</lily-dont-list-item></ul>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("rule");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
