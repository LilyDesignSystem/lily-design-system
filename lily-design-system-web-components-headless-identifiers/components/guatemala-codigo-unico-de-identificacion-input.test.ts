import { afterEach, describe, expect, test } from "vitest";

import { GuatemalaCodigoUnicoDeIdentificacionInput } from "./guatemala-codigo-unico-de-identificacion-input.js";

if (!customElements.get("lily-guatemala-codigo-unico-de-identificacion-input")) {
    customElements.define(
        "lily-guatemala-codigo-unico-de-identificacion-input",
        GuatemalaCodigoUnicoDeIdentificacionInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GuatemalaCodigoUnicoDeIdentificacionInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-guatemala-codigo-unico-de-identificacion-input label="Código Único de Identificación (CUI)"></lily-guatemala-codigo-unico-de-identificacion-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("guatemala-codigo-unico-de-identificacion-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-guatemala-codigo-unico-de-identificacion-input label="Código Único de Identificación (CUI)" autocomplete="on"></lily-guatemala-codigo-unico-de-identificacion-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-guatemala-codigo-unico-de-identificacion-input label="Código Único de Identificación (CUI)" value="1234 56789 0101"></lily-guatemala-codigo-unico-de-identificacion-input>',
        ) as unknown as GuatemalaCodigoUnicoDeIdentificacionInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1234 56789 0101");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-guatemala-codigo-unico-de-identificacion-input label="Código Único de Identificación (CUI)" required disabled></lily-guatemala-codigo-unico-de-identificacion-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-guatemala-codigo-unico-de-identificacion-input label="Código Único de Identificación (CUI)"></lily-guatemala-codigo-unico-de-identificacion-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Código Único de Identificación (CUI)",
        );
    });
});
