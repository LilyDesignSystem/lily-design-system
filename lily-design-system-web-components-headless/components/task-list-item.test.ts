// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ol> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { TaskListItem } from "./task-list-item.js";

if (!customElements.get("lily-task-list-item")) {
    customElements.define("lily-task-list-item", TaskListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ol class="task-list" aria-label="Today\'s tasks" role="list">' +
    '<lily-task-list-item label="Review pull request"></lily-task-list-item>' +
    '<lily-task-list-item label="Update documentation" checked></lily-task-list-item>' +
    '<lily-task-list-item label="Archived task" checked disabled></lily-task-list-item>' +
    "</ol>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("TaskListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-task-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-task-list-item")).toBeNull();
        expect(document.querySelectorAll("li.task-list-item").length).toBe(3);
    });

    test("the <ol>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ol = document.querySelector("ol.task-list") as HTMLOListElement;
        const tags = Array.from(ol.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI", "LI"]);
    });

    test("data-checked and data-disabled reflect the checked/disabled attributes", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.task-list-item"));
        expect(items.map((li) => li.getAttribute("data-checked"))).toEqual(["false", "true", "true"]);
        expect(items.map((li) => li.getAttribute("data-disabled"))).toEqual([null, null, "true"]);
    });

    test("renders a real checkbox wrapped in a <label> carrying the label text", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.task-list-item"));
        const first = items[0]!.querySelector("input[type=checkbox]") as HTMLInputElement;
        expect(first.checked).toBe(false);
        expect(first.disabled).toBe(false);
        expect(items[0]!.querySelector("label")!.textContent).toBe("Review pull request");

        const second = items[1]!.querySelector("input[type=checkbox]") as HTMLInputElement;
        expect(second.checked).toBe(true);

        const third = items[2]!.querySelector("input[type=checkbox]") as HTMLInputElement;
        expect(third.checked).toBe(true);
        expect(third.disabled).toBe(true);
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML = '<ol><lily-task-list-item class="extra" label="X"></lily-task-list-item></ol>';

        expect(document.querySelector("li")!.className).toBe("task-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML =
            '<ol><lily-task-list-item data-testid="task" label="X"></lily-task-list-item></ol>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("task");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
