import { afterEach, describe, expect, test } from "vitest";

import { CostaRicaCedulaDeIdentidadInput } from "./costa-rica-cedula-de-identidad-input.js";

if (!customElements.get("lily-costa-rica-cedula-de-identidad-input")) {
    customElements.define(
        "lily-costa-rica-cedula-de-identidad-input",
        CostaRicaCedulaDeIdentidadInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CostaRicaCedulaDeIdentidadInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-costa-rica-cedula-de-identidad-input label="Cédula de Identidad"></lily-costa-rica-cedula-de-identidad-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("costa-rica-cedula-de-identidad-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-costa-rica-cedula-de-identidad-input label="Cédula de Identidad" autocomplete="on"></lily-costa-rica-cedula-de-identidad-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-costa-rica-cedula-de-identidad-input label="Cédula de Identidad" value="1-0613-0584"></lily-costa-rica-cedula-de-identidad-input>',
        ) as unknown as CostaRicaCedulaDeIdentidadInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1-0613-0584");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-costa-rica-cedula-de-identidad-input label="Cédula de Identidad" required disabled></lily-costa-rica-cedula-de-identidad-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-costa-rica-cedula-de-identidad-input label="Cédula de Identidad"></lily-costa-rica-cedula-de-identidad-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Cédula de Identidad");
    });
});
