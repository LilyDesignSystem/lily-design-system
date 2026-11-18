import { afterEach, describe, expect, test } from "vitest";

import { MauritiusNationalIdentityCardNumberView } from "./mauritius-national-identity-card-number-view.js";

if (!customElements.get("lily-mauritius-national-identity-card-number-view")) {
    customElements.define(
        "lily-mauritius-national-identity-card-number-view",
        MauritiusNationalIdentityCardNumberView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MauritiusNationalIdentityCardNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-mauritius-national-identity-card-number-view label="National Identity Card number" value="A0101801234567"></lily-mauritius-national-identity-card-number-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("mauritius-national-identity-card-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-mauritius-national-identity-card-number-view label="National Identity Card number" value="A0101801234567"></lily-mauritius-national-identity-card-number-view>',
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
        ).toBe(`${"National Identity Card number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-mauritius-national-identity-card-number-view label="National Identity Card number" value="A0101801234567"></lily-mauritius-national-identity-card-number-view>',
        ) as unknown as MauritiusNationalIdentityCardNumberView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("A0101801234567");
        expect(host.value).toBe("A0101801234567");

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
