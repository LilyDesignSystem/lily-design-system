import { afterEach, describe, expect, test } from "vitest";

import { ColombiaCedulaDeCiudadaniaInput } from "./colombia-cedula-de-ciudadania-input.js";

if (!customElements.get("lily-colombia-cedula-de-ciudadania-input")) {
    customElements.define(
        "lily-colombia-cedula-de-ciudadania-input",
        ColombiaCedulaDeCiudadaniaInput,
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ColombiaCedulaDeCiudadaniaInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-colombia-cedula-de-ciudadania-input label="Cedula de Ciudadania Number"></lily-colombia-cedula-de-ciudadania-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("colombia-cedula-de-ciudadania-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-colombia-cedula-de-ciudadania-input label="Cedula de Ciudadania Number" autocomplete="on"></lily-colombia-cedula-de-ciudadania-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-colombia-cedula-de-ciudadania-input label="Cedula de Ciudadania Number" value="1.020.304.050"></lily-colombia-cedula-de-ciudadania-input>',
        ) as unknown as ColombiaCedulaDeCiudadaniaInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1.020.304.050");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-colombia-cedula-de-ciudadania-input label="Cedula de Ciudadania Number" required disabled></lily-colombia-cedula-de-ciudadania-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-colombia-cedula-de-ciudadania-input label="Cedula de Ciudadania Number"></lily-colombia-cedula-de-ciudadania-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "Cedula de Ciudadania Number",
        );
    });
});
