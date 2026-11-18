import { afterEach, describe, expect, test } from "vitest";

import { CostaRicaCedulaDeIdentidadView } from "./costa-rica-cedula-de-identidad-view.js";

if (!customElements.get("lily-costa-rica-cedula-de-identidad-view")) {
    customElements.define(
        "lily-costa-rica-cedula-de-identidad-view",
        CostaRicaCedulaDeIdentidadView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CostaRicaCedulaDeIdentidadView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-costa-rica-cedula-de-identidad-view label="Cédula de Identidad" value="1-0613-0584"></lily-costa-rica-cedula-de-identidad-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("costa-rica-cedula-de-identidad-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-costa-rica-cedula-de-identidad-view label="Cédula de Identidad" value="1-0613-0584"></lily-costa-rica-cedula-de-identidad-view>',
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
        ).toBe(`${"Cédula de Identidad"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-costa-rica-cedula-de-identidad-view label="Cédula de Identidad" value="1-0613-0584"></lily-costa-rica-cedula-de-identidad-view>',
        ) as unknown as CostaRicaCedulaDeIdentidadView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("1-0613-0584");
        expect(host.value).toBe("1-0613-0584");

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
