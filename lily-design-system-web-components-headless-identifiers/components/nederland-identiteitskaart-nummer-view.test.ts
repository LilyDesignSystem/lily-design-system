import { afterEach, describe, expect, test } from "vitest";

import { NederlandIdentiteitskaartNummerView } from "./nederland-identiteitskaart-nummer-view.js";

if (!customElements.get("lily-nederland-identiteitskaart-nummer-view")) {
    customElements.define(
        "lily-nederland-identiteitskaart-nummer-view",
        NederlandIdentiteitskaartNummerView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NederlandIdentiteitskaartNummerView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-nederland-identiteitskaart-nummer-view label="Identiteitskaart Nummer" value="PX1234567"></lily-nederland-identiteitskaart-nummer-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("nederland-identiteitskaart-nummer-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-nederland-identiteitskaart-nummer-view label="Identiteitskaart Nummer" value="PX1234567"></lily-nederland-identiteitskaart-nummer-view>',
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
        ).toBe(`${"Identiteitskaart Nummer"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-nederland-identiteitskaart-nummer-view label="Identiteitskaart Nummer" value="PX1234567"></lily-nederland-identiteitskaart-nummer-view>',
        ) as unknown as NederlandIdentiteitskaartNummerView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("PX1234567");
        expect(host.value).toBe("PX1234567");

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
