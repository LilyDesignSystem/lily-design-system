import { afterEach, describe, expect, test } from "vitest";

import { NederlandPaspoortNummerView } from "./nederland-paspoort-nummer-view.js";

if (!customElements.get("lily-nederland-paspoort-nummer-view")) {
    customElements.define("lily-nederland-paspoort-nummer-view", NederlandPaspoortNummerView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NederlandPaspoortNummerView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-nederland-paspoort-nummer-view label="Paspoort Nummer" value="NR1234567"></lily-nederland-paspoort-nummer-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("nederland-paspoort-nummer-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-nederland-paspoort-nummer-view label="Paspoort Nummer" value="NR1234567"></lily-nederland-paspoort-nummer-view>',
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
        ).toBe(`${"Paspoort Nummer"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-nederland-paspoort-nummer-view label="Paspoort Nummer" value="NR1234567"></lily-nederland-paspoort-nummer-view>',
        ) as unknown as NederlandPaspoortNummerView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("NR1234567");
        expect(host.value).toBe("NR1234567");

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
