import { afterEach, describe, expect, test } from "vitest";

import { Watermark } from "./watermark.js";

if (!customElements.get("lily-watermark")) {
    customElements.define("lily-watermark", Watermark);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Watermark", () => {
    test("carries the base class", () => {
        const host = render('<lily-watermark text="DRAFT"></lily-watermark>');

        expect(host.classList.contains("watermark")).toBe(true);
    });

    test("data-rotate defaults to -22 and data-gap defaults to 100px", () => {
        const host = render('<lily-watermark text="DRAFT"></lily-watermark>');

        expect(host.getAttribute("data-rotate")).toBe("-22");
        expect(host.getAttribute("data-gap")).toBe("100px");
    });

    test("honours explicit rotate and gap", () => {
        const host = render('<lily-watermark text="DRAFT" rotate="0" gap="200px"></lily-watermark>');

        expect(host.getAttribute("data-rotate")).toBe("0");
        expect(host.getAttribute("data-gap")).toBe("200px");
    });

    test("renders the overlay as aria-hidden with data-text", () => {
        const host = render('<lily-watermark text="CONFIDENTIAL"></lily-watermark>');

        const overlay = host.querySelector(".watermark-overlay") as HTMLElement;
        expect(overlay.getAttribute("aria-hidden")).toBe("true");
        expect(overlay.getAttribute("data-text")).toBe("CONFIDENTIAL");
    });

    test("sets data-image-url on the overlay when imageUrl is provided", () => {
        const host = render('<lily-watermark image-url="/brand.svg"></lily-watermark>');

        expect(host.querySelector(".watermark-overlay")!.getAttribute("data-image-url")).toBe("/brand.svg");
    });

    test("children render after the overlay element", () => {
        const host = render('<lily-watermark text="DRAFT"><article>Body content</article></lily-watermark>');

        expect(host.children[0].classList.contains("watermark-overlay")).toBe(true);
        expect(host.children[1].tagName).toBe("ARTICLE");
    });
});
