import { afterEach, describe, expect, test } from "vitest";

import { SectionNav } from "./section-nav.js";

if (!customElements.get("lily-section-nav")) {
    customElements.define("lily-section-nav", SectionNav);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SectionNav", () => {
    test("renders a native nav", () => {
        const host = render('<lily-section-nav label="In this section"></lily-section-nav>');

        expect(host.querySelector("nav.section-nav")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-section-nav label="In this section"></lily-section-nav>');

        expect(host.querySelector("nav")!.getAttribute("aria-label")).toBe("In this section");
    });

    test("moves its children into the nav", () => {
        const host = render(
            '<lily-section-nav label="In this section"><ol><li>Section A</li></ol></lily-section-nav>',
        );

        expect(host.querySelector("nav > ol")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-section-nav label="In this section" class="extra"></lily-section-nav>');

        expect(host.querySelector("nav")!.className).toBe("section-nav extra");
    });

    test("passes through rest attributes to the nav", () => {
        const host = render('<lily-section-nav label="In this section" data-testid="sn"></lily-section-nav>');

        expect(host.querySelector("nav")!.getAttribute("data-testid")).toBe("sn");
    });
});
