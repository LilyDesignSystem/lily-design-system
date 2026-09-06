import { afterEach, describe, expect, test } from "vitest";

import { UnitedKingdomNationalInsuranceNumberInput } from "./united-kingdom-national-insurance-number-input.js";

if (!customElements.get("lily-united-kingdom-national-insurance-number-input")) {
    customElements.define("lily-united-kingdom-national-insurance-number-input", UnitedKingdomNationalInsuranceNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("UnitedKingdomNationalInsuranceNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-united-kingdom-national-insurance-number-input label="National Insurance number"></lily-united-kingdom-national-insurance-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("united-kingdom-national-insurance-number-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-united-kingdom-national-insurance-number-input label="National Insurance number" autocomplete="on"></lily-united-kingdom-national-insurance-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-united-kingdom-national-insurance-number-input label="National Insurance number" value="AB123456C"></lily-united-kingdom-national-insurance-number-input>') as unknown as UnitedKingdomNationalInsuranceNumberInput;

        expect(host.value).toBe("AB123456C");

        host.value = "CD987654A";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("CD987654A");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-united-kingdom-national-insurance-number-input label="National Insurance number" required disabled></lily-united-kingdom-national-insurance-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-united-kingdom-national-insurance-number-input label="National Insurance number"></lily-united-kingdom-national-insurance-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("National Insurance number");
    });
});
