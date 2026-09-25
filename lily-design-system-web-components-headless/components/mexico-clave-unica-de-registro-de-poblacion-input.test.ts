import { afterEach, describe, expect, test } from "vitest";

import { MexicoClaveUnicaDeRegistroDePoblacionInput } from "./mexico-clave-unica-de-registro-de-poblacion-input.js";

if (!customElements.get("lily-mexico-clave-unica-de-registro-de-poblacion-input")) {
    customElements.define("lily-mexico-clave-unica-de-registro-de-poblacion-input", MexicoClaveUnicaDeRegistroDePoblacionInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MexicoClaveUnicaDeRegistroDePoblacionInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-mexico-clave-unica-de-registro-de-poblacion-input label="Clave Única de Registro de Población (CURP)"></lily-mexico-clave-unica-de-registro-de-poblacion-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("mexico-clave-unica-de-registro-de-poblacion-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-mexico-clave-unica-de-registro-de-poblacion-input label="Clave Única de Registro de Población (CURP)" autocomplete="on"></lily-mexico-clave-unica-de-registro-de-poblacion-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-mexico-clave-unica-de-registro-de-poblacion-input label="Clave Única de Registro de Población (CURP)" value="XAXX010101HNEXXXA4"></lily-mexico-clave-unica-de-registro-de-poblacion-input>') as unknown as MexicoClaveUnicaDeRegistroDePoblacionInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("XAXX010101HNEXXXA4");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-mexico-clave-unica-de-registro-de-poblacion-input label="Clave Única de Registro de Población (CURP)" required disabled></lily-mexico-clave-unica-de-registro-de-poblacion-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-mexico-clave-unica-de-registro-de-poblacion-input label="Clave Única de Registro de Población (CURP)"></lily-mexico-clave-unica-de-registro-de-poblacion-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Clave Única de Registro de Población (CURP)");
    });
});
