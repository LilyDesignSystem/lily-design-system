import { afterEach, describe, expect, test } from "vitest";

import { OsterreichSozialversicherungsnummerInput } from "./osterreich-sozialversicherungsnummer-input.js";

if (!customElements.get("lily-osterreich-sozialversicherungsnummer-input")) {
    customElements.define("lily-osterreich-sozialversicherungsnummer-input", OsterreichSozialversicherungsnummerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("OsterreichSozialversicherungsnummerInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-osterreich-sozialversicherungsnummer-input label="Sozialversicherungsnummer (SVNR)"></lily-osterreich-sozialversicherungsnummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("osterreich-sozialversicherungsnummer-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-osterreich-sozialversicherungsnummer-input label="Sozialversicherungsnummer (SVNR)" autocomplete="on"></lily-osterreich-sozialversicherungsnummer-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-osterreich-sozialversicherungsnummer-input label="Sozialversicherungsnummer (SVNR)" value="1234 010180"></lily-osterreich-sozialversicherungsnummer-input>') as unknown as OsterreichSozialversicherungsnummerInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1234 010180");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-osterreich-sozialversicherungsnummer-input label="Sozialversicherungsnummer (SVNR)" required disabled></lily-osterreich-sozialversicherungsnummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-osterreich-sozialversicherungsnummer-input label="Sozialversicherungsnummer (SVNR)"></lily-osterreich-sozialversicherungsnummer-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Sozialversicherungsnummer (SVNR)");
    });
});
