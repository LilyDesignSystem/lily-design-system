import { afterEach, describe, expect, test } from "vitest";

import { PhotoPack } from "./photo-pack.js";

if (!customElements.get("lily-photo-pack")) {
    customElements.define("lily-photo-pack", PhotoPack);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PhotoPack", () => {
    test("the custom element itself is the collection (self-is-the-wrapper)", () => {
        const host = render('<lily-photo-pack label="Holiday photos"></lily-photo-pack>');

        expect(host.className).toBe("photo-pack");
    });

    test("has role=group", () => {
        const host = render('<lily-photo-pack label="Holiday photos"></lily-photo-pack>');

        expect(host.getAttribute("role")).toBe("group");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-photo-pack label="Holiday photos"></lily-photo-pack>');

        expect(host.getAttribute("aria-label")).toBe("Holiday photos");
    });

    test("keeps children in place", () => {
        const host = render('<lily-photo-pack label="Holiday photos"><figure>Beach</figure></lily-photo-pack>');

        expect(host.querySelector("figure")!.textContent).toBe("Beach");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-photo-pack label="Holiday photos" class="extra"></lily-photo-pack>');

        expect(host.className).toBe("photo-pack extra");
    });
});
