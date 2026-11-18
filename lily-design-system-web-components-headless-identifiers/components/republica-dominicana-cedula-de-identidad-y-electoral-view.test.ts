import { afterEach, describe, expect, test } from "vitest";

import { RepublicaDominicanaCedulaDeIdentidadYElectoralView } from "./republica-dominicana-cedula-de-identidad-y-electoral-view.js";

if (!customElements.get("lily-republica-dominicana-cedula-de-identidad-y-electoral-view")) {
    customElements.define(
        "lily-republica-dominicana-cedula-de-identidad-y-electoral-view",
        RepublicaDominicanaCedulaDeIdentidadYElectoralView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RepublicaDominicanaCedulaDeIdentidadYElectoralView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-republica-dominicana-cedula-de-identidad-y-electoral-view label="Cédula de Identidad y Electoral" value="001-1391820-5"></lily-republica-dominicana-cedula-de-identidad-y-electoral-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("republica-dominicana-cedula-de-identidad-y-electoral-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-republica-dominicana-cedula-de-identidad-y-electoral-view label="Cédula de Identidad y Electoral" value="001-1391820-5"></lily-republica-dominicana-cedula-de-identidad-y-electoral-view>',
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
        ).toBe(`${"Cédula de Identidad y Electoral"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-republica-dominicana-cedula-de-identidad-y-electoral-view label="Cédula de Identidad y Electoral" value="001-1391820-5"></lily-republica-dominicana-cedula-de-identidad-y-electoral-view>',
        ) as unknown as RepublicaDominicanaCedulaDeIdentidadYElectoralView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("001-1391820-5");
        expect(host.value).toBe("001-1391820-5");

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
