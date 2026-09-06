import { afterEach, describe, expect, test } from "vitest";

import { RomaniaCodNumericPersonalInput } from "./romania-cod-numeric-personal-input.js";

if (!customElements.get("lily-romania-cod-numeric-personal-input")) {
    customElements.define("lily-romania-cod-numeric-personal-input", RomaniaCodNumericPersonalInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RomaniaCodNumericPersonalInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-romania-cod-numeric-personal-input label="Cod Numeric Personal (CNP)"></lily-romania-cod-numeric-personal-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("romania-cod-numeric-personal-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-romania-cod-numeric-personal-input label="Cod Numeric Personal (CNP)" autocomplete="on"></lily-romania-cod-numeric-personal-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-romania-cod-numeric-personal-input label="Cod Numeric Personal (CNP)" value="1900101221144"></lily-romania-cod-numeric-personal-input>') as unknown as RomaniaCodNumericPersonalInput;

        expect(host.value).toBe("1900101221144");

        host.value = "2900101221159";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("2900101221159");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-romania-cod-numeric-personal-input label="Cod Numeric Personal (CNP)" required disabled></lily-romania-cod-numeric-personal-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-romania-cod-numeric-personal-input label="Cod Numeric Personal (CNP)"></lily-romania-cod-numeric-personal-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Cod Numeric Personal (CNP)");
    });
});
