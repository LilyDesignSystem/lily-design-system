import { afterEach, describe, expect, test } from "vitest";

import { EcuadorCedulaDeIdentidadView } from "./ecuador-cedula-de-identidad-view.js";

if (!customElements.get("lily-ecuador-cedula-de-identidad-view")) {
    customElements.define("lily-ecuador-cedula-de-identidad-view", EcuadorCedulaDeIdentidadView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EcuadorCedulaDeIdentidadView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-ecuador-cedula-de-identidad-view label="Cedula de Identidad Number" value="1710034065"></lily-ecuador-cedula-de-identidad-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("ecuador-cedula-de-identidad-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-ecuador-cedula-de-identidad-view label="Cedula de Identidad Number" value="1710034065"></lily-ecuador-cedula-de-identidad-view>',
        );

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe(
            "Cedula de Identidad Number",
        );
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-ecuador-cedula-de-identidad-view label="Cedula de Identidad Number" value="1710034065"></lily-ecuador-cedula-de-identidad-view>',
        ) as unknown as EcuadorCedulaDeIdentidadView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("1710034065");
        expect(host.value).toBe("1710034065");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render(
            '<lily-ecuador-cedula-de-identidad-view label="Cedula de Identidad Number" value="1710034065"></lily-ecuador-cedula-de-identidad-view>',
        );

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
