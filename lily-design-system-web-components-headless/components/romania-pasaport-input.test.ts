import { afterEach, describe, expect, test } from "vitest";

import { RomaniaPasaportInput } from "./romania-pasaport-input.js";

if (!customElements.get("lily-romania-pasaport-input")) {
    customElements.define("lily-romania-pasaport-input", RomaniaPasaportInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RomaniaPasaportInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-romania-pasaport-input label="Pașaport"></lily-romania-pasaport-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("romania-pasaport-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-romania-pasaport-input label="Pașaport" autocomplete="on"></lily-romania-pasaport-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-romania-pasaport-input label="Pașaport" value="AB123456"></lily-romania-pasaport-input>') as unknown as RomaniaPasaportInput;

        expect(host.value).toBe("AB123456");

        host.value = "CD654321";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("CD654321");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-romania-pasaport-input label="Pașaport" required disabled></lily-romania-pasaport-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-romania-pasaport-input label="Pașaport"></lily-romania-pasaport-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Pașaport");
    });
});
