import { afterEach, describe, expect, test } from "vitest";

import { ChileRolUnicoNacionalInput } from "./chile-rol-unico-nacional-input.js";

if (!customElements.get("lily-chile-rol-unico-nacional-input")) {
    customElements.define("lily-chile-rol-unico-nacional-input", ChileRolUnicoNacionalInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ChileRolUnicoNacionalInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-chile-rol-unico-nacional-input label="Rol Único Nacional (RUN)"></lily-chile-rol-unico-nacional-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("chile-rol-unico-nacional-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-chile-rol-unico-nacional-input label="Rol Único Nacional (RUN)" autocomplete="on"></lily-chile-rol-unico-nacional-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-chile-rol-unico-nacional-input label="Rol Único Nacional (RUN)" value="12345678-K"></lily-chile-rol-unico-nacional-input>') as unknown as ChileRolUnicoNacionalInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("12345678-K");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-chile-rol-unico-nacional-input label="Rol Único Nacional (RUN)" required disabled></lily-chile-rol-unico-nacional-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-chile-rol-unico-nacional-input label="Rol Único Nacional (RUN)"></lily-chile-rol-unico-nacional-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Rol Único Nacional (RUN)");
    });
});
