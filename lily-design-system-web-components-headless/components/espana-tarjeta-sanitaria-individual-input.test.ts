import { afterEach, describe, expect, test } from "vitest";

import { EspanaTarjetaSanitariaIndividualInput } from "./espana-tarjeta-sanitaria-individual-input.js";

if (!customElements.get("lily-espana-tarjeta-sanitaria-individual-input")) {
    customElements.define("lily-espana-tarjeta-sanitaria-individual-input", EspanaTarjetaSanitariaIndividualInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EspanaTarjetaSanitariaIndividualInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-espana-tarjeta-sanitaria-individual-input label="ID"></lily-espana-tarjeta-sanitaria-individual-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("espana-tarjeta-sanitaria-individual-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-espana-tarjeta-sanitaria-individual-input label="ID" autocomplete="on"></lily-espana-tarjeta-sanitaria-individual-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-espana-tarjeta-sanitaria-individual-input label="ID" value="AA1234567"></lily-espana-tarjeta-sanitaria-individual-input>') as unknown as EspanaTarjetaSanitariaIndividualInput;

        expect(host.value).toBe("AA1234567");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-espana-tarjeta-sanitaria-individual-input label="ID" required disabled></lily-espana-tarjeta-sanitaria-individual-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-espana-tarjeta-sanitaria-individual-input label="Tarjeta Sanitaria Individual"></lily-espana-tarjeta-sanitaria-individual-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Tarjeta Sanitaria Individual");
    });
});
