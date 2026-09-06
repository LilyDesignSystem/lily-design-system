import { afterEach, describe, expect, test } from "vitest";

import { LiechtensteinPassportNumberInput } from "./liechtenstein-passport-number-input.js";

if (!customElements.get("lily-liechtenstein-passport-number-input")) {
    customElements.define("lily-liechtenstein-passport-number-input", LiechtensteinPassportNumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LiechtensteinPassportNumberInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-liechtenstein-passport-number-input label="Passport Number"></lily-liechtenstein-passport-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("liechtenstein-passport-number-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-liechtenstein-passport-number-input label="Passport Number" autocomplete="on"></lily-liechtenstein-passport-number-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-liechtenstein-passport-number-input label="Passport Number" value="R00536"></lily-liechtenstein-passport-number-input>') as unknown as LiechtensteinPassportNumberInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("R00536");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-liechtenstein-passport-number-input label="Passport Number" required disabled></lily-liechtenstein-passport-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-liechtenstein-passport-number-input label="Passport Number"></lily-liechtenstein-passport-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Passport Number");
    });
});
