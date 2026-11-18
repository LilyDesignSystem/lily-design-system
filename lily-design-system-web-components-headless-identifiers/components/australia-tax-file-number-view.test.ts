import { afterEach, describe, expect, test } from "vitest";

import { AustraliaTaxFileNumberView } from "./australia-tax-file-number-view.js";

if (!customElements.get("lily-australia-tax-file-number-view")) {
    customElements.define("lily-australia-tax-file-number-view", AustraliaTaxFileNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AustraliaTaxFileNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-australia-tax-file-number-view label="Tax File Number (TFN)" value="123 456 782"></lily-australia-tax-file-number-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("australia-tax-file-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-australia-tax-file-number-view label="Tax File Number (TFN)" value="123 456 782"></lily-australia-tax-file-number-view>',
        );

        expect(
            host
                .querySelector("span .screen-reader-span")
                ?.textContent?.replace(
                    host
                        .querySelector("span .screen-reader-span")
                        ?.querySelector(".screen-reader-span")?.textContent ?? "",
                    "",
                ),
        ).toBe(`${"Tax File Number (TFN)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-australia-tax-file-number-view label="Tax File Number (TFN)" value="123 456 782"></lily-australia-tax-file-number-view>',
        ) as unknown as AustraliaTaxFileNumberView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("123 456 782");
        expect(host.value).toBe("123 456 782");

        host.value = "changed";
        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
