import { afterEach, describe, expect, test } from "vitest";

import { UruguayCedulaDeIdentidadInput } from "./uruguay-cedula-de-identidad-input.js";

if (!customElements.get("lily-uruguay-cedula-de-identidad-input")) {
    customElements.define("lily-uruguay-cedula-de-identidad-input", UruguayCedulaDeIdentidadInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("UruguayCedulaDeIdentidadInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-uruguay-cedula-de-identidad-input label="Cedula de Identidad Number"></lily-uruguay-cedula-de-identidad-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("uruguay-cedula-de-identidad-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-uruguay-cedula-de-identidad-input label="Cedula de Identidad Number" autocomplete="on"></lily-uruguay-cedula-de-identidad-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-uruguay-cedula-de-identidad-input label="Cedula de Identidad Number" value="1.234.567-2"></lily-uruguay-cedula-de-identidad-input>',
        ) as unknown as UruguayCedulaDeIdentidadInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1.234.567-2");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-uruguay-cedula-de-identidad-input label="Cedula de Identidad Number" required disabled></lily-uruguay-cedula-de-identidad-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-uruguay-cedula-de-identidad-input label="Cedula de Identidad Number"></lily-uruguay-cedula-de-identidad-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Cedula de Identidad Number",
        );
    });
});
