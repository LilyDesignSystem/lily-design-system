import { afterEach, describe, expect, test } from "vitest";

import { NigeriaNationalIdentificationNumberView } from "./nigeria-national-identification-number-view.js";

if (!customElements.get("lily-nigeria-national-identification-number-view")) {
    customElements.define(
        "lily-nigeria-national-identification-number-view",
        NigeriaNationalIdentificationNumberView,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NigeriaNationalIdentificationNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-nigeria-national-identification-number-view label="National Identification Number (NIN)" value="12345678901"></lily-nigeria-national-identification-number-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("nigeria-national-identification-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-nigeria-national-identification-number-view label="National Identification Number (NIN)" value="12345678901"></lily-nigeria-national-identification-number-view>',
        );

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe(
            "National Identification Number (NIN)",
        );
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-nigeria-national-identification-number-view label="National Identification Number (NIN)" value="12345678901"></lily-nigeria-national-identification-number-view>',
        ) as unknown as NigeriaNationalIdentificationNumberView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("12345678901");
        expect(host.value).toBe("12345678901");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render(
            '<lily-nigeria-national-identification-number-view label="National Identification Number (NIN)" value="12345678901"></lily-nigeria-national-identification-number-view>',
        );

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
