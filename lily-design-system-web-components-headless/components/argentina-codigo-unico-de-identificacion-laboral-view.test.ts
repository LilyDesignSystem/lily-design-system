import { afterEach, describe, expect, test } from "vitest";

import { ArgentinaCodigoUnicoDeIdentificacionLaboralView } from "./argentina-codigo-unico-de-identificacion-laboral-view.js";

if (!customElements.get("lily-argentina-codigo-unico-de-identificacion-laboral-view")) {
    customElements.define("lily-argentina-codigo-unico-de-identificacion-laboral-view", ArgentinaCodigoUnicoDeIdentificacionLaboralView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-argentina-codigo-unico-de-identificacion-laboral-view label="Código Único de Identificación Laboral (CUIL)" value="20-12345678-9"></lily-argentina-codigo-unico-de-identificacion-laboral-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("argentina-codigo-unico-de-identificacion-laboral-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-argentina-codigo-unico-de-identificacion-laboral-view label="Código Único de Identificación Laboral (CUIL)" value="20-12345678-9"></lily-argentina-codigo-unico-de-identificacion-laboral-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Código Único de Identificación Laboral (CUIL)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-argentina-codigo-unico-de-identificacion-laboral-view label="Código Único de Identificación Laboral (CUIL)" value="20-12345678-9"></lily-argentina-codigo-unico-de-identificacion-laboral-view>') as unknown as ArgentinaCodigoUnicoDeIdentificacionLaboralView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("20-12345678-9");
        expect(host.value).toBe("20-12345678-9");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-argentina-codigo-unico-de-identificacion-laboral-view label="Código Único de Identificación Laboral (CUIL)" value="20-12345678-9"></lily-argentina-codigo-unico-de-identificacion-laboral-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
