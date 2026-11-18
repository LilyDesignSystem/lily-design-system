import { afterEach, describe, expect, test } from "vitest";

import { RepublicaDominicanaCedulaDeIdentidadYElectoralInput } from "./republica-dominicana-cedula-de-identidad-y-electoral-input.js";

if (!customElements.get("lily-republica-dominicana-cedula-de-identidad-y-electoral-input")) {
    customElements.define(
        "lily-republica-dominicana-cedula-de-identidad-y-electoral-input",
        RepublicaDominicanaCedulaDeIdentidadYElectoralInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RepublicaDominicanaCedulaDeIdentidadYElectoralInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-republica-dominicana-cedula-de-identidad-y-electoral-input label="Cédula de Identidad y Electoral"></lily-republica-dominicana-cedula-de-identidad-y-electoral-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("republica-dominicana-cedula-de-identidad-y-electoral-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-republica-dominicana-cedula-de-identidad-y-electoral-input label="Cédula de Identidad y Electoral" autocomplete="on"></lily-republica-dominicana-cedula-de-identidad-y-electoral-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-republica-dominicana-cedula-de-identidad-y-electoral-input label="Cédula de Identidad y Electoral" value="001-1391820-5"></lily-republica-dominicana-cedula-de-identidad-y-electoral-input>',
        ) as unknown as RepublicaDominicanaCedulaDeIdentidadYElectoralInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("001-1391820-5");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-republica-dominicana-cedula-de-identidad-y-electoral-input label="Cédula de Identidad y Electoral" required disabled></lily-republica-dominicana-cedula-de-identidad-y-electoral-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-republica-dominicana-cedula-de-identidad-y-electoral-input label="Cédula de Identidad y Electoral"></lily-republica-dominicana-cedula-de-identidad-y-electoral-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Cédula de Identidad y Electoral",
        );
    });
});
