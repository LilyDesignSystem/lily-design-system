import { afterEach, describe, expect, test } from "vitest";

import { AccordionLink } from "./accordion-link.js";

if (!customElements.get("lily-accordion-link")) {
    customElements.define("lily-accordion-link", AccordionLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AccordionLink", () => {
    test("renders a native anchor with the given href", () => {
        const host = render('<lily-accordion-link href="#section-1">Section 1</lily-accordion-link>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("accordion-link");
        expect(a.getAttribute("href")).toBe("#section-1");
        expect(a.textContent).toBe("Section 1");
    });

    test("uses label as an aria-label override", () => {
        const host = render(
            '<lily-accordion-link href="#section-1" label="Expand section 1">Section 1</lily-accordion-link>',
        );

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Expand section 1");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-accordion-link href="#x" class="extra">Go</lily-accordion-link>');

        expect(host.querySelector("a")!.className).toBe("accordion-link extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-accordion-link href="#x" data-testid="accordion-link">Go</lily-accordion-link>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("accordion-link");
    });

    test("moves children into the rendered anchor", () => {
        const host = render('<lily-accordion-link href="#x"><span>Details</span></lily-accordion-link>');

        expect(host.querySelector("a > span")!.textContent).toBe("Details");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-accordion-link href="#x">Go</lily-accordion-link>');

        (host as unknown as AccordionLink).connectedCallback();

        expect(host.querySelectorAll("a.accordion-link").length).toBe(1);
    });
});
