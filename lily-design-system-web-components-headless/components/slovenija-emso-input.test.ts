import { afterEach, describe, expect, test } from "vitest";

import { SlovenijaEmsoInput } from "./slovenija-emso-input.js";

if (!customElements.get("lily-slovenija-emso-input")) {
    customElements.define("lily-slovenija-emso-input", SlovenijaEmsoInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SlovenijaEmsoInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-slovenija-emso-input label="Enotna Matična Številka Občana (EMŠO)"></lily-slovenija-emso-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("slovenija-emso-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-slovenija-emso-input label="Enotna Matična Številka Občana (EMŠO)" autocomplete="on"></lily-slovenija-emso-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-slovenija-emso-input label="Enotna Matična Številka Občana (EMŠO)" value="0101006500006"></lily-slovenija-emso-input>') as unknown as SlovenijaEmsoInput;

        expect(host.value).toBe("0101006500006");

        host.value = "1502985500013";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1502985500013");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-slovenija-emso-input label="Enotna Matična Številka Občana (EMŠO)" required disabled></lily-slovenija-emso-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-slovenija-emso-input label="Enotna Matična Številka Občana (EMŠO)"></lily-slovenija-emso-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Enotna Matična Številka Občana (EMŠO)");
    });
});
