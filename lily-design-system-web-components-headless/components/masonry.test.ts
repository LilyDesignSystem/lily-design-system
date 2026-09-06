import { afterEach, describe, expect, test } from "vitest";

import { Masonry } from "./masonry.js";

if (!customElements.get("lily-masonry")) {
    customElements.define("lily-masonry", Masonry);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Masonry", () => {
    test("renders as itself with the base class", () => {
        const host = render("<lily-masonry></lily-masonry>");

        expect(host.tagName.toLowerCase()).toBe("lily-masonry");
        expect(host.className).toBe("masonry");
    });

    test("defaults data-columns to 3 and data-gap to 1rem", () => {
        const host = render("<lily-masonry></lily-masonry>");

        expect(host.getAttribute("data-columns")).toBe("3");
        expect(host.getAttribute("data-gap")).toBe("1rem");
    });

    test("reflects custom columns and gap via data attributes", () => {
        const host = render('<lily-masonry columns="2" gap="2rem"></lily-masonry>');

        expect(host.getAttribute("data-columns")).toBe("2");
        expect(host.getAttribute("data-gap")).toBe("2rem");
    });

    test("preserves children in place", () => {
        const host = render("<lily-masonry><div>One</div><div>Two</div></lily-masonry>");

        expect(host.children.length).toBe(2);
    });

    test("does not apply an inline style (deviation from other frameworks)", () => {
        const host = render('<lily-masonry columns="4"></lily-masonry>');

        expect(host.getAttribute("style")).toBeNull();
    });
});
