import { afterEach, describe, expect, test } from "vitest";

import { RossiyaSnilsInput } from "./rossiya-snils-input.js";

if (!customElements.get("lily-rossiya-snils-input")) {
    customElements.define("lily-rossiya-snils-input", RossiyaSnilsInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RossiyaSnilsInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-rossiya-snils-input label="СНИЛС (SNILS)"></lily-rossiya-snils-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("rossiya-snils-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-rossiya-snils-input label="СНИЛС (SNILS)" autocomplete="on"></lily-rossiya-snils-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-rossiya-snils-input label="СНИЛС (SNILS)" value="112-233-445 95"></lily-rossiya-snils-input>') as unknown as RossiyaSnilsInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("112-233-445 95");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-rossiya-snils-input label="СНИЛС (SNILS)" required disabled></lily-rossiya-snils-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-rossiya-snils-input label="СНИЛС (SNILS)"></lily-rossiya-snils-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("СНИЛС (SNILS)");
    });
});
