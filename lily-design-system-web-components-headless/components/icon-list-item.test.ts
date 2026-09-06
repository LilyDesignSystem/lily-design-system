// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ul> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { IconListItem } from "./icon-list-item.js";

if (!customElements.get("lily-icon-list-item")) {
    customElements.define("lily-icon-list-item", IconListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ul class="icon-list" aria-label="Benefits">' +
    '<lily-icon-list-item><span slot="icon">★</span>Fast</lily-icon-list-item>' +
    "<lily-icon-list-item>No icon here</lily-icon-list-item>" +
    "</ul>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("IconListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-icon-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-icon-list-item")).toBeNull();
        expect(document.querySelectorAll("li.icon-list-item").length).toBe(2);
    });

    test("the <ul>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ul = document.querySelector("ul.icon-list") as HTMLUListElement;
        const tags = Array.from(ul.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI"]);
    });

    test("icon span renders only when the icon slot is provided, and is aria-hidden", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.icon-list-item"));
        const iconSpan = items[0]!.querySelector("span.icon-list-item-icon")!;
        expect(iconSpan.getAttribute("aria-hidden")).toBe("true");
        expect(iconSpan.textContent).toBe("★");
        expect(iconSpan.hasAttribute("slot")).toBe(false);

        expect(items[1]!.querySelector("span.icon-list-item-icon")).toBeNull();
    });

    test("remaining content moves into the text span", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.icon-list-item"));
        expect(items[0]!.querySelector("span.icon-list-item-text")!.textContent).toBe("Fast");
        expect(items[1]!.querySelector("span.icon-list-item-text")!.textContent).toBe("No icon here");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML = '<ul><lily-icon-list-item class="extra">X</lily-icon-list-item></ul>';

        expect(document.querySelector("li")!.className).toBe("icon-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML = '<ul><lily-icon-list-item data-testid="benefit">X</lily-icon-list-item></ul>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("benefit");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
