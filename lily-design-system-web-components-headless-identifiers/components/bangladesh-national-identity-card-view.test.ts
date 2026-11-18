import { afterEach, describe, expect, test } from "vitest";

import { BangladeshNationalIdentityCardView } from "./bangladesh-national-identity-card-view.js";

if (!customElements.get("lily-bangladesh-national-identity-card-view")) {
    customElements.define(
        "lily-bangladesh-national-identity-card-view",
        BangladeshNationalIdentityCardView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BangladeshNationalIdentityCardView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-bangladesh-national-identity-card-view label="National ID (NID) number" value="1234567890"></lily-bangladesh-national-identity-card-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("bangladesh-national-identity-card-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-bangladesh-national-identity-card-view label="National ID (NID) number" value="1234567890"></lily-bangladesh-national-identity-card-view>',
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
        ).toBe(`${"National ID (NID) number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-bangladesh-national-identity-card-view label="National ID (NID) number" value="1234567890"></lily-bangladesh-national-identity-card-view>',
        ) as unknown as BangladeshNationalIdentityCardView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("1234567890");
        expect(host.value).toBe("1234567890");

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
