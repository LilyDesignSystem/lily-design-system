import { afterEach, describe, expect, test } from "vitest";

import { PeruDocumentoNacionalDeIdentidadInput } from "./peru-documento-nacional-de-identidad-input.js";

if (!customElements.get("lily-peru-documento-nacional-de-identidad-input")) {
    customElements.define(
        "lily-peru-documento-nacional-de-identidad-input",
        PeruDocumentoNacionalDeIdentidadInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PeruDocumentoNacionalDeIdentidadInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-peru-documento-nacional-de-identidad-input label="Documento Nacional de Identidad (DNI)"></lily-peru-documento-nacional-de-identidad-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("peru-documento-nacional-de-identidad-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-peru-documento-nacional-de-identidad-input label="Documento Nacional de Identidad (DNI)" autocomplete="on"></lily-peru-documento-nacional-de-identidad-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-peru-documento-nacional-de-identidad-input label="Documento Nacional de Identidad (DNI)" value="10117410-2"></lily-peru-documento-nacional-de-identidad-input>',
        ) as unknown as PeruDocumentoNacionalDeIdentidadInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("10117410-2");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-peru-documento-nacional-de-identidad-input label="Documento Nacional de Identidad (DNI)" required disabled></lily-peru-documento-nacional-de-identidad-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-peru-documento-nacional-de-identidad-input label="Documento Nacional de Identidad (DNI)"></lily-peru-documento-nacional-de-identidad-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Documento Nacional de Identidad (DNI)",
        );
    });
});
