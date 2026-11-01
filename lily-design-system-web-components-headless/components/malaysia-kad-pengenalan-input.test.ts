import { afterEach, describe, expect, test } from "vitest";

import { MalaysiaKadPengenalanInput } from "./malaysia-kad-pengenalan-input.js";

if (!customElements.get("lily-malaysia-kad-pengenalan-input")) {
    customElements.define("lily-malaysia-kad-pengenalan-input", MalaysiaKadPengenalanInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MalaysiaKadPengenalanInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render(
            '<lily-malaysia-kad-pengenalan-input label="MyKad Number (NRIC)"></lily-malaysia-kad-pengenalan-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("malaysia-kad-pengenalan-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render(
            '<lily-malaysia-kad-pengenalan-input label="MyKad Number (NRIC)" autocomplete="on"></lily-malaysia-kad-pengenalan-input>',
        );

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render(
            '<lily-malaysia-kad-pengenalan-input label="MyKad Number (NRIC)" value="900101-14-5678"></lily-malaysia-kad-pengenalan-input>',
        ) as unknown as MalaysiaKadPengenalanInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("900101-14-5678");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-malaysia-kad-pengenalan-input label="MyKad Number (NRIC)" required disabled></lily-malaysia-kad-pengenalan-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-malaysia-kad-pengenalan-input label="MyKad Number (NRIC)"></lily-malaysia-kad-pengenalan-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("MyKad Number (NRIC)");
    });
});
