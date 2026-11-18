import { afterEach, describe, expect, test } from "vitest";

import { HongKongIdentityCardView } from "./hong-kong-identity-card-view.js";

if (!customElements.get("lily-hong-kong-identity-card-view")) {
    customElements.define("lily-hong-kong-identity-card-view", HongKongIdentityCardView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("HongKongIdentityCardView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-hong-kong-identity-card-view label="Hong Kong Identity Card Number" value="A123456(3)"></lily-hong-kong-identity-card-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("hong-kong-identity-card-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-hong-kong-identity-card-view label="Hong Kong Identity Card Number" value="A123456(3)"></lily-hong-kong-identity-card-view>',
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
        ).toBe(`${"Hong Kong Identity Card Number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-hong-kong-identity-card-view label="Hong Kong Identity Card Number" value="A123456(3)"></lily-hong-kong-identity-card-view>',
        ) as unknown as HongKongIdentityCardView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("A123456(3)");
        expect(host.value).toBe("A123456(3)");

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
