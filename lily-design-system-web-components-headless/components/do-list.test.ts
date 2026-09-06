import { afterEach, describe, expect, test } from "vitest";

import { DoList } from "./do-list.js";

if (!customElements.get("lily-do-list")) {
    customElements.define("lily-do-list", DoList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DoList", () => {
    test("renders a native unordered list", () => {
        const host = render("<lily-do-list></lily-do-list>");

        expect(host.querySelector("ul.do-list")).toBeTruthy();
    });

    test("has role=list", () => {
        const host = render("<lily-do-list></lily-do-list>");

        expect(host.querySelector("ul")!.getAttribute("role")).toBe("list");
    });

    test("aria-label defaults to Do", () => {
        const host = render("<lily-do-list></lily-do-list>");

        expect(host.querySelector("ul")!.getAttribute("aria-label")).toBe("Do");
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-do-list label="Recommended"></lily-do-list>');

        expect(host.querySelector("ul")!.getAttribute("aria-label")).toBe("Recommended");
    });

    test("moves its children into the ul", () => {
        const host = render("<lily-do-list><li>Write clear labels</li></lily-do-list>");

        expect(host.querySelector("ul > li")!.textContent).toBe("Write clear labels");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-do-list class="extra"></lily-do-list>');

        expect(host.querySelector("ul")!.className).toBe("do-list extra");
    });

    test("passes through rest attributes to the ul", () => {
        const host = render('<lily-do-list data-testid="do"></lily-do-list>');

        expect(host.querySelector("ul")!.getAttribute("data-testid")).toBe("do");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-do-list></lily-do-list>");

        (host as unknown as DoList).connectedCallback();

        expect(host.querySelectorAll("ul").length).toBe(1);
    });
});
