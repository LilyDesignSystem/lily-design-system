import { afterEach, describe, expect, test } from "vitest";

import { PortugalNumeroDeIdentificacaoFiscalView } from "./portugal-numero-de-identificacao-fiscal-view.js";

if (!customElements.get("lily-portugal-numero-de-identificacao-fiscal-view")) {
    customElements.define("lily-portugal-numero-de-identificacao-fiscal-view", PortugalNumeroDeIdentificacaoFiscalView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PortugalNumeroDeIdentificacaoFiscalView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-portugal-numero-de-identificacao-fiscal-view label="Número de Identificação Fiscal (NIF)"></lily-portugal-numero-de-identificacao-fiscal-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("portugal-numero-de-identificacao-fiscal-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-portugal-numero-de-identificacao-fiscal-view label="Número de Identificação Fiscal (NIF)"></lily-portugal-numero-de-identificacao-fiscal-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Número de Identificação Fiscal (NIF)");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-portugal-numero-de-identificacao-fiscal-view label="Número de Identificação Fiscal (NIF)" value="123456789"></lily-portugal-numero-de-identificacao-fiscal-view>') as unknown as PortugalNumeroDeIdentificacaoFiscalView;

        expect(host.value).toBe("123456789");
        expect(host.querySelector("span")!.textContent).toBe("123456789");

        host.value = "198765432";
        expect(host.querySelector("span")!.textContent).toBe("198765432");
        expect(host.value).toBe("198765432");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render('<lily-portugal-numero-de-identificacao-fiscal-view label="Número de Identificação Fiscal (NIF)"></lily-portugal-numero-de-identificacao-fiscal-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
