import { afterEach, describe, expect, test } from "vitest";

import { CanadaSocialInsuranceNumberInput } from "./canada-social-insurance-number-input.js";

if (!customElements.get("lily-canada-social-insurance-number-input")) {
    customElements.define("lily-canada-social-insurance-number-input", CanadaSocialInsuranceNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CanadaSocialInsuranceNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-canada-social-insurance-number-input label="Social Insurance Number (SIN)"></lily-canada-social-insurance-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("canada-social-insurance-number-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-canada-social-insurance-number-input label="Social Insurance Number (SIN)" autocomplete="on"></lily-canada-social-insurance-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-canada-social-insurance-number-input label="Social Insurance Number (SIN)" value="123 456 782"></lily-canada-social-insurance-number-input>') as unknown as CanadaSocialInsuranceNumberInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("123 456 782");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-canada-social-insurance-number-input label="Social Insurance Number (SIN)" required disabled></lily-canada-social-insurance-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-canada-social-insurance-number-input label="Social Insurance Number (SIN)"></lily-canada-social-insurance-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Social Insurance Number (SIN)");
    });
});
