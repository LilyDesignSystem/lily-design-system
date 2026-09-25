import { afterEach, describe, expect, test } from "vitest";

import { PilipinasPhilhealthIdentificationNumberInput } from "./pilipinas-philhealth-identification-number-input.js";

if (!customElements.get("lily-pilipinas-philhealth-identification-number-input")) {
    customElements.define("lily-pilipinas-philhealth-identification-number-input", PilipinasPhilhealthIdentificationNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PilipinasPhilhealthIdentificationNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-pilipinas-philhealth-identification-number-input label="PhilHealth Identification Number (PIN)"></lily-pilipinas-philhealth-identification-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("pilipinas-philhealth-identification-number-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-pilipinas-philhealth-identification-number-input label="PhilHealth Identification Number (PIN)" autocomplete="on"></lily-pilipinas-philhealth-identification-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-pilipinas-philhealth-identification-number-input label="PhilHealth Identification Number (PIN)" value="12-345678901-2"></lily-pilipinas-philhealth-identification-number-input>') as unknown as PilipinasPhilhealthIdentificationNumberInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("12-345678901-2");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-pilipinas-philhealth-identification-number-input label="PhilHealth Identification Number (PIN)" required disabled></lily-pilipinas-philhealth-identification-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-pilipinas-philhealth-identification-number-input label="PhilHealth Identification Number (PIN)"></lily-pilipinas-philhealth-identification-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("PhilHealth Identification Number (PIN)");
    });
});
