// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ul> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { SectionListItem } from "./section-list-item.js";

if (!customElements.get("lily-section-list-item")) {
    customElements.define("lily-section-list-item", SectionListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ul class="section-list" aria-label="Sections">' +
    '<lily-section-list-item><a href="/section/1">Overview</a></lily-section-list-item>' +
    '<lily-section-list-item label="Pricing section"><a href="/section/2">Pricing</a></lily-section-list-item>' +
    '<lily-section-list-item><a href="/section/3">FAQ</a></lily-section-list-item>' +
    "</ul>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("SectionListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-section-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-section-list-item")).toBeNull();
        expect(document.querySelectorAll("li.section-list-item").length).toBe(3);
    });

    test("the <ul>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ul = document.querySelector("ul.section-list") as HTMLUListElement;
        const tags = Array.from(ul.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI", "LI"]);
    });

    test("aria-label is rendered only when label is provided", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.section-list-item"));
        expect(items.map((li) => li.getAttribute("aria-label"))).toEqual([null, "Pricing section", null]);
    });

    test("moves the host's children into the <li>", () => {
        renderList();

        const first = document.querySelector("li.section-list-item") as HTMLLIElement;
        expect(first.querySelector("a")!.getAttribute("href")).toBe("/section/1");
        expect(first.textContent).toBe("Overview");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML = '<ul><lily-section-list-item class="extra">X</lily-section-list-item></ul>';

        expect(document.querySelector("li")!.className).toBe("section-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML =
            '<ul><lily-section-list-item data-testid="section">X</lily-section-list-item></ul>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("section");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
