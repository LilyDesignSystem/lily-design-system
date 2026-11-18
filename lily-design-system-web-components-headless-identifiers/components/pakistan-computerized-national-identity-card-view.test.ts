import { afterEach, describe, expect, test } from "vitest";

import { PakistanComputerizedNationalIdentityCardView } from "./pakistan-computerized-national-identity-card-view.js";

if (!customElements.get("lily-pakistan-computerized-national-identity-card-view")) {
    customElements.define(
        "lily-pakistan-computerized-national-identity-card-view",
        PakistanComputerizedNationalIdentityCardView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PakistanComputerizedNationalIdentityCardView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-pakistan-computerized-national-identity-card-view label="Computerized National Identity Card Number (CNIC)" value="35202-1234567-1"></lily-pakistan-computerized-national-identity-card-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("pakistan-computerized-national-identity-card-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-pakistan-computerized-national-identity-card-view label="Computerized National Identity Card Number (CNIC)" value="35202-1234567-1"></lily-pakistan-computerized-national-identity-card-view>',
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
        ).toBe(`${"Computerized National Identity Card Number (CNIC)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-pakistan-computerized-national-identity-card-view label="Computerized National Identity Card Number (CNIC)" value="35202-1234567-1"></lily-pakistan-computerized-national-identity-card-view>',
        ) as unknown as PakistanComputerizedNationalIdentityCardView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("35202-1234567-1");
        expect(host.value).toBe("35202-1234567-1");

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
