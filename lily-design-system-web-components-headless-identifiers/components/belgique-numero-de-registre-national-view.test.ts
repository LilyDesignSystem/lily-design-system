import { afterEach, describe, expect, test } from "vitest";

import { BelgiqueNumeroDeRegistreNationalView } from "./belgique-numero-de-registre-national-view.js";

if (!customElements.get("lily-belgique-numero-de-registre-national-view")) {
    customElements.define(
        "lily-belgique-numero-de-registre-national-view",
        BelgiqueNumeroDeRegistreNationalView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BelgiqueNumeroDeRegistreNationalView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-belgique-numero-de-registre-national-view label="ID"></lily-belgique-numero-de-registre-national-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("belgique-numero-de-registre-national-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-belgique-numero-de-registre-national-view label="Numéro de Registre National"></lily-belgique-numero-de-registre-national-view>',
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
        ).toBe(`${"Numéro de Registre National"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-belgique-numero-de-registre-national-view label="ID" value="85073003328"></lily-belgique-numero-de-registre-national-view>',
        ) as unknown as BelgiqueNumeroDeRegistreNationalView;

        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("85073003328");
        expect(host.value).toBe("85073003328");

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
