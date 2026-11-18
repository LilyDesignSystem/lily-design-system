import { afterEach, describe, expect, test } from "vitest";

import { AlImaratRaqmAlHuwiyahView } from "./al-imarat-raqm-al-huwiyah-view.js";

if (!customElements.get("lily-al-imarat-raqm-al-huwiyah-view")) {
    customElements.define("lily-al-imarat-raqm-al-huwiyah-view", AlImaratRaqmAlHuwiyahView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AlImaratRaqmAlHuwiyahView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-al-imarat-raqm-al-huwiyah-view label="Emirates ID number" value="784-1985-1234567-1"></lily-al-imarat-raqm-al-huwiyah-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("al-imarat-raqm-al-huwiyah-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-al-imarat-raqm-al-huwiyah-view label="Emirates ID number" value="784-1985-1234567-1"></lily-al-imarat-raqm-al-huwiyah-view>',
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
        ).toBe(`${"Emirates ID number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-al-imarat-raqm-al-huwiyah-view label="Emirates ID number" value="784-1985-1234567-1"></lily-al-imarat-raqm-al-huwiyah-view>',
        ) as unknown as AlImaratRaqmAlHuwiyahView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("784-1985-1234567-1");
        expect(host.value).toBe("784-1985-1234567-1");

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
