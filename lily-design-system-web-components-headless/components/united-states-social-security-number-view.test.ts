import { afterEach, describe, expect, test } from "vitest";

import { UnitedStatesSocialSecurityNumberView } from "./united-states-social-security-number-view.js";

if (!customElements.get("lily-united-states-social-security-number-view")) {
    customElements.define("lily-united-states-social-security-number-view", UnitedStatesSocialSecurityNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("UnitedStatesSocialSecurityNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-united-states-social-security-number-view label="Social Security number"></lily-united-states-social-security-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("united-states-social-security-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-united-states-social-security-number-view label="Social Security number"></lily-united-states-social-security-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Social Security number");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-united-states-social-security-number-view label="Social Security number" value="123-45-6789"></lily-united-states-social-security-number-view>') as unknown as UnitedStatesSocialSecurityNumberView;

        expect(host.value).toBe("123-45-6789");
        expect(host.querySelector("span")!.textContent).toBe("123-45-6789");

        host.value = "987-65-4321";
        expect(host.querySelector("span")!.textContent).toBe("987-65-4321");
        expect(host.value).toBe("987-65-4321");
    });
});
