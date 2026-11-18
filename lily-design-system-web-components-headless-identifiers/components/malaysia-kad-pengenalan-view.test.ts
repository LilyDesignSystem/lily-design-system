import { afterEach, describe, expect, test } from "vitest";

import { MalaysiaKadPengenalanView } from "./malaysia-kad-pengenalan-view.js";

if (!customElements.get("lily-malaysia-kad-pengenalan-view")) {
    customElements.define("lily-malaysia-kad-pengenalan-view", MalaysiaKadPengenalanView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MalaysiaKadPengenalanView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-malaysia-kad-pengenalan-view label="MyKad Number (NRIC)" value="900101-14-5678"></lily-malaysia-kad-pengenalan-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("malaysia-kad-pengenalan-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-malaysia-kad-pengenalan-view label="MyKad Number (NRIC)" value="900101-14-5678"></lily-malaysia-kad-pengenalan-view>',
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
        ).toBe(`${"MyKad Number (NRIC)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-malaysia-kad-pengenalan-view label="MyKad Number (NRIC)" value="900101-14-5678"></lily-malaysia-kad-pengenalan-view>',
        ) as unknown as MalaysiaKadPengenalanView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("900101-14-5678");
        expect(host.value).toBe("900101-14-5678");

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
