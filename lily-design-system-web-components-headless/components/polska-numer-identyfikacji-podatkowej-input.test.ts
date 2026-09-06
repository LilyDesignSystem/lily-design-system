import { afterEach, describe, expect, test } from "vitest";

import { PolskaNumerIdentyfikacjiPodatkowejInput } from "./polska-numer-identyfikacji-podatkowej-input.js";

if (!customElements.get("lily-polska-numer-identyfikacji-podatkowej-input")) {
    customElements.define("lily-polska-numer-identyfikacji-podatkowej-input", PolskaNumerIdentyfikacjiPodatkowejInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PolskaNumerIdentyfikacjiPodatkowejInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-polska-numer-identyfikacji-podatkowej-input label="Numer Identyfikacji Podatkowej (NIP)"></lily-polska-numer-identyfikacji-podatkowej-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("polska-numer-identyfikacji-podatkowej-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-polska-numer-identyfikacji-podatkowej-input label="Numer Identyfikacji Podatkowej (NIP)" autocomplete="on"></lily-polska-numer-identyfikacji-podatkowej-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-polska-numer-identyfikacji-podatkowej-input label="Numer Identyfikacji Podatkowej (NIP)" value="1234563218"></lily-polska-numer-identyfikacji-podatkowej-input>') as unknown as PolskaNumerIdentyfikacjiPodatkowejInput;

        expect(host.value).toBe("1234563218");

        host.value = "5252445218";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("5252445218");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-polska-numer-identyfikacji-podatkowej-input label="Numer Identyfikacji Podatkowej (NIP)" required disabled></lily-polska-numer-identyfikacji-podatkowej-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-polska-numer-identyfikacji-podatkowej-input label="Numer Identyfikacji Podatkowej (NIP)"></lily-polska-numer-identyfikacji-podatkowej-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Numer Identyfikacji Podatkowej (NIP)");
    });
});
