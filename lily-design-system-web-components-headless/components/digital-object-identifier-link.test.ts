import { afterEach, describe, expect, test } from "vitest";

import { DigitalObjectIdentifierLink } from "./digital-object-identifier-link.js";

if (!customElements.get("lily-digital-object-identifier-link")) {
    customElements.define("lily-digital-object-identifier-link", DigitalObjectIdentifierLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DigitalObjectIdentifierLink", () => {
    test("constructs the href from the doi via the resolver prefix", () => {
        const host = render(
            '<lily-digital-object-identifier-link doi="10.1000/xyz123"></lily-digital-object-identifier-link>',
        );

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("digital-object-identifier-link");
        expect(a.getAttribute("href")).toBe("https://doi.org/10.1000/xyz123");
    });

    test("sets rel=noopener noreferrer", () => {
        const host = render(
            '<lily-digital-object-identifier-link doi="10.1000/xyz123"></lily-digital-object-identifier-link>',
        );

        expect(host.querySelector("a")!.getAttribute("rel")).toBe("noopener noreferrer");
    });

    test("defaults visible text to the doi when no children are provided", () => {
        const host = render(
            '<lily-digital-object-identifier-link doi="10.1000/xyz123"></lily-digital-object-identifier-link>',
        );

        expect(host.querySelector("a")!.textContent).toBe("10.1000/xyz123");
    });

    test("uses provided children as visible text instead of the bare doi", () => {
        const host = render(
            '<lily-digital-object-identifier-link doi="10.1000/xyz123">Read the paper</lily-digital-object-identifier-link>',
        );

        expect(host.querySelector("a")!.textContent).toBe("Read the paper");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render(
            '<lily-digital-object-identifier-link doi="10.1000/x" class="extra"></lily-digital-object-identifier-link>',
        );

        expect(host.querySelector("a")!.className).toBe("digital-object-identifier-link extra");
    });

    test("passes through rest attributes, including an aria-label override", () => {
        const host = render(
            '<lily-digital-object-identifier-link doi="10.1000/x" aria-label="Read the source"></lily-digital-object-identifier-link>',
        );

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Read the source");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render(
            '<lily-digital-object-identifier-link doi="10.1000/x"></lily-digital-object-identifier-link>',
        );

        (host as unknown as DigitalObjectIdentifierLink).connectedCallback();

        expect(host.querySelectorAll("a.digital-object-identifier-link").length).toBe(1);
    });
});
