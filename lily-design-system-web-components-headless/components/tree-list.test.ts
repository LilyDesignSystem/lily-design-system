import { afterEach, describe, expect, test } from "vitest";

import { TreeList } from "./tree-list.js";

if (!customElements.get("lily-tree-list")) {
    customElements.define("lily-tree-list", TreeList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TreeList", () => {
    test("renders a native ordered list with role=tree", () => {
        const host = render('<lily-tree-list label="File browser"></lily-tree-list>');

        const ol = host.querySelector("ol.tree-list") as HTMLOListElement;
        expect(ol).toBeTruthy();
        expect(ol.getAttribute("role")).toBe("tree");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tree-list label="File browser"></lily-tree-list>');

        expect(host.querySelector("ol")!.getAttribute("aria-label")).toBe("File browser");
    });

    test("moves its children into the ol", () => {
        const host = render(
            '<lily-tree-list label="File browser"><li role="treeitem" tabindex="0">Documents</li></lily-tree-list>',
        );

        expect(host.querySelector("ol > li")!.textContent).toBe("Documents");
    });

    test("ArrowDown moves focus to the next tree item, wrapping to the first", () => {
        const host = render(
            '<lily-tree-list label="File browser">' +
                '<li role="treeitem" tabindex="0">Documents</li>' +
                '<li role="treeitem" tabindex="-1">Photos</li>' +
                "</lily-tree-list>",
        );
        const ol = host.querySelector("ol")!;
        const items = ol.querySelectorAll<HTMLElement>("[role='treeitem']");
        items[0].focus();

        ol.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);

        ol.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("ArrowUp moves focus to the previous tree item, wrapping to the last", () => {
        const host = render(
            '<lily-tree-list label="File browser">' +
                '<li role="treeitem" tabindex="0">Documents</li>' +
                '<li role="treeitem" tabindex="-1">Photos</li>' +
                "</lily-tree-list>",
        );
        const ol = host.querySelector("ol")!;
        const items = ol.querySelectorAll<HTMLElement>("[role='treeitem']");
        items[0].focus();

        ol.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);
    });

    test("Home and End jump to the first and last tree items", () => {
        const host = render(
            '<lily-tree-list label="File browser">' +
                '<li role="treeitem" tabindex="0">Documents</li>' +
                '<li role="treeitem" tabindex="-1">Photos</li>' +
                '<li role="treeitem" tabindex="-1">Videos</li>' +
                "</lily-tree-list>",
        );
        const ol = host.querySelector("ol")!;
        const items = ol.querySelectorAll<HTMLElement>("[role='treeitem']");
        items[1].focus();

        ol.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(document.activeElement).toBe(items[2]);

        ol.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-tree-list label="File browser" class="extra"></lily-tree-list>');

        expect(host.querySelector("ol")!.className).toBe("tree-list extra");
    });

    test("passes through rest attributes to the ol", () => {
        const host = render('<lily-tree-list label="File browser" data-testid="tree"></lily-tree-list>');

        expect(host.querySelector("ol")!.getAttribute("data-testid")).toBe("tree");
    });
});
