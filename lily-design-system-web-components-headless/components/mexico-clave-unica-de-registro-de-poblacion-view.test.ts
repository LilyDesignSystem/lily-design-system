import { afterEach, describe, expect, test } from "vitest";

import { MexicoClaveUnicaDeRegistroDePoblacionView } from "./mexico-clave-unica-de-registro-de-poblacion-view.js";

if (!customElements.get("lily-mexico-clave-unica-de-registro-de-poblacion-view")) {
    customElements.define("lily-mexico-clave-unica-de-registro-de-poblacion-view", MexicoClaveUnicaDeRegistroDePoblacionView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MexicoClaveUnicaDeRegistroDePoblacionView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-mexico-clave-unica-de-registro-de-poblacion-view label="Clave Única de Registro de Población (CURP)" value="XAXX010101HNEXXXA4"></lily-mexico-clave-unica-de-registro-de-poblacion-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("mexico-clave-unica-de-registro-de-poblacion-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-mexico-clave-unica-de-registro-de-poblacion-view label="Clave Única de Registro de Población (CURP)" value="XAXX010101HNEXXXA4"></lily-mexico-clave-unica-de-registro-de-poblacion-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Clave Única de Registro de Población (CURP)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-mexico-clave-unica-de-registro-de-poblacion-view label="Clave Única de Registro de Población (CURP)" value="XAXX010101HNEXXXA4"></lily-mexico-clave-unica-de-registro-de-poblacion-view>') as unknown as MexicoClaveUnicaDeRegistroDePoblacionView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("XAXX010101HNEXXXA4");
        expect(host.value).toBe("XAXX010101HNEXXXA4");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-mexico-clave-unica-de-registro-de-poblacion-view label="Clave Única de Registro de Población (CURP)" value="XAXX010101HNEXXXA4"></lily-mexico-clave-unica-de-registro-de-poblacion-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
