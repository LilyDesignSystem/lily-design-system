import { afterEach, describe, expect, test } from "vitest";

import { UnitedStatesSocialSecurityNumberInput } from "./united-states-social-security-number-input.js";

if (!customElements.get("lily-united-states-social-security-number-input")) {
    customElements.define("lily-united-states-social-security-number-input", UnitedStatesSocialSecurityNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("UnitedStatesSocialSecurityNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-united-states-social-security-number-input label="Social Security number"></lily-united-states-social-security-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("united-states-social-security-number-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-united-states-social-security-number-input label="Social Security number" autocomplete="on"></lily-united-states-social-security-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("always sets the documented pattern and inputmode=numeric", () => {
        const host = render('<lily-united-states-social-security-number-input label="Social Security number"></lily-united-states-social-security-number-input>');

        const input = host.querySelector("input")!;
        expect(input.getAttribute("pattern")).toBe("[0-9]{3}-[0-9]{2}-[0-9]{4}");
        expect(input.getAttribute("inputmode")).toBe("numeric");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-united-states-social-security-number-input label="Social Security number" value="123-45-6789"></lily-united-states-social-security-number-input>') as unknown as UnitedStatesSocialSecurityNumberInput;

        expect(host.value).toBe("123-45-6789");

        host.value = "987-65-4321";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("987-65-4321");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-united-states-social-security-number-input label="Social Security number" required disabled></lily-united-states-social-security-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-united-states-social-security-number-input label="Social Security number"></lily-united-states-social-security-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Social Security number");
    });
});
