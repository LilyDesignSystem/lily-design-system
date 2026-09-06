import { afterEach, describe, expect, test } from "vitest";

import { BulgariaEdinenGrazhdanskiNomerInput } from "./bulgaria-edinen-grazhdanski-nomer-input.js";

if (!customElements.get("lily-bulgaria-edinen-grazhdanski-nomer-input")) {
    customElements.define("lily-bulgaria-edinen-grazhdanski-nomer-input", BulgariaEdinenGrazhdanskiNomerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BulgariaEdinenGrazhdanskiNomerInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-bulgaria-edinen-grazhdanski-nomer-input label="ID"></lily-bulgaria-edinen-grazhdanski-nomer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("bulgaria-edinen-grazhdanski-nomer-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-bulgaria-edinen-grazhdanski-nomer-input label="ID" autocomplete="on"></lily-bulgaria-edinen-grazhdanski-nomer-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-bulgaria-edinen-grazhdanski-nomer-input label="ID" value="7523169263"></lily-bulgaria-edinen-grazhdanski-nomer-input>') as unknown as BulgariaEdinenGrazhdanskiNomerInput;

        expect(host.value).toBe("7523169263");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-bulgaria-edinen-grazhdanski-nomer-input label="ID" required disabled></lily-bulgaria-edinen-grazhdanski-nomer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-bulgaria-edinen-grazhdanski-nomer-input label="Edinen Grazhdanski Nomer"></lily-bulgaria-edinen-grazhdanski-nomer-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Edinen Grazhdanski Nomer");
    });
});
