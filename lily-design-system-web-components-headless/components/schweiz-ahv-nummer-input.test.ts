import { afterEach, describe, expect, test } from "vitest";

import { SchweizAhvNummerInput } from "./schweiz-ahv-nummer-input.js";

if (!customElements.get("lily-schweiz-ahv-nummer-input")) {
    customElements.define("lily-schweiz-ahv-nummer-input", SchweizAhvNummerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SchweizAhvNummerInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-schweiz-ahv-nummer-input label="AHV-Nummer / Numéro AVS"></lily-schweiz-ahv-nummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("schweiz-ahv-nummer-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-schweiz-ahv-nummer-input label="AHV-Nummer / Numéro AVS" autocomplete="on"></lily-schweiz-ahv-nummer-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-schweiz-ahv-nummer-input label="AHV-Nummer / Numéro AVS" value="756.1234.5678.97"></lily-schweiz-ahv-nummer-input>') as unknown as SchweizAhvNummerInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("756.1234.5678.97");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-schweiz-ahv-nummer-input label="AHV-Nummer / Numéro AVS" required disabled></lily-schweiz-ahv-nummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-schweiz-ahv-nummer-input label="AHV-Nummer / Numéro AVS"></lily-schweiz-ahv-nummer-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("AHV-Nummer / Numéro AVS");
    });
});
