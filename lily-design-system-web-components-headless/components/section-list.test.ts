import { afterEach, describe, expect, test } from "vitest";

import { SectionList } from "./section-list.js";

if (!customElements.get("lily-section-list")) {
    customElements.define("lily-section-list", SectionList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SectionList", () => {
    test("renders a native unordered list", () => {
        const host = render("<lily-section-list></lily-section-list>");

        expect(host.querySelector("ul.section-list")).toBeTruthy();
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-section-list></lily-section-list>");

        expect(host.querySelector("ul")!.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-section-list label="Chapters"></lily-section-list>');

        expect(host.querySelector("ul")!.getAttribute("aria-label")).toBe("Chapters");
    });

    test("moves its children into the ul", () => {
        const host = render('<lily-section-list><li><a href="/intro">Introduction</a></li></lily-section-list>');

        expect(host.querySelector("ul > li")!.textContent).toBe("Introduction");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-section-list class="extra"></lily-section-list>');

        expect(host.querySelector("ul")!.className).toBe("section-list extra");
    });

    test("passes through rest attributes to the ul", () => {
        const host = render('<lily-section-list data-testid="chapters"></lily-section-list>');

        expect(host.querySelector("ul")!.getAttribute("data-testid")).toBe("chapters");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-section-list></lily-section-list>");

        (host as unknown as SectionList).connectedCallback();

        expect(host.querySelectorAll("ul").length).toBe(1);
    });
});
