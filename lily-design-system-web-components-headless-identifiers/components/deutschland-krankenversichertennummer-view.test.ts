import { afterEach, describe, expect, test } from "vitest";

import { DeutschlandKrankenversichertennummerView } from "./deutschland-krankenversichertennummer-view.js";

if (!customElements.get("lily-deutschland-krankenversichertennummer-view")) {
    customElements.define(
        "lily-deutschland-krankenversichertennummer-view",
        DeutschlandKrankenversichertennummerView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DeutschlandKrankenversichertennummerView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-deutschland-krankenversichertennummer-view label="ID"></lily-deutschland-krankenversichertennummer-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("deutschland-krankenversichertennummer-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-deutschland-krankenversichertennummer-view label="Krankenversichertennummer"></lily-deutschland-krankenversichertennummer-view>',
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
        ).toBe(`${"Krankenversichertennummer"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-deutschland-krankenversichertennummer-view label="ID" value="A123456789"></lily-deutschland-krankenversichertennummer-view>',
        ) as unknown as DeutschlandKrankenversichertennummerView;

        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("A123456789");
        expect(host.value).toBe("A123456789");

        host.value = "changed";
        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
