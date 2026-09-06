import { afterEach, describe, expect, test } from "vitest";

import { MockupTabletLandscape } from "./mockup-tablet-landscape.js";

if (!customElements.get("lily-mockup-tablet-landscape")) {
    customElements.define("lily-mockup-tablet-landscape", MockupTabletLandscape);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MockupTabletLandscape", () => {
    test("the custom element itself is the frame (self-is-the-wrapper)", () => {
        const host = render("<lily-mockup-tablet-landscape><p>Content</p></lily-mockup-tablet-landscape>");

        expect(host.className).toBe("mockup-tablet-landscape");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-mockup-tablet-landscape label="Preview of the article"></lily-mockup-tablet-landscape>');

        expect(host.getAttribute("aria-label")).toBe("Preview of the article");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-mockup-tablet-landscape></lily-mockup-tablet-landscape>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps children in place", () => {
        const host = render("<lily-mockup-tablet-landscape><p>Content</p></lily-mockup-tablet-landscape>");

        expect(host.querySelector("p")!.textContent).toBe("Content");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-mockup-tablet-landscape class="extra"></lily-mockup-tablet-landscape>');

        expect(host.className).toBe("mockup-tablet-landscape extra");
    });
});
