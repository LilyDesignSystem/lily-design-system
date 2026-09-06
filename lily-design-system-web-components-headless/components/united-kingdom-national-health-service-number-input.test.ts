import { afterEach, describe, expect, test } from "vitest";

import { UnitedKingdomNationalHealthServiceNumberInput } from "./united-kingdom-national-health-service-number-input.js";

if (!customElements.get("lily-united-kingdom-national-health-service-number-input")) {
    customElements.define("lily-united-kingdom-national-health-service-number-input", UnitedKingdomNationalHealthServiceNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("UnitedKingdomNationalHealthServiceNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-united-kingdom-national-health-service-number-input label="NHS number"></lily-united-kingdom-national-health-service-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("united-kingdom-national-health-service-number-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-united-kingdom-national-health-service-number-input label="NHS number" autocomplete="on"></lily-united-kingdom-national-health-service-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("always sets the documented pattern and inputmode=numeric", () => {
        const host = render('<lily-united-kingdom-national-health-service-number-input label="NHS number"></lily-united-kingdom-national-health-service-number-input>');

        const input = host.querySelector("input")!;
        expect(input.getAttribute("pattern")).toBe("[0-9]{3} [0-9]{3} [0-9]{4}");
        expect(input.getAttribute("inputmode")).toBe("numeric");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-united-kingdom-national-health-service-number-input label="NHS number" value="943 476 5919"></lily-united-kingdom-national-health-service-number-input>') as unknown as UnitedKingdomNationalHealthServiceNumberInput;

        expect(host.value).toBe("943 476 5919");

        host.value = "485 777 3456";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("485 777 3456");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-united-kingdom-national-health-service-number-input label="NHS number" required disabled></lily-united-kingdom-national-health-service-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-united-kingdom-national-health-service-number-input label="NHS number"></lily-united-kingdom-national-health-service-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("NHS number");
    });
});
