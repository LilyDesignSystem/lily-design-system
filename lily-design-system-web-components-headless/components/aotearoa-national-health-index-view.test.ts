import { afterEach, describe, expect, test } from "vitest";

import { AotearoaNationalHealthIndexView } from "./aotearoa-national-health-index-view.js";

if (!customElements.get("lily-aotearoa-national-health-index-view")) {
    customElements.define(
        "lily-aotearoa-national-health-index-view",
        AotearoaNationalHealthIndexView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AotearoaNationalHealthIndexView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-aotearoa-national-health-index-view label="National Health Index (NHI) Number" value="ABC1234"></lily-aotearoa-national-health-index-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("aotearoa-national-health-index-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-aotearoa-national-health-index-view label="National Health Index (NHI) Number" value="ABC1234"></lily-aotearoa-national-health-index-view>',
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
        ).toBe(`${"National Health Index (NHI) Number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-aotearoa-national-health-index-view label="National Health Index (NHI) Number" value="ABC1234"></lily-aotearoa-national-health-index-view>',
        ) as unknown as AotearoaNationalHealthIndexView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("ABC1234");
        expect(host.value).toBe("ABC1234");

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
