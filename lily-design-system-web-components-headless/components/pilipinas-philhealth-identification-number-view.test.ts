import { afterEach, describe, expect, test } from "vitest";

import { PilipinasPhilhealthIdentificationNumberView } from "./pilipinas-philhealth-identification-number-view.js";

if (!customElements.get("lily-pilipinas-philhealth-identification-number-view")) {
    customElements.define("lily-pilipinas-philhealth-identification-number-view", PilipinasPhilhealthIdentificationNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PilipinasPhilhealthIdentificationNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-pilipinas-philhealth-identification-number-view label="PhilHealth Identification Number (PIN)" value="12-345678901-2"></lily-pilipinas-philhealth-identification-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("pilipinas-philhealth-identification-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-pilipinas-philhealth-identification-number-view label="PhilHealth Identification Number (PIN)" value="12-345678901-2"></lily-pilipinas-philhealth-identification-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("PhilHealth Identification Number (PIN)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-pilipinas-philhealth-identification-number-view label="PhilHealth Identification Number (PIN)" value="12-345678901-2"></lily-pilipinas-philhealth-identification-number-view>') as unknown as PilipinasPhilhealthIdentificationNumberView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("12-345678901-2");
        expect(host.value).toBe("12-345678901-2");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-pilipinas-philhealth-identification-number-view label="PhilHealth Identification Number (PIN)" value="12-345678901-2"></lily-pilipinas-philhealth-identification-number-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
