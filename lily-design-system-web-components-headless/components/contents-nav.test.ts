import { afterEach, describe, expect, test } from "vitest";

import { ContentsNav } from "./contents-nav.js";

if (!customElements.get("lily-contents-nav")) {
    customElements.define("lily-contents-nav", ContentsNav);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContentsNav", () => {
    test("renders a native nav landmark", () => {
        const host = render('<lily-contents-nav label="Contents"></lily-contents-nav>');

        expect(host.querySelector("nav.contents-nav")).toBeTruthy();
    });

    test("uses label as the landmark's accessible name", () => {
        const host = render('<lily-contents-nav label="Contents"></lily-contents-nav>');

        expect(host.querySelector("nav")!.getAttribute("aria-label")).toBe("Contents");
    });

    test("moves its children into the nav", () => {
        const host = render('<lily-contents-nav label="Contents"><ol id="list"></ol></lily-contents-nav>');

        expect(host.querySelector("nav > #list")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-contents-nav label="Contents" class="extra"></lily-contents-nav>');

        expect(host.querySelector("nav")!.className).toBe("contents-nav extra");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-contents-nav label="Contents"></lily-contents-nav>');

        (host as unknown as ContentsNav).connectedCallback();

        expect(host.querySelectorAll("nav").length).toBe(1);
    });
});
