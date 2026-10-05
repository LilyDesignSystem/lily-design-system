import { afterEach, describe, expect, test } from "vitest";

import { ShowMore } from "./show-more.js";

if (!customElements.get("lily-show-more")) {
    customElements.define("lily-show-more", ShowMore);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const BASE = '<lily-show-more more-label="Show more" less-label="Show less"><p>Long text</p></lily-show-more>';

describe("ShowMore", () => {
    test("root carries the show-more class", () => {
        expect(render(BASE).className).toBe("show-more");
    });

    test("collapsed by default: moreLabel, aria-expanded=false, data-expanded=false", () => {
        const host = render(BASE);
        const button = host.querySelector("button.show-more-button")!;
        expect(button.textContent).toBe("Show more");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(host.querySelector(".show-more-content")!.getAttribute("data-expanded")).toBe("false");
    });

    test("content stays in the DOM and accessibility tree while collapsed", () => {
        const content = render(BASE).querySelector(".show-more-content") as HTMLElement;
        expect(content.querySelector("p")!.textContent).toBe("Long text");
        expect(content.hasAttribute("hidden")).toBe(false);
        expect(content.hasAttribute("aria-hidden")).toBe(false);
    });

    test("clicking expands: lessLabel, aria-expanded=true, data-expanded=true", () => {
        const host = render(BASE);
        const button = host.querySelector("button")!;
        button.click();
        expect(button.textContent).toBe("Show less");
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(host.querySelector(".show-more-content")!.getAttribute("data-expanded")).toBe("true");
        expect(host.hasAttribute("expanded")).toBe(true);
    });

    test("clicking again collapses", () => {
        const host = render(BASE);
        const button = host.querySelector("button")!;
        button.click();
        button.click();
        expect(button.textContent).toBe("Show more");
        expect(host.hasAttribute("expanded")).toBe(false);
    });

    test("expanded attribute sets the initial state", () => {
        const host = render(
            '<lily-show-more more-label="More" less-label="Less" expanded>x</lily-show-more>',
        );
        expect(host.querySelector("button")!.textContent).toBe("Less");
    });

    test("the button is a native type=button (keyboard comes from it)", () => {
        const button = render(BASE).querySelector("button")!;
        expect(button.tagName).toBe("BUTTON");
        expect(button.type).toBe("button");
    });

    test("aria-controls points at the content element id", () => {
        const host = render(BASE);
        const id = host.querySelector(".show-more-content")!.id;
        expect(id).not.toBe("");
        expect(host.querySelector("button")!.getAttribute("aria-controls")).toBe(id);
    });

    test("content has no inline style", () => {
        expect(render(BASE).querySelector(".show-more-content")!.hasAttribute("style")).toBe(false);
    });

    test("passes through attributes and consumer class", () => {
        const host = render(
            '<lily-show-more more-label="M" less-label="L" data-testid="x" class="extra">x</lily-show-more>',
        );
        expect(host.getAttribute("data-testid")).toBe("x");
        expect(host.className).toBe("show-more extra");
    });
});
