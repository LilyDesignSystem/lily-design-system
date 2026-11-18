import { afterEach, describe, expect, test } from "vitest";

import { PeruDocumentoNacionalDeIdentidadView } from "./peru-documento-nacional-de-identidad-view.js";

if (!customElements.get("lily-peru-documento-nacional-de-identidad-view")) {
    customElements.define(
        "lily-peru-documento-nacional-de-identidad-view",
        PeruDocumentoNacionalDeIdentidadView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PeruDocumentoNacionalDeIdentidadView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-peru-documento-nacional-de-identidad-view label="Documento Nacional de Identidad (DNI)" value="10117410-2"></lily-peru-documento-nacional-de-identidad-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("peru-documento-nacional-de-identidad-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-peru-documento-nacional-de-identidad-view label="Documento Nacional de Identidad (DNI)" value="10117410-2"></lily-peru-documento-nacional-de-identidad-view>',
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
        ).toBe(`${"Documento Nacional de Identidad (DNI)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-peru-documento-nacional-de-identidad-view label="Documento Nacional de Identidad (DNI)" value="10117410-2"></lily-peru-documento-nacional-de-identidad-view>',
        ) as unknown as PeruDocumentoNacionalDeIdentidadView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("10117410-2");
        expect(host.value).toBe("10117410-2");

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
