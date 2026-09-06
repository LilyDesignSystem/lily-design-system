import { afterEach, describe, expect, test } from "vitest";

import { TreeMenu } from "./tree-menu.js";

if (!customElements.get("lily-tree-menu")) {
    customElements.define("lily-tree-menu", TreeMenu);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

function treeMarkup(): string {
    return (
        '<lily-tree-menu label="File actions">' +
        '<li role="treeitem" tabindex="0">File</li>' +
        '<li role="treeitem" tabindex="-1">Edit</li>' +
        '<li role="treeitem" tabindex="-1">Help</li>' +
        "</lily-tree-menu>"
    );
}

describe("TreeMenu", () => {
    test("renders itself with the base class and role=tree", () => {
        const host = render(treeMarkup());

        expect(host.classList.contains("tree-menu")).toBe(true);
        expect(host.getAttribute("role")).toBe("tree");
    });

    test("uses label as the accessible name", () => {
        const host = render(treeMarkup());

        expect(host.getAttribute("aria-label")).toBe("File actions");
    });

    test("renders tree item children in place", () => {
        const host = render(treeMarkup());

        expect(host.querySelectorAll("[role='treeitem']").length).toBe(3);
    });

    test("ArrowDown moves focus to the next tree item, wrapping to the first", () => {
        const host = render(treeMarkup());
        const items = host.querySelectorAll<HTMLElement>("[role='treeitem']");
        items[0].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[2]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("ArrowUp moves focus to the previous tree item, wrapping to the last", () => {
        const host = render(treeMarkup());
        const items = host.querySelectorAll<HTMLElement>("[role='treeitem']");
        items[0].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        expect(document.activeElement).toBe(items[2]);
    });

    test("Home and End jump to the first and last tree items", () => {
        const host = render(treeMarkup());
        const items = host.querySelectorAll<HTMLElement>("[role='treeitem']");
        items[1].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(document.activeElement).toBe(items[2]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("appends the consumer's class attribute to the base class", () => {
        const host = render('<lily-tree-menu label="File actions" class="my-extra"></lily-tree-menu>');

        expect(host.className).toBe("tree-menu my-extra");
    });
});
