import { afterEach, describe, expect, test } from "vitest";

import { ContentsList } from "./contents-list.js";

if (!customElements.get("lily-contents-list")) {
    customElements.define("lily-contents-list", ContentsList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContentsList", () => {
    test("renders a native ordered list", () => {
        const host = render("<lily-contents-list></lily-contents-list>");

        expect(host.querySelector("ol.contents-list")).toBeTruthy();
    });

    test("moves its children into the ol", () => {
        const host = render('<lily-contents-list><li><a href="#usage">Usage</a></li></lily-contents-list>');

        expect(host.querySelector("ol > li")!.textContent).toBe("Usage");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-contents-list class="extra"></lily-contents-list>');

        expect(host.querySelector("ol")!.className).toBe("contents-list extra");
    });

    test("passes through rest attributes to the ol", () => {
        const host = render('<lily-contents-list data-testid="toc"></lily-contents-list>');

        expect(host.querySelector("ol")!.getAttribute("data-testid")).toBe("toc");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-contents-list></lily-contents-list>");

        (host as unknown as ContentsList).connectedCallback();

        expect(host.querySelectorAll("ol").length).toBe(1);
    });
});
