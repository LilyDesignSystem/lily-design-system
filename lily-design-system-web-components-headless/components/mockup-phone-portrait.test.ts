import { afterEach, describe, expect, test } from "vitest";

import { MockupPhonePortrait } from "./mockup-phone-portrait.js";

if (!customElements.get("lily-mockup-phone-portrait")) {
    customElements.define("lily-mockup-phone-portrait", MockupPhonePortrait);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MockupPhonePortrait", () => {
    test("the custom element itself is the frame (self-is-the-wrapper)", () => {
        const host = render("<lily-mockup-phone-portrait><p>Content</p></lily-mockup-phone-portrait>");

        expect(host.className).toBe("mockup-phone-portrait");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-mockup-phone-portrait label="Preview of the home screen"></lily-mockup-phone-portrait>');

        expect(host.getAttribute("aria-label")).toBe("Preview of the home screen");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-mockup-phone-portrait></lily-mockup-phone-portrait>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps children in place", () => {
        const host = render("<lily-mockup-phone-portrait><p>Content</p></lily-mockup-phone-portrait>");

        expect(host.querySelector("p")!.textContent).toBe("Content");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-mockup-phone-portrait class="extra"></lily-mockup-phone-portrait>');

        expect(host.className).toBe("mockup-phone-portrait extra");
    });
});
