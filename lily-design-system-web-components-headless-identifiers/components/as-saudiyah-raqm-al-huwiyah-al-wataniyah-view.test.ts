import { afterEach, describe, expect, test } from "vitest";

import { AsSaudiyahRaqmAlHuwiyahAlWataniyahView } from "./as-saudiyah-raqm-al-huwiyah-al-wataniyah-view.js";

if (!customElements.get("lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-view")) {
    customElements.define(
        "lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-view",
        AsSaudiyahRaqmAlHuwiyahAlWataniyahView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AsSaudiyahRaqmAlHuwiyahAlWataniyahView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-view label="National Identification Number" value="1000000008"></lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("as-saudiyah-raqm-al-huwiyah-al-wataniyah-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-view label="National Identification Number" value="1000000008"></lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-view>',
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
            '<lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-view label="National Identification Number" value="1000000008"></lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-view>',
        ) as unknown as AsSaudiyahRaqmAlHuwiyahAlWataniyahView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("1000000008");
        expect(host.value).toBe("1000000008");

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
