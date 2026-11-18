import { afterEach, describe, expect, test } from "vitest";

import { SchweizAhvNummerView } from "./schweiz-ahv-nummer-view.js";

if (!customElements.get("lily-schweiz-ahv-nummer-view")) {
    customElements.define("lily-schweiz-ahv-nummer-view", SchweizAhvNummerView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SchweizAhvNummerView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-schweiz-ahv-nummer-view label="AHV-Nummer / Numéro AVS" value="756.1234.5678.97"></lily-schweiz-ahv-nummer-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("schweiz-ahv-nummer-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-schweiz-ahv-nummer-view label="AHV-Nummer / Numéro AVS" value="756.1234.5678.97"></lily-schweiz-ahv-nummer-view>',
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
        ).toBe(`${"AHV-Nummer / Numéro AVS"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-schweiz-ahv-nummer-view label="AHV-Nummer / Numéro AVS" value="756.1234.5678.97"></lily-schweiz-ahv-nummer-view>',
        ) as unknown as SchweizAhvNummerView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("756.1234.5678.97");
        expect(host.value).toBe("756.1234.5678.97");

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
