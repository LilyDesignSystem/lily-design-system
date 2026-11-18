import { afterEach, describe, expect, test } from "vitest";

import { UnitedKingdomNationalInsuranceNumberView } from "./united-kingdom-national-insurance-number-view.js";

if (!customElements.get("lily-united-kingdom-national-insurance-number-view")) {
    customElements.define(
        "lily-united-kingdom-national-insurance-number-view",
        UnitedKingdomNationalInsuranceNumberView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("UnitedKingdomNationalInsuranceNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-united-kingdom-national-insurance-number-view label="National Insurance number"></lily-united-kingdom-national-insurance-number-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("united-kingdom-national-insurance-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-united-kingdom-national-insurance-number-view label="National Insurance number"></lily-united-kingdom-national-insurance-number-view>',
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
        ).toBe(`${"National Insurance number"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render(
            '<lily-united-kingdom-national-insurance-number-view label="National Insurance number" value="AB123456C"></lily-united-kingdom-national-insurance-number-view>',
        ) as unknown as UnitedKingdomNationalInsuranceNumberView;

        expect(host.value).toBe("AB123456C");
        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("AB123456C");

        host.value = "CD987654A";
        expect(
            host
                .querySelector("span")!
                .textContent?.replace(
                    host.querySelector("span")!.querySelector(".screen-reader-span")?.textContent ??
                        "",
                    "",
                ),
        ).toBe("CD987654A");
        expect(host.value).toBe("CD987654A");
    });
});
