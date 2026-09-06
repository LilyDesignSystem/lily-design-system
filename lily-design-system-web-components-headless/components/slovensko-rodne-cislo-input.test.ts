import { afterEach, describe, expect, test } from "vitest";

import { SlovenskoRodneCisloInput } from "./slovensko-rodne-cislo-input.js";

if (!customElements.get("lily-slovensko-rodne-cislo-input")) {
    customElements.define("lily-slovensko-rodne-cislo-input", SlovenskoRodneCisloInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SlovenskoRodneCisloInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-slovensko-rodne-cislo-input label="Rodné číslo (RČ)"></lily-slovensko-rodne-cislo-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("slovensko-rodne-cislo-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-slovensko-rodne-cislo-input label="Rodné číslo (RČ)" autocomplete="on"></lily-slovensko-rodne-cislo-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-slovensko-rodne-cislo-input label="Rodné číslo (RČ)" value="9606234816"></lily-slovensko-rodne-cislo-input>') as unknown as SlovenskoRodneCisloInput;

        expect(host.value).toBe("9606234816");

        host.value = "0055998273";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("0055998273");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-slovensko-rodne-cislo-input label="Rodné číslo (RČ)" required disabled></lily-slovensko-rodne-cislo-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-slovensko-rodne-cislo-input label="Rodné číslo (RČ)"></lily-slovensko-rodne-cislo-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Rodné číslo (RČ)");
    });
});
