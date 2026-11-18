import { afterEach, describe, expect, test } from "vitest";

import { SriLankaNationalIdentityCardView } from "./sri-lanka-national-identity-card-view.js";

if (!customElements.get("lily-sri-lanka-national-identity-card-view")) {
    customElements.define(
        "lily-sri-lanka-national-identity-card-view",
        SriLankaNationalIdentityCardView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SriLankaNationalIdentityCardView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-sri-lanka-national-identity-card-view label="National Identity Card (NIC) number" value="197419202757"></lily-sri-lanka-national-identity-card-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("sri-lanka-national-identity-card-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-sri-lanka-national-identity-card-view label="National Identity Card (NIC) number" value="197419202757"></lily-sri-lanka-national-identity-card-view>',
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
        ).toBe(`${"National Identity Card (NIC) number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-sri-lanka-national-identity-card-view label="National Identity Card (NIC) number" value="197419202757"></lily-sri-lanka-national-identity-card-view>',
        ) as unknown as SriLankaNationalIdentityCardView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("197419202757");
        expect(host.value).toBe("197419202757");

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
