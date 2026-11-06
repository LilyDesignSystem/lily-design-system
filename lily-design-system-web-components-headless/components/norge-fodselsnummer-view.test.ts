import { afterEach, describe, expect, test } from "vitest";

import { NorgeFodselsnummerView } from "./norge-fodselsnummer-view.js";

if (!customElements.get("lily-norge-fodselsnummer-view")) {
    customElements.define("lily-norge-fodselsnummer-view", NorgeFodselsnummerView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NorgeFodselsnummerView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-norge-fodselsnummer-view label="Fødselsnummer" value="01129012345"></lily-norge-fodselsnummer-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("norge-fodselsnummer-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-norge-fodselsnummer-view label="Fødselsnummer" value="01129012345"></lily-norge-fodselsnummer-view>',
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
        ).toBe(`${"Fødselsnummer"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-norge-fodselsnummer-view label="Fødselsnummer" value="01129012345"></lily-norge-fodselsnummer-view>',
        ) as unknown as NorgeFodselsnummerView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("01129012345");
        expect(host.value).toBe("01129012345");

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
