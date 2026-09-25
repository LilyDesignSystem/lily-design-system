import { afterEach, describe, expect, test } from "vitest";

import { TurkiyeTcKimlikNumarasiInput } from "./turkiye-tc-kimlik-numarasi-input.js";

if (!customElements.get("lily-turkiye-tc-kimlik-numarasi-input")) {
    customElements.define("lily-turkiye-tc-kimlik-numarasi-input", TurkiyeTcKimlikNumarasiInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TurkiyeTcKimlikNumarasiInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-turkiye-tc-kimlik-numarasi-input label="T.C. Kimlik Numarası"></lily-turkiye-tc-kimlik-numarasi-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("turkiye-tc-kimlik-numarasi-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-turkiye-tc-kimlik-numarasi-input label="T.C. Kimlik Numarası" autocomplete="on"></lily-turkiye-tc-kimlik-numarasi-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-turkiye-tc-kimlik-numarasi-input label="T.C. Kimlik Numarası" value="12345678902"></lily-turkiye-tc-kimlik-numarasi-input>') as unknown as TurkiyeTcKimlikNumarasiInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("12345678902");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-turkiye-tc-kimlik-numarasi-input label="T.C. Kimlik Numarası" required disabled></lily-turkiye-tc-kimlik-numarasi-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-turkiye-tc-kimlik-numarasi-input label="T.C. Kimlik Numarası"></lily-turkiye-tc-kimlik-numarasi-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("T.C. Kimlik Numarası");
    });
});
