import { afterEach, describe, expect, test } from "vitest";

import { IndonesiaNomorIndukKependudukanInput } from "./indonesia-nomor-induk-kependudukan-input.js";

if (!customElements.get("lily-indonesia-nomor-induk-kependudukan-input")) {
    customElements.define("lily-indonesia-nomor-induk-kependudukan-input", IndonesiaNomorIndukKependudukanInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("IndonesiaNomorIndukKependudukanInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-indonesia-nomor-induk-kependudukan-input label="Nomor Induk Kependudukan (NIK)"></lily-indonesia-nomor-induk-kependudukan-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("indonesia-nomor-induk-kependudukan-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-indonesia-nomor-induk-kependudukan-input label="Nomor Induk Kependudukan (NIK)" autocomplete="on"></lily-indonesia-nomor-induk-kependudukan-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-indonesia-nomor-induk-kependudukan-input label="Nomor Induk Kependudukan (NIK)" value="3171012501990001"></lily-indonesia-nomor-induk-kependudukan-input>') as unknown as IndonesiaNomorIndukKependudukanInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("3171012501990001");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-indonesia-nomor-induk-kependudukan-input label="Nomor Induk Kependudukan (NIK)" required disabled></lily-indonesia-nomor-induk-kependudukan-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-indonesia-nomor-induk-kependudukan-input label="Nomor Induk Kependudukan (NIK)"></lily-indonesia-nomor-induk-kependudukan-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Nomor Induk Kependudukan (NIK)");
    });
});
