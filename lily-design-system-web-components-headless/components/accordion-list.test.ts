import { afterEach, describe, expect, test } from "vitest";

import { AccordionList } from "./accordion-list.js";

if (!customElements.get("lily-accordion-list")) {
    customElements.define("lily-accordion-list", AccordionList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const ITEM = '<li class="accordion-list-item"><details><summary>One</summary>Body</details></li>';

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

function list(host: HTMLElement): HTMLOListElement {
    return host.querySelector(":scope > ol.accordion-list") as HTMLOListElement;
}

describe("AccordionList", () => {
    test("renders an <ol> with the base class and no explicit role", () => {
        const host = render("<lily-accordion-list></lily-accordion-list>");

        expect(list(host)).toBeTruthy();
        expect(list(host).hasAttribute("role")).toBe(false);
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-accordion-list></lily-accordion-list>");

        expect(list(host).hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-accordion-list label="Questions"></lily-accordion-list>');

        expect(list(host).getAttribute("aria-label")).toBe("Questions");
        expect(list(host).hasAttribute("label")).toBe(false);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-accordion-list class="extra"></lily-accordion-list>');

        expect(list(host).className).toBe("accordion-list extra");
    });

    test("moves its <li> sections into the <ol>", () => {
        const host = render(`<lily-accordion-list>${ITEM}${ITEM}</lily-accordion-list>`);

        expect(Array.from(list(host).children).map((el) => el.tagName)).toEqual(["LI", "LI"]);
        expect(list(host).querySelector("li > details > summary")?.textContent).toBe("One");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render(`<lily-accordion-list label="Questions">${ITEM}</lily-accordion-list>`);

        (host as unknown as AccordionList).connectedCallback();

        expect(host.querySelectorAll("ol.accordion-list").length).toBe(1);
        expect(list(host).children.length).toBe(1);
    });
});
