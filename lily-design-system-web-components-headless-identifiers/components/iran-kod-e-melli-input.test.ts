import { afterEach, describe, expect, test } from "vitest";

import { IranKodEMelliInput } from "./iran-kod-e-melli-input.js";

if (!customElements.get("lily-iran-kod-e-melli-input")) {
    customElements.define("lily-iran-kod-e-melli-input", IranKodEMelliInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("IranKodEMelliInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-iran-kod-e-melli-input label="National Code (Kod-e Melli)"></lily-iran-kod-e-melli-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("iran-kod-e-melli-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-iran-kod-e-melli-input label="National Code (Kod-e Melli)" autocomplete="on"></lily-iran-kod-e-melli-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-iran-kod-e-melli-input label="National Code (Kod-e Melli)" value="0084575948"></lily-iran-kod-e-melli-input>',
        ) as unknown as IranKodEMelliInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("0084575948");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-iran-kod-e-melli-input label="National Code (Kod-e Melli)" required disabled></lily-iran-kod-e-melli-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-iran-kod-e-melli-input label="National Code (Kod-e Melli)"></lily-iran-kod-e-melli-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe(
            "National Code (Kod-e Melli)",
        );
    });
});
