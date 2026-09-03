// P8-T7 gate: the "upgrade in place" pattern must leave a pure
// <ol> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules — the exact rules that flagged
// angular-headless's wrapper-host defect — must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { BreadcrumbList } from "./breadcrumb-list.js";
import { BreadcrumbListItem } from "./breadcrumb-list-item.js";
import { BreadcrumbNav } from "./breadcrumb-nav.js";

if (!customElements.get("lily-breadcrumb-nav")) customElements.define("lily-breadcrumb-nav", BreadcrumbNav);
if (!customElements.get("lily-breadcrumb-list")) customElements.define("lily-breadcrumb-list", BreadcrumbList);
if (!customElements.get("lily-breadcrumb-list-item")) {
    customElements.define("lily-breadcrumb-list-item", BreadcrumbListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const TRAIL =
    '<lily-breadcrumb-nav label="Breadcrumb">' +
    "<lily-breadcrumb-list>" +
    '<lily-breadcrumb-list-item><a href="/">Home</a></lily-breadcrumb-list-item>' +
    '<lily-breadcrumb-list-item><a href="/docs">Docs</a></lily-breadcrumb-list-item>' +
    "<lily-breadcrumb-list-item current>Page</lily-breadcrumb-list-item>" +
    "</lily-breadcrumb-list>" +
    "</lily-breadcrumb-nav>";

function renderTrail(): HTMLElement {
    document.body.innerHTML = TRAIL;
    return document.body.firstElementChild as HTMLElement;
}

describe("BreadcrumbListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-breadcrumb-list-item> remains in the DOM", () => {
        renderTrail();

        expect(document.querySelector("lily-breadcrumb-list-item")).toBeNull();
        expect(document.querySelectorAll("li.breadcrumb-list-item").length).toBe(3);
    });

    test("the <ol>'s direct children are all <li> — no wrapper host between them", () => {
        renderTrail();

        const ol = document.querySelector("ol.breadcrumb-list") as HTMLOListElement;
        const tags = Array.from(ol.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI", "LI"]);
    });

    test("current sets aria-current=page on that <li> only", () => {
        renderTrail();

        const items = Array.from(document.querySelectorAll("li.breadcrumb-list-item"));
        expect(items.map((li) => li.getAttribute("aria-current"))).toEqual([null, null, "page"]);
    });

    test("moves the host's children into the <li>", () => {
        renderTrail();

        const first = document.querySelector("li.breadcrumb-list-item") as HTMLLIElement;
        expect(first.querySelector("a")!.getAttribute("href")).toBe("/");
        expect(first.textContent).toBe("Home");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML =
            '<ol><lily-breadcrumb-list-item class="extra">X</lily-breadcrumb-list-item></ol>';

        expect(document.querySelector("li")!.className).toBe("breadcrumb-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML =
            '<ol><lily-breadcrumb-list-item data-testid="crumb">X</lily-breadcrumb-list-item></ol>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("crumb");
    });

    test("axe: the rendered trail passes the list and listitem rules", async () => {
        renderTrail();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
