import { afterEach, describe, expect, test } from "vitest";

import { LiechtensteinPassportNumberView } from "./liechtenstein-passport-number-view.js";

if (!customElements.get("lily-liechtenstein-passport-number-view")) {
    customElements.define("lily-liechtenstein-passport-number-view", LiechtensteinPassportNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LiechtensteinPassportNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-liechtenstein-passport-number-view label="Passport Number" value="R00536"></lily-liechtenstein-passport-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("liechtenstein-passport-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-liechtenstein-passport-number-view label="Passport Number" value="R00536"></lily-liechtenstein-passport-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Passport Number");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-liechtenstein-passport-number-view label="Passport Number" value="R00536"></lily-liechtenstein-passport-number-view>') as unknown as LiechtensteinPassportNumberView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("R00536");
        expect(host.value).toBe("R00536");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-liechtenstein-passport-number-view label="Passport Number" value="R00536"></lily-liechtenstein-passport-number-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
