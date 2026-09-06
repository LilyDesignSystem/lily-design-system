import { afterEach, describe, expect, test } from "vitest";

import { MaltaNationalIdentificationNumberView } from "./malta-national-identification-number-view.js";

if (!customElements.get("lily-malta-national-identification-number-view")) {
    customElements.define("lily-malta-national-identification-number-view", MaltaNationalIdentificationNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MaltaNationalIdentificationNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-malta-national-identification-number-view label="National Identification Number" value="1234567M"></lily-malta-national-identification-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("malta-national-identification-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-malta-national-identification-number-view label="National Identification Number" value="1234567M"></lily-malta-national-identification-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("National Identification Number");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-malta-national-identification-number-view label="National Identification Number" value="1234567M"></lily-malta-national-identification-number-view>') as unknown as MaltaNationalIdentificationNumberView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("1234567M");
        expect(host.value).toBe("1234567M");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-malta-national-identification-number-view label="National Identification Number" value="1234567M"></lily-malta-national-identification-number-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
