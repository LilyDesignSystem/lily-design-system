import { afterEach, describe, expect, test } from "vitest";

import { MaltaPassportNumberInput } from "./malta-passport-number-input.js";

if (!customElements.get("lily-malta-passport-number-input")) {
    customElements.define("lily-malta-passport-number-input", MaltaPassportNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MaltaPassportNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-malta-passport-number-input label="Passport Number"></lily-malta-passport-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("malta-passport-number-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-malta-passport-number-input label="Passport Number" autocomplete="on"></lily-malta-passport-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-malta-passport-number-input label="Passport Number" value="1234567"></lily-malta-passport-number-input>') as unknown as MaltaPassportNumberInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1234567");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-malta-passport-number-input label="Passport Number" required disabled></lily-malta-passport-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-malta-passport-number-input label="Passport Number"></lily-malta-passport-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Passport Number");
    });
});
