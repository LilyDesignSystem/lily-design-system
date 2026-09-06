import { afterEach, describe, expect, test } from "vitest";

import { NederlandPaspoortNummerInput } from "./nederland-paspoort-nummer-input.js";

if (!customElements.get("lily-nederland-paspoort-nummer-input")) {
    customElements.define("lily-nederland-paspoort-nummer-input", NederlandPaspoortNummerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NederlandPaspoortNummerInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-nederland-paspoort-nummer-input label="Paspoort Nummer"></lily-nederland-paspoort-nummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("nederland-paspoort-nummer-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-nederland-paspoort-nummer-input label="Paspoort Nummer" autocomplete="on"></lily-nederland-paspoort-nummer-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-nederland-paspoort-nummer-input label="Paspoort Nummer" value="NR1234567"></lily-nederland-paspoort-nummer-input>') as unknown as NederlandPaspoortNummerInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("NR1234567");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-nederland-paspoort-nummer-input label="Paspoort Nummer" required disabled></lily-nederland-paspoort-nummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-nederland-paspoort-nummer-input label="Paspoort Nummer"></lily-nederland-paspoort-nummer-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Paspoort Nummer");
    });
});
