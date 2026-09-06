import { afterEach, describe, expect, test } from "vitest";

import { EspanaCodigoDeIdentificacionFiscalView } from "./espana-codigo-de-identificacion-fiscal-view.js";

if (!customElements.get("lily-espana-codigo-de-identificacion-fiscal-view")) {
    customElements.define("lily-espana-codigo-de-identificacion-fiscal-view", EspanaCodigoDeIdentificacionFiscalView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EspanaCodigoDeIdentificacionFiscalView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-espana-codigo-de-identificacion-fiscal-view label="ID"></lily-espana-codigo-de-identificacion-fiscal-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("espana-codigo-de-identificacion-fiscal-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-espana-codigo-de-identificacion-fiscal-view label="Código de Identificación Fiscal"></lily-espana-codigo-de-identificacion-fiscal-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Código de Identificación Fiscal");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-espana-codigo-de-identificacion-fiscal-view label="ID"></lily-espana-codigo-de-identificacion-fiscal-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-espana-codigo-de-identificacion-fiscal-view label="ID" value="A58818501"></lily-espana-codigo-de-identificacion-fiscal-view>') as unknown as EspanaCodigoDeIdentificacionFiscalView;

        expect(host.querySelector("span")!.textContent).toBe("A58818501");
        expect(host.value).toBe("A58818501");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
