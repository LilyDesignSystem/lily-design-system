import { afterEach, describe, expect, test } from "vitest";

import { PolskaPeselInput } from "./polska-pesel-input.js";

if (!customElements.get("lily-polska-pesel-input")) {
    customElements.define("lily-polska-pesel-input", PolskaPeselInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PolskaPeselInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-polska-pesel-input label="PESEL"></lily-polska-pesel-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("polska-pesel-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-polska-pesel-input label="PESEL" autocomplete="on"></lily-polska-pesel-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-polska-pesel-input label="PESEL" value="44051401359"></lily-polska-pesel-input>') as unknown as PolskaPeselInput;

        expect(host.value).toBe("44051401359");

        host.value = "02070803628";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("02070803628");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-polska-pesel-input label="PESEL" required disabled></lily-polska-pesel-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-polska-pesel-input label="PESEL"></lily-polska-pesel-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("PESEL");
    });
});
