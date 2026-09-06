import { afterEach, describe, expect, test } from "vitest";

import { LiechtensteinNationalIdentityCardNumberView } from "./liechtenstein-national-identity-card-number-view.js";

if (!customElements.get("lily-liechtenstein-national-identity-card-number-view")) {
    customElements.define("lily-liechtenstein-national-identity-card-number-view", LiechtensteinNationalIdentityCardNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LiechtensteinNationalIdentityCardNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-liechtenstein-national-identity-card-number-view label="National Identity Card Number" value="ID022143586"></lily-liechtenstein-national-identity-card-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("liechtenstein-national-identity-card-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-liechtenstein-national-identity-card-number-view label="National Identity Card Number" value="ID022143586"></lily-liechtenstein-national-identity-card-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("National Identity Card Number");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-liechtenstein-national-identity-card-number-view label="National Identity Card Number" value="ID022143586"></lily-liechtenstein-national-identity-card-number-view>') as unknown as LiechtensteinNationalIdentityCardNumberView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("ID022143586");
        expect(host.value).toBe("ID022143586");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-liechtenstein-national-identity-card-number-view label="National Identity Card Number" value="ID022143586"></lily-liechtenstein-national-identity-card-number-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
