import { afterEach, describe, expect, test } from "vitest";

import { GoToPreviousSection } from "./go-to-previous-section.js";

if (!customElements.get("lily-go-to-previous-section")) {
    customElements.define("lily-go-to-previous-section", GoToPreviousSection);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GoToPreviousSection", () => {
    test("renders a native anchor with href and label as visible text", () => {
        const host = render(
            '<lily-go-to-previous-section href="#section-1" label="Previous: Overview"></lily-go-to-previous-section>',
        );

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("go-to-previous-section");
        expect(a.getAttribute("href")).toBe("#section-1");
        expect(a.textContent).toBe("Previous: Overview");
    });

    test("accessible name is derived natively from the link text", () => {
        const host = render(
            '<lily-go-to-previous-section href="#section-1" label="Previous"></lily-go-to-previous-section>',
        );

        expect(host.querySelector("a")!.hasAttribute("aria-label")).toBe(false);
    });

    test("consumer can override the accessible name via a plain aria-label rest attribute", () => {
        const host = render(
            '<lily-go-to-previous-section href="#section-1" label="Previous" aria-label="Go to overview section"></lily-go-to-previous-section>',
        );

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Go to overview section");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render(
            '<lily-go-to-previous-section href="#x" label="Previous" class="extra"></lily-go-to-previous-section>',
        );

        expect(host.querySelector("a")!.className).toBe("go-to-previous-section extra");
    });

    test("passes through rest attributes", () => {
        const host = render(
            '<lily-go-to-previous-section href="#x" label="Previous" data-testid="prev"></lily-go-to-previous-section>',
        );

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("prev");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-go-to-previous-section href="#x" label="Previous"></lily-go-to-previous-section>');

        (host as unknown as GoToPreviousSection).connectedCallback();

        expect(host.querySelectorAll("a.go-to-previous-section").length).toBe(1);
    });
});
