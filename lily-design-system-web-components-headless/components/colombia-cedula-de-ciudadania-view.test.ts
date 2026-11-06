import { afterEach, describe, expect, test } from "vitest";

import { ColombiaCedulaDeCiudadaniaView } from "./colombia-cedula-de-ciudadania-view.js";

if (!customElements.get("lily-colombia-cedula-de-ciudadania-view")) {
    customElements.define(
        "lily-colombia-cedula-de-ciudadania-view",
        ColombiaCedulaDeCiudadaniaView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ColombiaCedulaDeCiudadaniaView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-colombia-cedula-de-ciudadania-view label="Cedula de Ciudadania Number" value="1.020.304.050"></lily-colombia-cedula-de-ciudadania-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("colombia-cedula-de-ciudadania-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-colombia-cedula-de-ciudadania-view label="Cedula de Ciudadania Number" value="1.020.304.050"></lily-colombia-cedula-de-ciudadania-view>',
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
        ).toBe(`${"Cedula de Ciudadania Number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-colombia-cedula-de-ciudadania-view label="Cedula de Ciudadania Number" value="1.020.304.050"></lily-colombia-cedula-de-ciudadania-view>',
        ) as unknown as ColombiaCedulaDeCiudadaniaView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("1.020.304.050");
        expect(host.value).toBe("1.020.304.050");

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
