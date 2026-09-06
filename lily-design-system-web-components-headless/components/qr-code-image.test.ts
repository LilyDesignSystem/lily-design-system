import { afterEach, describe, expect, test } from "vitest";

import { QrCodeImage } from "./qr-code-image.js";

if (!customElements.get("lily-qr-code-image")) {
    customElements.define("lily-qr-code-image", QrCodeImage);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("QrCodeImage", () => {
    test("carries the base class", () => {
        const host = render(
            '<lily-qr-code-image label="Scan to visit example.com"><svg></svg></lily-qr-code-image>',
        );

        expect(host.classList.contains("qr-code-image")).toBe(true);
    });

    test("has role=img", () => {
        const host = render(
            '<lily-qr-code-image label="Scan to visit example.com"><svg></svg></lily-qr-code-image>',
        );

        expect(host.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible description", () => {
        const host = render(
            '<lily-qr-code-image label="Scan to visit example.com"><svg></svg></lily-qr-code-image>',
        );

        expect(host.getAttribute("aria-label")).toBe("Scan to visit example.com");
    });

    test("keeps the consumer's QR code rendering in place", () => {
        const host = render(
            '<lily-qr-code-image label="Scan to visit example.com"><svg data-testid="qr"></svg></lily-qr-code-image>',
        );

        expect(host.querySelector("svg[data-testid=qr]")).toBeTruthy();
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-qr-code-image label="Scan to visit example.com" class="my-qr"><svg></svg></lily-qr-code-image>',
        );

        expect(host.getAttribute("class")).toBe("qr-code-image my-qr");
    });
});
