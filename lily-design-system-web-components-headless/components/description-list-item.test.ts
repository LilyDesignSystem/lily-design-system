import { afterEach, describe, expect, test } from "vitest";

import { DescriptionListItem } from "./description-list-item.js";

if (!customElements.get("lily-description-list-item")) {
    customElements.define("lily-description-list-item", DescriptionListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DescriptionListItem", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-description-list-item><dt>Name</dt><dd>Ada Lovelace</dd></lily-description-list-item>");

        expect(host.className).toBe("description-list-item");
    });

    test("has no aria-label by default", () => {
        const host = render("<lily-description-list-item><dt>Name</dt><dd>Ada Lovelace</dd></lily-description-list-item>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("applies aria-label when provided", () => {
        const host = render(
            '<lily-description-list-item label="Name"><dt>Name</dt><dd>Ada Lovelace</dd></lily-description-list-item>',
        );

        expect(host.getAttribute("aria-label")).toBe("Name");
    });

    test("preserves the dt/dd children in place", () => {
        const host = render("<lily-description-list-item><dt>Name</dt><dd>Ada Lovelace</dd></lily-description-list-item>");

        expect(host.querySelector("dt")!.textContent).toBe("Name");
        expect(host.querySelector("dd")!.textContent).toBe("Ada Lovelace");
    });
});
