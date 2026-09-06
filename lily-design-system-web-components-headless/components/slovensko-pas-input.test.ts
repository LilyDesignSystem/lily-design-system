import { afterEach, describe, expect, test } from "vitest";

import { SlovenskoPasInput } from "./slovensko-pas-input.js";

if (!customElements.get("lily-slovensko-pas-input")) {
    customElements.define("lily-slovensko-pas-input", SlovenskoPasInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SlovenskoPasInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-slovensko-pas-input label="Pas"></lily-slovensko-pas-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("slovensko-pas-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-slovensko-pas-input label="Pas" autocomplete="on"></lily-slovensko-pas-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-slovensko-pas-input label="Pas" value="AB1234567"></lily-slovensko-pas-input>') as unknown as SlovenskoPasInput;

        expect(host.value).toBe("AB1234567");

        host.value = "CD7654321";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("CD7654321");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-slovensko-pas-input label="Pas" required disabled></lily-slovensko-pas-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-slovensko-pas-input label="Pas"></lily-slovensko-pas-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Pas");
    });
});
