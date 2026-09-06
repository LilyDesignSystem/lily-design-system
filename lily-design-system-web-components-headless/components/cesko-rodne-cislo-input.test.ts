import { afterEach, describe, expect, test } from "vitest";

import { CeskoRodneCisloInput } from "./cesko-rodne-cislo-input.js";

if (!customElements.get("lily-cesko-rodne-cislo-input")) {
    customElements.define("lily-cesko-rodne-cislo-input", CeskoRodneCisloInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CeskoRodneCisloInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-cesko-rodne-cislo-input label="ID"></lily-cesko-rodne-cislo-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("cesko-rodne-cislo-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-cesko-rodne-cislo-input label="ID" autocomplete="on"></lily-cesko-rodne-cislo-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-cesko-rodne-cislo-input label="ID" value="855323/1237"></lily-cesko-rodne-cislo-input>') as unknown as CeskoRodneCisloInput;

        expect(host.value).toBe("855323/1237");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-cesko-rodne-cislo-input label="ID" required disabled></lily-cesko-rodne-cislo-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-cesko-rodne-cislo-input label="Rodné Číslo"></lily-cesko-rodne-cislo-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Rodné Číslo");
    });
});
