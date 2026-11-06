import { afterEach, describe, expect, test } from "vitest";

import { CeskoCestovniPasView } from "./cesko-cestovni-pas-view.js";

if (!customElements.get("lily-cesko-cestovni-pas-view")) {
    customElements.define("lily-cesko-cestovni-pas-view", CeskoCestovniPasView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CeskoCestovniPasView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-cesko-cestovni-pas-view label="ID"></lily-cesko-cestovni-pas-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("cesko-cestovni-pas-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-cesko-cestovni-pas-view label="Cestovní Pas"></lily-cesko-cestovni-pas-view>',
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
        ).toBe(`${"Cestovní Pas"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-cesko-cestovni-pas-view label="ID" value="12345678"></lily-cesko-cestovni-pas-view>',
        ) as unknown as CeskoCestovniPasView;

        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("12345678");
        expect(host.value).toBe("12345678");

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
