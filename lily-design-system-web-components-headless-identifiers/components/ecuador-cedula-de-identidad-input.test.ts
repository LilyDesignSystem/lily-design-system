import { afterEach, describe, expect, test } from "vitest";

import { EcuadorCedulaDeIdentidadInput } from "./ecuador-cedula-de-identidad-input.js";

if (!customElements.get("lily-ecuador-cedula-de-identidad-input")) {
    customElements.define("lily-ecuador-cedula-de-identidad-input", EcuadorCedulaDeIdentidadInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EcuadorCedulaDeIdentidadInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-ecuador-cedula-de-identidad-input label="Cedula de Identidad Number"></lily-ecuador-cedula-de-identidad-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("ecuador-cedula-de-identidad-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-ecuador-cedula-de-identidad-input label="Cedula de Identidad Number" autocomplete="on"></lily-ecuador-cedula-de-identidad-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-ecuador-cedula-de-identidad-input label="Cedula de Identidad Number" value="1710034065"></lily-ecuador-cedula-de-identidad-input>',
        ) as unknown as EcuadorCedulaDeIdentidadInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1710034065");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-ecuador-cedula-de-identidad-input label="Cedula de Identidad Number" required disabled></lily-ecuador-cedula-de-identidad-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-ecuador-cedula-de-identidad-input label="Cedula de Identidad Number"></lily-ecuador-cedula-de-identidad-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Cedula de Identidad Number",
        );
    });
});
