import { afterEach, describe, expect, test } from "vitest";

import { KyprosNationalPassportNumberInput } from "./kypros-national-passport-number-input.js";

if (!customElements.get("lily-kypros-national-passport-number-input")) {
    customElements.define("lily-kypros-national-passport-number-input", KyprosNationalPassportNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("KyprosNationalPassportNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-kypros-national-passport-number-input label="ID"></lily-kypros-national-passport-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("kypros-national-passport-number-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-kypros-national-passport-number-input label="ID" autocomplete="on"></lily-kypros-national-passport-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-kypros-national-passport-number-input label="ID" value="K12345678"></lily-kypros-national-passport-number-input>') as unknown as KyprosNationalPassportNumberInput;

        expect(host.value).toBe("K12345678");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-kypros-national-passport-number-input label="ID" required disabled></lily-kypros-national-passport-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-kypros-national-passport-number-input label="National Passport Number"></lily-kypros-national-passport-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("National Passport Number");
    });
});
