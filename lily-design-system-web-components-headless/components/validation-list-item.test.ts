// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ul> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { ValidationListItem } from "./validation-list-item.js";

if (!customElements.get("lily-validation-list-item")) {
    customElements.define("lily-validation-list-item", ValidationListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ul class="validation-list" aria-label="Password rules" aria-live="polite">' +
    '<lily-validation-list-item status="passed">At least 8 characters</lily-validation-list-item>' +
    '<lily-validation-list-item status="failed" label="Needs a number">Contains a number</lily-validation-list-item>' +
    "<lily-validation-list-item>Contains a symbol</lily-validation-list-item>" +
    "</ul>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("ValidationListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-validation-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-validation-list-item")).toBeNull();
        expect(document.querySelectorAll("li.validation-list-item").length).toBe(3);
    });

    test("the <ul>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ul = document.querySelector("ul.validation-list") as HTMLUListElement;
        const tags = Array.from(ul.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI", "LI"]);
    });

    test("data-status defaults to pending and reflects the status prop", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.validation-list-item"));
        expect(items.map((li) => li.getAttribute("data-status"))).toEqual(["passed", "failed", "pending"]);
    });

    test("aria-label is rendered only when label is provided", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.validation-list-item"));
        expect(items[0]!.getAttribute("aria-label")).toBeNull();
        expect(items[1]!.getAttribute("aria-label")).toBe("Needs a number");
    });

    test("moves the host's children into the <li>", () => {
        renderList();

        const first = document.querySelector("li.validation-list-item") as HTMLLIElement;
        expect(first.textContent).toBe("At least 8 characters");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML = '<ul><lily-validation-list-item class="extra">X</lily-validation-list-item></ul>';

        expect(document.querySelector("li")!.className).toBe("validation-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML =
            '<ul><lily-validation-list-item data-testid="rule">X</lily-validation-list-item></ul>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("rule");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
