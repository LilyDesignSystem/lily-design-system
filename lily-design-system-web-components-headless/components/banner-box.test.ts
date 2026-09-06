import { afterEach, describe, expect, test } from "vitest";

import { BannerBox } from "./banner-box.js";

if (!customElements.get("lily-banner-box")) {
    customElements.define("lily-banner-box", BannerBox);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BannerBox", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-banner-box>Message text</lily-banner-box>");

        expect(host.className).toBe("banner-box");
    });

    test("has no aria-label when label is absent", () => {
        const host = render("<lily-banner-box>Message text</lily-banner-box>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as aria-label", () => {
        const host = render('<lily-banner-box label="Notice">Message text</lily-banner-box>');

        expect(host.getAttribute("aria-label")).toBe("Notice");
    });

    test("preserves original content", () => {
        const host = render("<lily-banner-box><span>Message</span></lily-banner-box>");

        expect(host.querySelector("span")!.textContent).toBe("Message");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-banner-box>Message text</lily-banner-box>");

        (host as unknown as BannerBox).connectedCallback();

        expect(host.className).toBe("banner-box");
    });
});
