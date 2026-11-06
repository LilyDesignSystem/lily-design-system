import { afterEach, describe, expect, test } from "vitest";

import { TurkiyeTcKimlikNumarasiView } from "./turkiye-tc-kimlik-numarasi-view.js";

if (!customElements.get("lily-turkiye-tc-kimlik-numarasi-view")) {
    customElements.define("lily-turkiye-tc-kimlik-numarasi-view", TurkiyeTcKimlikNumarasiView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TurkiyeTcKimlikNumarasiView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-turkiye-tc-kimlik-numarasi-view label="T.C. Kimlik Numarası" value="12345678902"></lily-turkiye-tc-kimlik-numarasi-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("turkiye-tc-kimlik-numarasi-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-turkiye-tc-kimlik-numarasi-view label="T.C. Kimlik Numarası" value="12345678902"></lily-turkiye-tc-kimlik-numarasi-view>',
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
        ).toBe(`${"T.C. Kimlik Numarası"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-turkiye-tc-kimlik-numarasi-view label="T.C. Kimlik Numarası" value="12345678902"></lily-turkiye-tc-kimlik-numarasi-view>',
        ) as unknown as TurkiyeTcKimlikNumarasiView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("12345678902");
        expect(host.value).toBe("12345678902");

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
