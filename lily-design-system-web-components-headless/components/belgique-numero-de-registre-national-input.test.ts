import { afterEach, describe, expect, test } from "vitest";

import { BelgiqueNumeroDeRegistreNationalInput } from "./belgique-numero-de-registre-national-input.js";

if (!customElements.get("lily-belgique-numero-de-registre-national-input")) {
    customElements.define("lily-belgique-numero-de-registre-national-input", BelgiqueNumeroDeRegistreNationalInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BelgiqueNumeroDeRegistreNationalInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-belgique-numero-de-registre-national-input label="ID"></lily-belgique-numero-de-registre-national-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("belgique-numero-de-registre-national-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-belgique-numero-de-registre-national-input label="ID" autocomplete="on"></lily-belgique-numero-de-registre-national-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-belgique-numero-de-registre-national-input label="ID" value="85073003328"></lily-belgique-numero-de-registre-national-input>') as unknown as BelgiqueNumeroDeRegistreNationalInput;

        expect(host.value).toBe("85073003328");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-belgique-numero-de-registre-national-input label="ID" required disabled></lily-belgique-numero-de-registre-national-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-belgique-numero-de-registre-national-input label="Numéro de Registre National"></lily-belgique-numero-de-registre-national-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Numéro de Registre National");
    });
});
