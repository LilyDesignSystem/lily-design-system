import { afterEach, describe, expect, test } from "vitest";

import { IconList } from "./icon-list.js";

if (!customElements.get("lily-icon-list")) {
    customElements.define("lily-icon-list", IconList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("IconList", () => {
    test("renders a native unordered list", () => {
        const host = render("<lily-icon-list></lily-icon-list>");

        expect(host.querySelector("ul.icon-list")).toBeTruthy();
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-icon-list></lily-icon-list>");

        expect(host.querySelector("ul")!.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-icon-list label="Features"></lily-icon-list>');

        expect(host.querySelector("ul")!.getAttribute("aria-label")).toBe("Features");
    });

    test("moves its children into the ul", () => {
        const host = render("<lily-icon-list><li>Fast</li></lily-icon-list>");

        expect(host.querySelector("ul > li")!.textContent).toBe("Fast");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-icon-list class="extra"></lily-icon-list>');

        expect(host.querySelector("ul")!.className).toBe("icon-list extra");
    });

    test("passes through rest attributes to the ul", () => {
        const host = render('<lily-icon-list data-testid="features"></lily-icon-list>');

        expect(host.querySelector("ul")!.getAttribute("data-testid")).toBe("features");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-icon-list></lily-icon-list>");

        (host as unknown as IconList).connectedCallback();

        expect(host.querySelectorAll("ul").length).toBe(1);
    });
});
