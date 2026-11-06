import { afterEach, describe, expect, test } from "vitest";

import { MaltaNationalIdentificationNumberView } from "./malta-national-identification-number-view.js";

if (!customElements.get("lily-malta-national-identification-number-view")) {
    customElements.define(
        "lily-malta-national-identification-number-view",
        MaltaNationalIdentificationNumberView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MaltaNationalIdentificationNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-malta-national-identification-number-view label="National Identification Number" value="1234567M"></lily-malta-national-identification-number-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("malta-national-identification-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-malta-national-identification-number-view label="National Identification Number" value="1234567M"></lily-malta-national-identification-number-view>',
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
        ).toBe(`${"National Identification Number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-malta-national-identification-number-view label="National Identification Number" value="1234567M"></lily-malta-national-identification-number-view>',
        ) as unknown as MaltaNationalIdentificationNumberView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("1234567M");
        expect(host.value).toBe("1234567M");

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
