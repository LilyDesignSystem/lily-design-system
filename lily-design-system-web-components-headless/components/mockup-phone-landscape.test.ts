import { afterEach, describe, expect, test } from "vitest";

import { MockupPhoneLandscape } from "./mockup-phone-landscape.js";

if (!customElements.get("lily-mockup-phone-landscape")) {
    customElements.define("lily-mockup-phone-landscape", MockupPhoneLandscape);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MockupPhoneLandscape", () => {
    test("the custom element itself is the frame (self-is-the-wrapper)", () => {
        const host = render('<lily-mockup-phone-landscape label="Home screen preview"><p>App content</p></lily-mockup-phone-landscape>');

        expect(host.className).toBe("mockup-phone-landscape");
    });

    test("has role=img, unlike its portrait sibling", () => {
        const host = render('<lily-mockup-phone-landscape label="Home screen preview"></lily-mockup-phone-landscape>');

        expect(host.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-mockup-phone-landscape label="Home screen preview"></lily-mockup-phone-landscape>');

        expect(host.getAttribute("aria-label")).toBe("Home screen preview");
    });

    test("keeps children in place", () => {
        const host = render('<lily-mockup-phone-landscape label="Home screen preview"><p>App content</p></lily-mockup-phone-landscape>');

        expect(host.querySelector("p")!.textContent).toBe("App content");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-mockup-phone-landscape label="Home screen preview" class="extra"></lily-mockup-phone-landscape>');

        expect(host.className).toBe("mockup-phone-landscape extra");
    });
});
