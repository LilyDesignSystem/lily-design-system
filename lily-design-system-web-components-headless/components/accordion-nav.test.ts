import { afterEach, describe, expect, test } from "vitest";

import { AccordionNav } from "./accordion-nav.js";

if (!customElements.get("lily-accordion-nav")) {
    customElements.define("lily-accordion-nav", AccordionNav);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AccordionNav", () => {
    test("renders a native nav landmark", () => {
        const host = render('<lily-accordion-nav label="FAQ"></lily-accordion-nav>');

        expect(host.querySelector("nav.accordion-nav")).toBeTruthy();
    });

    test("uses label as the landmark's accessible name", () => {
        const host = render('<lily-accordion-nav label="FAQ"></lily-accordion-nav>');

        expect(host.querySelector("nav")!.getAttribute("aria-label")).toBe("FAQ");
    });

    test("does not add role=region, keeping the implicit navigation role", () => {
        const host = render('<lily-accordion-nav label="FAQ"></lily-accordion-nav>');

        expect(host.querySelector("nav")!.hasAttribute("role")).toBe(false);
    });

    test("moves its children into the nav", () => {
        const host = render('<lily-accordion-nav label="FAQ"><div id="list"></div></lily-accordion-nav>');

        expect(host.querySelector("nav > #list")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-accordion-nav label="FAQ" class="extra"></lily-accordion-nav>');

        expect(host.querySelector("nav")!.className).toBe("accordion-nav extra");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-accordion-nav label="FAQ"></lily-accordion-nav>');

        (host as unknown as AccordionNav).connectedCallback();

        expect(host.querySelectorAll("nav").length).toBe(1);
    });
});
