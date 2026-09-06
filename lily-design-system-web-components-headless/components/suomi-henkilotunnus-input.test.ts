import { afterEach, describe, expect, test } from "vitest";

import { SuomiHenkilotunnusInput } from "./suomi-henkilotunnus-input.js";

if (!customElements.get("lily-suomi-henkilotunnus-input")) {
    customElements.define("lily-suomi-henkilotunnus-input", SuomiHenkilotunnusInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SuomiHenkilotunnusInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-suomi-henkilotunnus-input label="Henkilötunnus (HETU)"></lily-suomi-henkilotunnus-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("suomi-henkilotunnus-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-suomi-henkilotunnus-input label="Henkilötunnus (HETU)" autocomplete="on"></lily-suomi-henkilotunnus-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-suomi-henkilotunnus-input label="Henkilötunnus (HETU)" value="131052-308T"></lily-suomi-henkilotunnus-input>') as unknown as SuomiHenkilotunnusInput;

        expect(host.value).toBe("131052-308T");

        host.value = "010199-9021";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("010199-9021");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-suomi-henkilotunnus-input label="Henkilötunnus (HETU)" required disabled></lily-suomi-henkilotunnus-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-suomi-henkilotunnus-input label="Henkilötunnus (HETU)"></lily-suomi-henkilotunnus-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Henkilötunnus (HETU)");
    });
});
