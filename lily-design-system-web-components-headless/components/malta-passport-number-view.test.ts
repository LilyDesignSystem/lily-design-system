import { afterEach, describe, expect, test } from "vitest";

import { MaltaPassportNumberView } from "./malta-passport-number-view.js";

if (!customElements.get("lily-malta-passport-number-view")) {
    customElements.define("lily-malta-passport-number-view", MaltaPassportNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MaltaPassportNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-malta-passport-number-view label="Passport Number" value="1234567"></lily-malta-passport-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("malta-passport-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-malta-passport-number-view label="Passport Number" value="1234567"></lily-malta-passport-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Passport Number");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-malta-passport-number-view label="Passport Number" value="1234567"></lily-malta-passport-number-view>') as unknown as MaltaPassportNumberView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("1234567");
        expect(host.value).toBe("1234567");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-malta-passport-number-view label="Passport Number" value="1234567"></lily-malta-passport-number-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
