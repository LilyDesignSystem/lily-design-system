import { afterEach, describe, expect, test } from "vitest";

import { DontList } from "./dont-list.js";

if (!customElements.get("lily-dont-list")) {
    customElements.define("lily-dont-list", DontList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DontList", () => {
    test("renders a native unordered list", () => {
        const host = render("<lily-dont-list></lily-dont-list>");

        expect(host.querySelector("ul.dont-list")).toBeTruthy();
    });

    test("has role=list", () => {
        const host = render("<lily-dont-list></lily-dont-list>");

        expect(host.querySelector("ul")!.getAttribute("role")).toBe("list");
    });

    test("aria-label defaults to Don't", () => {
        const host = render("<lily-dont-list></lily-dont-list>");

        expect(host.querySelector("ul")!.getAttribute("aria-label")).toBe("Don't");
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-dont-list label="Avoid"></lily-dont-list>');

        expect(host.querySelector("ul")!.getAttribute("aria-label")).toBe("Avoid");
    });

    test("moves its children into the ul", () => {
        const host = render("<lily-dont-list><li>Skip alt text</li></lily-dont-list>");

        expect(host.querySelector("ul > li")!.textContent).toBe("Skip alt text");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-dont-list class="extra"></lily-dont-list>');

        expect(host.querySelector("ul")!.className).toBe("dont-list extra");
    });

    test("passes through rest attributes to the ul", () => {
        const host = render('<lily-dont-list data-testid="dont"></lily-dont-list>');

        expect(host.querySelector("ul")!.getAttribute("data-testid")).toBe("dont");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-dont-list></lily-dont-list>");

        (host as unknown as DontList).connectedCallback();

        expect(host.querySelectorAll("ul").length).toBe(1);
    });
});
