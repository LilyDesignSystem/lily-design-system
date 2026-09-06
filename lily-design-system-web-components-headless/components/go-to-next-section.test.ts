import { afterEach, describe, expect, test } from "vitest";

import { GoToNextSection } from "./go-to-next-section.js";

if (!customElements.get("lily-go-to-next-section")) {
    customElements.define("lily-go-to-next-section", GoToNextSection);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GoToNextSection", () => {
    test("renders a native anchor with href and label as visible text", () => {
        const host = render('<lily-go-to-next-section href="#section-3" label="Next: Pricing"></lily-go-to-next-section>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("go-to-next-section");
        expect(a.getAttribute("href")).toBe("#section-3");
        expect(a.textContent).toBe("Next: Pricing");
    });

    test("accessible name is derived natively from the link text", () => {
        const host = render('<lily-go-to-next-section href="#section-3" label="Next: Pricing"></lily-go-to-next-section>');

        expect(host.querySelector("a")!.hasAttribute("aria-label")).toBe(false);
    });

    test("consumer can override the accessible name via a plain aria-label rest attribute", () => {
        const host = render(
            '<lily-go-to-next-section href="#section-3" label="Next" aria-label="Go to pricing section"></lily-go-to-next-section>',
        );

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Go to pricing section");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-go-to-next-section href="#x" label="Next" class="extra"></lily-go-to-next-section>');

        expect(host.querySelector("a")!.className).toBe("go-to-next-section extra");
    });

    test("passes through rest attributes", () => {
        const host = render(
            '<lily-go-to-next-section href="#x" label="Next" data-testid="next"></lily-go-to-next-section>',
        );

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("next");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-go-to-next-section href="#x" label="Next"></lily-go-to-next-section>');

        (host as unknown as GoToNextSection).connectedCallback();

        expect(host.querySelectorAll("a.go-to-next-section").length).toBe(1);
    });
});
