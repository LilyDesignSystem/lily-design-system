import { afterEach, describe, expect, test } from "vitest";

import { SouthAfricaIdentityNumberView } from "./south-africa-identity-number-view.js";

if (!customElements.get("lily-south-africa-identity-number-view")) {
    customElements.define("lily-south-africa-identity-number-view", SouthAfricaIdentityNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SouthAfricaIdentityNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-south-africa-identity-number-view label="South African Identity Number" value="9001015008086"></lily-south-africa-identity-number-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("south-africa-identity-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-south-africa-identity-number-view label="South African Identity Number" value="9001015008086"></lily-south-africa-identity-number-view>',
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
        ).toBe(`${"South African Identity Number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-south-africa-identity-number-view label="South African Identity Number" value="9001015008086"></lily-south-africa-identity-number-view>',
        ) as unknown as SouthAfricaIdentityNumberView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("9001015008086");
        expect(host.value).toBe("9001015008086");

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
