import { afterEach, describe, expect, test } from "vitest";

import { FranceNumeroDIdentificationAuRepertoireInput } from "./france-numero-d-identification-au-repertoire-input.js";

if (!customElements.get("lily-france-numero-d-identification-au-repertoire-input")) {
    customElements.define("lily-france-numero-d-identification-au-repertoire-input", FranceNumeroDIdentificationAuRepertoireInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FranceNumeroDIdentificationAuRepertoireInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-france-numero-d-identification-au-repertoire-input label="ID"></lily-france-numero-d-identification-au-repertoire-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("france-numero-d-identification-au-repertoire-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-france-numero-d-identification-au-repertoire-input label="ID" autocomplete="on"></lily-france-numero-d-identification-au-repertoire-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-france-numero-d-identification-au-repertoire-input label="ID" value="1 85 05 75 116 001 23"></lily-france-numero-d-identification-au-repertoire-input>') as unknown as FranceNumeroDIdentificationAuRepertoireInput;

        expect(host.value).toBe("1 85 05 75 116 001 23");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-france-numero-d-identification-au-repertoire-input label="ID" required disabled></lily-france-numero-d-identification-au-repertoire-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-france-numero-d-identification-au-repertoire-input label="Numéro d\'Identification au Répertoire"></lily-france-numero-d-identification-au-repertoire-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Numéro d'Identification au Répertoire");
    });
});
