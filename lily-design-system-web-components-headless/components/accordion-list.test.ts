import { afterEach, describe, expect, test } from "vitest";

import { AccordionList } from "./accordion-list.js";

if (!customElements.get("lily-accordion-list")) {
    customElements.define("lily-accordion-list", AccordionList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AccordionList", () => {
    test("the custom element itself carries the base class (self-is-the-wrapper)", () => {
        const host = render("<lily-accordion-list></lily-accordion-list>");

        expect(host.className).toBe("accordion-list");
    });

    test("has role=group, not list semantics", () => {
        const host = render("<lily-accordion-list></lily-accordion-list>");

        expect(host.getAttribute("role")).toBe("group");
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-accordion-list></lily-accordion-list>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-accordion-list label="Questions"></lily-accordion-list>');

        expect(host.getAttribute("aria-label")).toBe("Questions");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-accordion-list class="extra"></lily-accordion-list>');

        expect(host.className).toBe("accordion-list extra");
    });

    test("does not move or wrap its children — they stay as direct children", () => {
        const host = render("<lily-accordion-list><details>One</details></lily-accordion-list>");

        expect(host.querySelector(":scope > details")).toBeTruthy();
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-accordion-list label="Questions"></lily-accordion-list>');

        (host as unknown as AccordionList).connectedCallback();

        expect(host.getAttribute("aria-label")).toBe("Questions");
        expect(host.className).toBe("accordion-list");
    });
});
