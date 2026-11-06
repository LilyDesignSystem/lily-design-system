import { afterEach, describe, expect, test } from "vitest";

import { HrvatskaOsobniIdentifikacijskiBrojView } from "./hrvatska-osobni-identifikacijski-broj-view.js";

if (!customElements.get("lily-hrvatska-osobni-identifikacijski-broj-view")) {
    customElements.define(
        "lily-hrvatska-osobni-identifikacijski-broj-view",
        HrvatskaOsobniIdentifikacijskiBrojView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("HrvatskaOsobniIdentifikacijskiBrojView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-hrvatska-osobni-identifikacijski-broj-view label="Osobni identifikacijski broj (OIB)" value="94577403194"></lily-hrvatska-osobni-identifikacijski-broj-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("hrvatska-osobni-identifikacijski-broj-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-hrvatska-osobni-identifikacijski-broj-view label="Osobni identifikacijski broj (OIB)" value="94577403194"></lily-hrvatska-osobni-identifikacijski-broj-view>',
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
        ).toBe(`${"Osobni identifikacijski broj (OIB)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-hrvatska-osobni-identifikacijski-broj-view label="Osobni identifikacijski broj (OIB)" value="94577403194"></lily-hrvatska-osobni-identifikacijski-broj-view>',
        ) as unknown as HrvatskaOsobniIdentifikacijskiBrojView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("94577403194");
        expect(host.value).toBe("94577403194");

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
