import { afterEach, describe, expect, test } from "vitest";

import { PortugalPassaporteInput } from "./portugal-passaporte-input.js";

if (!customElements.get("lily-portugal-passaporte-input")) {
    customElements.define("lily-portugal-passaporte-input", PortugalPassaporteInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PortugalPassaporteInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-portugal-passaporte-input label="Passaporte"></lily-portugal-passaporte-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("portugal-passaporte-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-portugal-passaporte-input label="Passaporte" autocomplete="on"></lily-portugal-passaporte-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-portugal-passaporte-input label="Passaporte" value="N123456"></lily-portugal-passaporte-input>') as unknown as PortugalPassaporteInput;

        expect(host.value).toBe("N123456");

        host.value = "P654321";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("P654321");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-portugal-passaporte-input label="Passaporte" required disabled></lily-portugal-passaporte-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-portugal-passaporte-input label="Passaporte"></lily-portugal-passaporte-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Passaporte");
    });
});
