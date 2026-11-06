import { afterEach, describe, expect, test } from "vitest";

import { MisrAlRaqmAlQawmiView } from "./misr-al-raqm-al-qawmi-view.js";

if (!customElements.get("lily-misr-al-raqm-al-qawmi-view")) {
    customElements.define("lily-misr-al-raqm-al-qawmi-view", MisrAlRaqmAlQawmiView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MisrAlRaqmAlQawmiView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-misr-al-raqm-al-qawmi-view label="الرقم القومي (National Number)" value="29001011234567"></lily-misr-al-raqm-al-qawmi-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("misr-al-raqm-al-qawmi-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-misr-al-raqm-al-qawmi-view label="الرقم القومي (National Number)" value="29001011234567"></lily-misr-al-raqm-al-qawmi-view>',
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
        ).toBe(`${"الرقم القومي (National Number)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-misr-al-raqm-al-qawmi-view label="الرقم القومي (National Number)" value="29001011234567"></lily-misr-al-raqm-al-qawmi-view>',
        ) as unknown as MisrAlRaqmAlQawmiView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("29001011234567");
        expect(host.value).toBe("29001011234567");

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
