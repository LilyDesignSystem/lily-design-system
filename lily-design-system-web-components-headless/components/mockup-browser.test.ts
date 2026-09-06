import { afterEach, describe, expect, test } from "vitest";

import { MockupBrowser } from "./mockup-browser.js";

if (!customElements.get("lily-mockup-browser")) {
    customElements.define("lily-mockup-browser", MockupBrowser);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MockupBrowser", () => {
    test("the custom element itself is the frame (self-is-the-wrapper)", () => {
        const host = render("<lily-mockup-browser><p>Page content</p></lily-mockup-browser>");

        expect(host.className).toBe("mockup-browser");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-mockup-browser label="Preview of the homepage"></lily-mockup-browser>');

        expect(host.getAttribute("aria-label")).toBe("Preview of the homepage");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-mockup-browser></lily-mockup-browser>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps children in place", () => {
        const host = render("<lily-mockup-browser><p>Page content</p></lily-mockup-browser>");

        expect(host.querySelector("p")!.textContent).toBe("Page content");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-mockup-browser class="extra"></lily-mockup-browser>');

        expect(host.className).toBe("mockup-browser extra");
    });
});
