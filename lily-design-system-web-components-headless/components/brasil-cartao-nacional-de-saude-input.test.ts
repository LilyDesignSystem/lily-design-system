import { afterEach, describe, expect, test } from "vitest";

import { BrasilCartaoNacionalDeSaudeInput } from "./brasil-cartao-nacional-de-saude-input.js";

if (!customElements.get("lily-brasil-cartao-nacional-de-saude-input")) {
    customElements.define("lily-brasil-cartao-nacional-de-saude-input", BrasilCartaoNacionalDeSaudeInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BrasilCartaoNacionalDeSaudeInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-brasil-cartao-nacional-de-saude-input label="Cartão Nacional de Saúde (CNS)"></lily-brasil-cartao-nacional-de-saude-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("brasil-cartao-nacional-de-saude-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-brasil-cartao-nacional-de-saude-input label="Cartão Nacional de Saúde (CNS)" autocomplete="on"></lily-brasil-cartao-nacional-de-saude-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-brasil-cartao-nacional-de-saude-input label="Cartão Nacional de Saúde (CNS)" value="123 4567 8901 234"></lily-brasil-cartao-nacional-de-saude-input>') as unknown as BrasilCartaoNacionalDeSaudeInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("123 4567 8901 234");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-brasil-cartao-nacional-de-saude-input label="Cartão Nacional de Saúde (CNS)" required disabled></lily-brasil-cartao-nacional-de-saude-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-brasil-cartao-nacional-de-saude-input label="Cartão Nacional de Saúde (CNS)"></lily-brasil-cartao-nacional-de-saude-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Cartão Nacional de Saúde (CNS)");
    });
});
