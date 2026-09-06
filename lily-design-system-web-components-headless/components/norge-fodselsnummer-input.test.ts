import { afterEach, describe, expect, test } from "vitest";

import { NorgeFodselsnummerInput } from "./norge-fodselsnummer-input.js";

if (!customElements.get("lily-norge-fodselsnummer-input")) {
    customElements.define("lily-norge-fodselsnummer-input", NorgeFodselsnummerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NorgeFodselsnummerInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-norge-fodselsnummer-input label="Fødselsnummer"></lily-norge-fodselsnummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("norge-fodselsnummer-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-norge-fodselsnummer-input label="Fødselsnummer" autocomplete="on"></lily-norge-fodselsnummer-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-norge-fodselsnummer-input label="Fødselsnummer" value="01129012345"></lily-norge-fodselsnummer-input>') as unknown as NorgeFodselsnummerInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("01129012345");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-norge-fodselsnummer-input label="Fødselsnummer" required disabled></lily-norge-fodselsnummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-norge-fodselsnummer-input label="Fødselsnummer"></lily-norge-fodselsnummer-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Fødselsnummer");
    });
});
