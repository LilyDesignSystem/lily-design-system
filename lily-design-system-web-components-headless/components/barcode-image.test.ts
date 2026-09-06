import { afterEach, describe, expect, test } from "vitest";

import { BarcodeImage } from "./barcode-image.js";

if (!customElements.get("lily-barcode-image")) {
    customElements.define("lily-barcode-image", BarcodeImage);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BarcodeImage", () => {
    test("renders a native img with src and alt", () => {
        const host = render('<lily-barcode-image src="/barcode.svg" alt="Order number 12345"></lily-barcode-image>');

        const img = host.querySelector("img") as HTMLImageElement;
        expect(img.className).toBe("barcode-image");
        expect(img.getAttribute("src")).toBe("/barcode.svg");
        expect(img.alt).toBe("Order number 12345");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-barcode-image src="/b.svg" alt="Code" class="large"></lily-barcode-image>');

        expect(host.querySelector("img")!.className).toBe("barcode-image large");
    });

    test("passes the loading attribute through", () => {
        const host = render('<lily-barcode-image src="/b.svg" alt="Code" loading="lazy"></lily-barcode-image>');

        expect(host.querySelector("img")!.getAttribute("loading")).toBe("lazy");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-barcode-image src="/b.svg" alt="Code"></lily-barcode-image>');

        (host as unknown as BarcodeImage).connectedCallback();

        expect(host.querySelectorAll("img").length).toBe(1);
    });
});
