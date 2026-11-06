import { afterEach, describe, expect, test } from "vitest";

import { KyprosNationalPassportNumberView } from "./kypros-national-passport-number-view.js";

if (!customElements.get("lily-kypros-national-passport-number-view")) {
    customElements.define(
        "lily-kypros-national-passport-number-view",
        KyprosNationalPassportNumberView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("KyprosNationalPassportNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-kypros-national-passport-number-view label="ID"></lily-kypros-national-passport-number-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("kypros-national-passport-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-kypros-national-passport-number-view label="National Passport Number"></lily-kypros-national-passport-number-view>',
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
        ).toBe(`${"National Passport Number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-kypros-national-passport-number-view label="ID" value="K12345678"></lily-kypros-national-passport-number-view>',
        ) as unknown as KyprosNationalPassportNumberView;

        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("K12345678");
        expect(host.value).toBe("K12345678");

        host.value = "changed";
        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
