import { afterEach, describe, expect, test } from "vitest";

import { SlovenijaEmsoView } from "./slovenija-emso-view.js";

if (!customElements.get("lily-slovenija-emso-view")) {
    customElements.define("lily-slovenija-emso-view", SlovenijaEmsoView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SlovenijaEmsoView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-slovenija-emso-view label="Enotna Matična Številka Občana (EMŠO)"></lily-slovenija-emso-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("slovenija-emso-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-slovenija-emso-view label="Enotna Matična Številka Občana (EMŠO)"></lily-slovenija-emso-view>',
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
        ).toBe(`${"Enotna Matična Številka Občana (EMŠO)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render(
            '<lily-slovenija-emso-view label="Enotna Matična Številka Občana (EMŠO)" value="0101006500006"></lily-slovenija-emso-view>',
        ) as unknown as SlovenijaEmsoView;

        expect(host.value).toBe("0101006500006");
        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("0101006500006");

        host.value = "1502985500013";
        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("1502985500013");
        expect(host.value).toBe("1502985500013");
    });
});
