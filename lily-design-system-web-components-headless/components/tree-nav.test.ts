import { afterEach, describe, expect, test } from "vitest";

import { TreeNav } from "./tree-nav.js";
import { TreeList } from "./tree-list.js";

if (!customElements.get("lily-tree-nav")) {
    customElements.define("lily-tree-nav", TreeNav);
}
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

describe("TreeNav", () => {
    test("renders a native nav", () => {
        const host = render('<lily-tree-nav label="Documentation sidebar"></lily-tree-nav>');

        expect(host.querySelector("nav.tree-nav")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tree-nav label="Documentation sidebar"></lily-tree-nav>');

        expect(host.querySelector("nav")!.getAttribute("aria-label")).toBe("Documentation sidebar");
    });

    test("moves its children into the nav", () => {
        const host = render(
            '<lily-tree-nav label="Documentation sidebar"><li role="treeitem" tabindex="0">Getting Started</li></lily-tree-nav>',
        );

        expect(host.querySelector("nav > [role='treeitem']")).toBeTruthy();
    });

    test("composes with a nested TreeList, which owns role=tree and its keyboard navigation", () => {
        const host = render(
            '<lily-tree-nav label="Docs sections">' +
                '<lily-tree-list label="Topics">' +
                '<li role="treeitem" tabindex="0">Getting Started</li>' +
                '<li role="treeitem" tabindex="-1">Components</li>' +
                "</lily-tree-list>" +
                "</lily-tree-nav>",
        );

        const ol = host.querySelector("nav ol.tree-list") as HTMLOListElement;
        expect(ol).toBeTruthy();
        expect(ol.getAttribute("role")).toBe("tree");

        const items = ol.querySelectorAll<HTMLElement>("[role='treeitem']");
        items[0].focus();
        ol.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-tree-nav label="Documentation sidebar" class="extra"></lily-tree-nav>');

        expect(host.querySelector("nav")!.className).toBe("tree-nav extra");
    });

    test("passes through rest attributes to the nav", () => {
        const host = render('<lily-tree-nav label="Documentation sidebar" data-testid="tn"></lily-tree-nav>');

        expect(host.querySelector("nav")!.getAttribute("data-testid")).toBe("tn");
    });
});
