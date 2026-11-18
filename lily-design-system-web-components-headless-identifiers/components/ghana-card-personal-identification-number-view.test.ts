import { afterEach, describe, expect, test } from "vitest";

import { GhanaCardPersonalIdentificationNumberView } from "./ghana-card-personal-identification-number-view.js";

if (!customElements.get("lily-ghana-card-personal-identification-number-view")) {
    customElements.define(
        "lily-ghana-card-personal-identification-number-view",
        GhanaCardPersonalIdentificationNumberView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GhanaCardPersonalIdentificationNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-ghana-card-personal-identification-number-view label="Ghana Card PIN" value="GHA-123456789-1"></lily-ghana-card-personal-identification-number-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("ghana-card-personal-identification-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-ghana-card-personal-identification-number-view label="Ghana Card PIN" value="GHA-123456789-1"></lily-ghana-card-personal-identification-number-view>',
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
        ).toBe(`${"Ghana Card PIN"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-ghana-card-personal-identification-number-view label="Ghana Card PIN" value="GHA-123456789-1"></lily-ghana-card-personal-identification-number-view>',
        ) as unknown as GhanaCardPersonalIdentificationNumberView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("GHA-123456789-1");
        expect(host.value).toBe("GHA-123456789-1");

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
