import { afterEach, describe, expect, test } from "vitest";

import { SverigePersonnummerInput } from "./sverige-personnummer-input.js";

if (!customElements.get("lily-sverige-personnummer-input")) {
    customElements.define("lily-sverige-personnummer-input", SverigePersonnummerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SverigePersonnummerInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-sverige-personnummer-input label="Personnummer"></lily-sverige-personnummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("sverige-personnummer-input");
    });

    test("always forces autocomplete=off, even if the consumer tries to override it", () => {
        const host = render('<lily-sverige-personnummer-input label="Personnummer" autocomplete="on"></lily-sverige-personnummer-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-sverige-personnummer-input label="Personnummer" value="198507099805"></lily-sverige-personnummer-input>') as unknown as SverigePersonnummerInput;

        expect(host.value).toBe("198507099805");

        host.value = "199001011234";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("199001011234");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-sverige-personnummer-input label="Personnummer" required disabled></lily-sverige-personnummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-sverige-personnummer-input label="Personnummer"></lily-sverige-personnummer-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Personnummer");
    });
});
