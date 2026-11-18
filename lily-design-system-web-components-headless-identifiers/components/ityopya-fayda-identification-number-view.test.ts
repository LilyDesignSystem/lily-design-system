import { afterEach, describe, expect, test } from "vitest";

import { ItyopyaFaydaIdentificationNumberView } from "./ityopya-fayda-identification-number-view.js";

if (!customElements.get("lily-ityopya-fayda-identification-number-view")) {
    customElements.define(
        "lily-ityopya-fayda-identification-number-view",
        ItyopyaFaydaIdentificationNumberView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ItyopyaFaydaIdentificationNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-ityopya-fayda-identification-number-view label="Fayda Identification Number (FIN)" value="123456789012"></lily-ityopya-fayda-identification-number-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("ityopya-fayda-identification-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-ityopya-fayda-identification-number-view label="Fayda Identification Number (FIN)" value="123456789012"></lily-ityopya-fayda-identification-number-view>',
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
        ).toBe(`${"Fayda Identification Number (FIN)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-ityopya-fayda-identification-number-view label="Fayda Identification Number (FIN)" value="123456789012"></lily-ityopya-fayda-identification-number-view>',
        ) as unknown as ItyopyaFaydaIdentificationNumberView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("123456789012");
        expect(host.value).toBe("123456789012");

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
