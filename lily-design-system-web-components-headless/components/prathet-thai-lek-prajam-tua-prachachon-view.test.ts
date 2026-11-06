import { afterEach, describe, expect, test } from "vitest";

import { PrathetThaiLekPrajamTuaPrachachonView } from "./prathet-thai-lek-prajam-tua-prachachon-view.js";

if (!customElements.get("lily-prathet-thai-lek-prajam-tua-prachachon-view")) {
    customElements.define(
        "lily-prathet-thai-lek-prajam-tua-prachachon-view",
        PrathetThaiLekPrajamTuaPrachachonView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PrathetThaiLekPrajamTuaPrachachonView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-prathet-thai-lek-prajam-tua-prachachon-view label="เลขประจำตัวประชาชน (National ID)" value="1234567890123"></lily-prathet-thai-lek-prajam-tua-prachachon-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("prathet-thai-lek-prajam-tua-prachachon-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-prathet-thai-lek-prajam-tua-prachachon-view label="เลขประจำตัวประชาชน (National ID)" value="1234567890123"></lily-prathet-thai-lek-prajam-tua-prachachon-view>',
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
        ).toBe(`${"เลขประจำตัวประชาชน (National ID)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-prathet-thai-lek-prajam-tua-prachachon-view label="เลขประจำตัวประชาชน (National ID)" value="1234567890123"></lily-prathet-thai-lek-prajam-tua-prachachon-view>',
        ) as unknown as PrathetThaiLekPrajamTuaPrachachonView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("1234567890123");
        expect(host.value).toBe("1234567890123");

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
