import { afterEach, describe, expect, test } from "vitest";

import { MockupTabletPortrait } from "./mockup-tablet-portrait.js";

if (!customElements.get("lily-mockup-tablet-portrait")) {
    customElements.define("lily-mockup-tablet-portrait", MockupTabletPortrait);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MockupTabletPortrait", () => {
    test("the custom element itself is the frame (self-is-the-wrapper)", () => {
        const host = render("<lily-mockup-tablet-portrait><p>Content</p></lily-mockup-tablet-portrait>");

        expect(host.className).toBe("mockup-tablet-portrait");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-mockup-tablet-portrait label="Preview of the article"></lily-mockup-tablet-portrait>');

        expect(host.getAttribute("aria-label")).toBe("Preview of the article");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-mockup-tablet-portrait></lily-mockup-tablet-portrait>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps children in place", () => {
        const host = render("<lily-mockup-tablet-portrait><p>Content</p></lily-mockup-tablet-portrait>");

        expect(host.querySelector("p")!.textContent).toBe("Content");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-mockup-tablet-portrait class="extra"></lily-mockup-tablet-portrait>');

        expect(host.className).toBe("mockup-tablet-portrait extra");
    });
});
