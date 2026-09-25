import { afterEach, describe, expect, test } from "vitest";

import { ArgentinaCodigoUnicoDeIdentificacionLaboralInput } from "./argentina-codigo-unico-de-identificacion-laboral-input.js";

if (!customElements.get("lily-argentina-codigo-unico-de-identificacion-laboral-input")) {
    customElements.define("lily-argentina-codigo-unico-de-identificacion-laboral-input", ArgentinaCodigoUnicoDeIdentificacionLaboralInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-argentina-codigo-unico-de-identificacion-laboral-input label="Código Único de Identificación Laboral (CUIL)"></lily-argentina-codigo-unico-de-identificacion-laboral-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("argentina-codigo-unico-de-identificacion-laboral-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-argentina-codigo-unico-de-identificacion-laboral-input label="Código Único de Identificación Laboral (CUIL)" autocomplete="on"></lily-argentina-codigo-unico-de-identificacion-laboral-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-argentina-codigo-unico-de-identificacion-laboral-input label="Código Único de Identificación Laboral (CUIL)" value="20-12345678-9"></lily-argentina-codigo-unico-de-identificacion-laboral-input>') as unknown as ArgentinaCodigoUnicoDeIdentificacionLaboralInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("20-12345678-9");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-argentina-codigo-unico-de-identificacion-laboral-input label="Código Único de Identificación Laboral (CUIL)" required disabled></lily-argentina-codigo-unico-de-identificacion-laboral-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-argentina-codigo-unico-de-identificacion-laboral-input label="Código Único de Identificación Laboral (CUIL)"></lily-argentina-codigo-unico-de-identificacion-laboral-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Código Único de Identificación Laboral (CUIL)");
    });
});
