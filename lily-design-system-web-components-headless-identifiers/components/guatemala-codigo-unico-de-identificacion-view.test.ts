import { afterEach, describe, expect, test } from "vitest";

import { GuatemalaCodigoUnicoDeIdentificacionView } from "./guatemala-codigo-unico-de-identificacion-view.js";

if (!customElements.get("lily-guatemala-codigo-unico-de-identificacion-view")) {
    customElements.define(
        "lily-guatemala-codigo-unico-de-identificacion-view",
        GuatemalaCodigoUnicoDeIdentificacionView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GuatemalaCodigoUnicoDeIdentificacionView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-guatemala-codigo-unico-de-identificacion-view label="Código Único de Identificación (CUI)" value="1234 56789 0101"></lily-guatemala-codigo-unico-de-identificacion-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("guatemala-codigo-unico-de-identificacion-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-guatemala-codigo-unico-de-identificacion-view label="Código Único de Identificación (CUI)" value="1234 56789 0101"></lily-guatemala-codigo-unico-de-identificacion-view>',
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
        ).toBe(`${"Código Único de Identificación (CUI)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-guatemala-codigo-unico-de-identificacion-view label="Código Único de Identificación (CUI)" value="1234 56789 0101"></lily-guatemala-codigo-unico-de-identificacion-view>',
        ) as unknown as GuatemalaCodigoUnicoDeIdentificacionView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("1234 56789 0101");
        expect(host.value).toBe("1234 56789 0101");

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
