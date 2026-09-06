import { afterEach, describe, expect, test } from "vitest";

import { ContentsLink } from "./contents-link.js";

if (!customElements.get("lily-contents-link")) {
    customElements.define("lily-contents-link", ContentsLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContentsLink", () => {
    test("renders a native anchor with the given href", () => {
        const host = render('<lily-contents-link href="#introduction">Introduction</lily-contents-link>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("contents-link");
        expect(a.getAttribute("href")).toBe("#introduction");
        expect(a.textContent).toBe("Introduction");
    });

    test("sets aria-current=true when current is present", () => {
        const host = render('<lily-contents-link href="#introduction" current>Introduction</lily-contents-link>');

        expect(host.querySelector("a")!.getAttribute("aria-current")).toBe("true");
    });

    test("does not set aria-current when current is absent", () => {
        const host = render('<lily-contents-link href="#introduction">Introduction</lily-contents-link>');

        expect(host.querySelector("a")!.hasAttribute("aria-current")).toBe(false);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-contents-link href="#x" class="extra">Go</lily-contents-link>');

        expect(host.querySelector("a")!.className).toBe("contents-link extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-contents-link href="#x" data-testid="contents-link">Go</lily-contents-link>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("contents-link");
    });

    test("moves children into the rendered anchor", () => {
        const host = render('<lily-contents-link href="#x"><span>Chapter 1</span></lily-contents-link>');

        expect(host.querySelector("a > span")!.textContent).toBe("Chapter 1");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-contents-link href="#x">Go</lily-contents-link>');

        (host as unknown as ContentsLink).connectedCallback();

        expect(host.querySelectorAll("a.contents-link").length).toBe(1);
    });
});
