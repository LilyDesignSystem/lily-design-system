import { afterEach, describe, expect, test } from "vitest";

import { LuxembourgMatriculeInput } from "./luxembourg-matricule-input.js";

if (!customElements.get("lily-luxembourg-matricule-input")) {
    customElements.define("lily-luxembourg-matricule-input", LuxembourgMatriculeInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LuxembourgMatriculeInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-luxembourg-matricule-input label="Numéro d\'Identification Nationale (Matricule)"></lily-luxembourg-matricule-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("luxembourg-matricule-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-luxembourg-matricule-input label="Numéro d\'Identification Nationale (Matricule)" autocomplete="on"></lily-luxembourg-matricule-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-luxembourg-matricule-input label="Numéro d\'Identification Nationale (Matricule)" value="1980010112345"></lily-luxembourg-matricule-input>') as unknown as LuxembourgMatriculeInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1980010112345");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-luxembourg-matricule-input label="Numéro d\'Identification Nationale (Matricule)" required disabled></lily-luxembourg-matricule-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-luxembourg-matricule-input label="Numéro d\'Identification Nationale (Matricule)"></lily-luxembourg-matricule-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Numéro d\'Identification Nationale (Matricule)");
    });
});
