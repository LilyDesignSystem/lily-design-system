import { afterEach, describe, expect, test } from "vitest";

import { EspanaCodigoDeIdentificacionFiscalInput } from "./espana-codigo-de-identificacion-fiscal-input.js";

if (!customElements.get("lily-espana-codigo-de-identificacion-fiscal-input")) {
    customElements.define("lily-espana-codigo-de-identificacion-fiscal-input", EspanaCodigoDeIdentificacionFiscalInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EspanaCodigoDeIdentificacionFiscalInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-espana-codigo-de-identificacion-fiscal-input label="ID"></lily-espana-codigo-de-identificacion-fiscal-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("espana-codigo-de-identificacion-fiscal-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-espana-codigo-de-identificacion-fiscal-input label="ID" autocomplete="on"></lily-espana-codigo-de-identificacion-fiscal-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-espana-codigo-de-identificacion-fiscal-input label="ID" value="A58818501"></lily-espana-codigo-de-identificacion-fiscal-input>') as unknown as EspanaCodigoDeIdentificacionFiscalInput;

        expect(host.value).toBe("A58818501");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-espana-codigo-de-identificacion-fiscal-input label="ID" required disabled></lily-espana-codigo-de-identificacion-fiscal-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-espana-codigo-de-identificacion-fiscal-input label="Código de Identificación Fiscal"></lily-espana-codigo-de-identificacion-fiscal-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Código de Identificación Fiscal");
    });
});
