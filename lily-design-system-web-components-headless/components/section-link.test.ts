import { afterEach, describe, expect, test } from "vitest";

import { SectionLink } from "./section-link.js";

if (!customElements.get("lily-section-link")) {
    customElements.define("lily-section-link", SectionLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SectionLink", () => {
    test("renders a native anchor with the given href", () => {
        const host = render('<lily-section-link href="/section-1">Section 1</lily-section-link>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("section-link");
        expect(a.getAttribute("href")).toBe("/section-1");
        expect(a.textContent).toBe("Section 1");
    });

    test("sets aria-current=page when current is present", () => {
        const host = render('<lily-section-link href="/section-1" current>Section 1</lily-section-link>');

        expect(host.querySelector("a")!.getAttribute("aria-current")).toBe("page");
    });

    test("does not set aria-current when current is absent", () => {
        const host = render('<lily-section-link href="/section-1">Section 1</lily-section-link>');

        expect(host.querySelector("a")!.hasAttribute("aria-current")).toBe(false);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-section-link href="/x" class="extra">Go</lily-section-link>');

        expect(host.querySelector("a")!.className).toBe("section-link extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-section-link href="/x" data-testid="section-link">Go</lily-section-link>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("section-link");
    });

    test("moves children into the rendered anchor", () => {
        const host = render('<lily-section-link href="/x"><span>Overview</span></lily-section-link>');

        expect(host.querySelector("a > span")!.textContent).toBe("Overview");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-section-link href="/x">Go</lily-section-link>');

        (host as unknown as SectionLink).connectedCallback();

        expect(host.querySelectorAll("a.section-link").length).toBe(1);
    });
});
