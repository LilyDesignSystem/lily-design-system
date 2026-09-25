import { afterEach, describe, expect, test } from "vitest";

import { MagyarorszagTajSzamInput } from "./magyarorszag-taj-szam-input.js";

if (!customElements.get("lily-magyarorszag-taj-szam-input")) {
    customElements.define("lily-magyarorszag-taj-szam-input", MagyarorszagTajSzamInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MagyarorszagTajSzamInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-magyarorszag-taj-szam-input label="Társadalombiztosítási Azonosító Jel (TAJ)"></lily-magyarorszag-taj-szam-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("magyarorszag-taj-szam-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-magyarorszag-taj-szam-input label="Társadalombiztosítási Azonosító Jel (TAJ)" autocomplete="on"></lily-magyarorszag-taj-szam-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-magyarorszag-taj-szam-input label="Társadalombiztosítási Azonosító Jel (TAJ)" value="123 456 789"></lily-magyarorszag-taj-szam-input>') as unknown as MagyarorszagTajSzamInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("123 456 789");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-magyarorszag-taj-szam-input label="Társadalombiztosítási Azonosító Jel (TAJ)" required disabled></lily-magyarorszag-taj-szam-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-magyarorszag-taj-szam-input label="Társadalombiztosítási Azonosító Jel (TAJ)"></lily-magyarorszag-taj-szam-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Társadalombiztosítási Azonosító Jel (TAJ)");
    });
});
