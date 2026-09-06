import { afterEach, describe, expect, test } from "vitest";

import { TreeLink } from "./tree-link.js";

if (!customElements.get("lily-tree-link")) {
    customElements.define("lily-tree-link", TreeLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TreeLink", () => {
    test("renders a native anchor with the given href", () => {
        const host = render('<lily-tree-link href="/folder/file.txt">file.txt</lily-tree-link>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("tree-link");
        expect(a.getAttribute("href")).toBe("/folder/file.txt");
        expect(a.textContent).toBe("file.txt");
    });

    test("uses label as an aria-label override", () => {
        const host = render(
            '<lily-tree-link href="/folder/file.txt" label="Open file.txt">file.txt</lily-tree-link>',
        );

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Open file.txt");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-tree-link href="/x" class="extra">Go</lily-tree-link>');

        expect(host.querySelector("a")!.className).toBe("tree-link extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-tree-link href="/x" data-testid="tree-link">Go</lily-tree-link>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("tree-link");
    });

    test("moves children into the rendered anchor", () => {
        const host = render('<lily-tree-link href="/x"><span>Node</span></lily-tree-link>');

        expect(host.querySelector("a > span")!.textContent).toBe("Node");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-tree-link href="/x">Go</lily-tree-link>');

        (host as unknown as TreeLink).connectedCallback();

        expect(host.querySelectorAll("a.tree-link").length).toBe(1);
    });
});
