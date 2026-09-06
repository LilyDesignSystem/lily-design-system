import { afterEach, describe, expect, test } from "vitest";

import { PortugalNumeroDeIdentificacaoFiscalInput } from "./portugal-numero-de-identificacao-fiscal-input.js";

if (!customElements.get("lily-portugal-numero-de-identificacao-fiscal-input")) {
    customElements.define("lily-portugal-numero-de-identificacao-fiscal-input", PortugalNumeroDeIdentificacaoFiscalInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PortugalNumeroDeIdentificacaoFiscalInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-portugal-numero-de-identificacao-fiscal-input label="Número de Identificação Fiscal (NIF)"></lily-portugal-numero-de-identificacao-fiscal-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("portugal-numero-de-identificacao-fiscal-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-portugal-numero-de-identificacao-fiscal-input label="Número de Identificação Fiscal (NIF)" autocomplete="on"></lily-portugal-numero-de-identificacao-fiscal-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-portugal-numero-de-identificacao-fiscal-input label="Número de Identificação Fiscal (NIF)" value="123456789"></lily-portugal-numero-de-identificacao-fiscal-input>') as unknown as PortugalNumeroDeIdentificacaoFiscalInput;

        expect(host.value).toBe("123456789");

        host.value = "198765432";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("198765432");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-portugal-numero-de-identificacao-fiscal-input label="Número de Identificação Fiscal (NIF)" required disabled></lily-portugal-numero-de-identificacao-fiscal-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-portugal-numero-de-identificacao-fiscal-input label="Número de Identificação Fiscal (NIF)"></lily-portugal-numero-de-identificacao-fiscal-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Número de Identificação Fiscal (NIF)");
    });
});
