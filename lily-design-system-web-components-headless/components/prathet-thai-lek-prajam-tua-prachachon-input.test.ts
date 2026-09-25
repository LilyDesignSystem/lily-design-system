import { afterEach, describe, expect, test } from "vitest";

import { PrathetThaiLekPrajamTuaPrachachonInput } from "./prathet-thai-lek-prajam-tua-prachachon-input.js";

if (!customElements.get("lily-prathet-thai-lek-prajam-tua-prachachon-input")) {
    customElements.define("lily-prathet-thai-lek-prajam-tua-prachachon-input", PrathetThaiLekPrajamTuaPrachachonInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PrathetThaiLekPrajamTuaPrachachonInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-prathet-thai-lek-prajam-tua-prachachon-input label="เลขประจำตัวประชาชน (National ID)"></lily-prathet-thai-lek-prajam-tua-prachachon-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("prathet-thai-lek-prajam-tua-prachachon-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-prathet-thai-lek-prajam-tua-prachachon-input label="เลขประจำตัวประชาชน (National ID)" autocomplete="on"></lily-prathet-thai-lek-prajam-tua-prachachon-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-prathet-thai-lek-prajam-tua-prachachon-input label="เลขประจำตัวประชาชน (National ID)" value="1234567890123"></lily-prathet-thai-lek-prajam-tua-prachachon-input>') as unknown as PrathetThaiLekPrajamTuaPrachachonInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1234567890123");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-prathet-thai-lek-prajam-tua-prachachon-input label="เลขประจำตัวประชาชน (National ID)" required disabled></lily-prathet-thai-lek-prajam-tua-prachachon-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-prathet-thai-lek-prajam-tua-prachachon-input label="เลขประจำตัวประชาชน (National ID)"></lily-prathet-thai-lek-prajam-tua-prachachon-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("เลขประจำตัวประชาชน (National ID)");
    });
});
