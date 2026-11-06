import { afterEach, describe, expect, test } from "vitest";

import { IranKodEMelliView } from "./iran-kod-e-melli-view.js";

if (!customElements.get("lily-iran-kod-e-melli-view")) {
    customElements.define("lily-iran-kod-e-melli-view", IranKodEMelliView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("IranKodEMelliView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-iran-kod-e-melli-view label="National Code (Kod-e Melli)" value="0084575948"></lily-iran-kod-e-melli-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("iran-kod-e-melli-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-iran-kod-e-melli-view label="National Code (Kod-e Melli)" value="0084575948"></lily-iran-kod-e-melli-view>',
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
        ).toBe(`${"National Code (Kod-e Melli)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-iran-kod-e-melli-view label="National Code (Kod-e Melli)" value="0084575948"></lily-iran-kod-e-melli-view>',
        ) as unknown as IranKodEMelliView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("0084575948");
        expect(host.value).toBe("0084575948");

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
