import { afterEach, describe, expect, test } from "vitest";

import { LatvijaPersonasKodsInput } from "./latvija-personas-kods-input.js";

if (!customElements.get("lily-latvija-personas-kods-input")) {
    customElements.define("lily-latvija-personas-kods-input", LatvijaPersonasKodsInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LatvijaPersonasKodsInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-latvija-personas-kods-input label="Personas kods"></lily-latvija-personas-kods-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("latvija-personas-kods-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-latvija-personas-kods-input label="Personas kods" autocomplete="on"></lily-latvija-personas-kods-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-latvija-personas-kods-input label="Personas kods" value="090482-11234"></lily-latvija-personas-kods-input>') as unknown as LatvijaPersonasKodsInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("090482-11234");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-latvija-personas-kods-input label="Personas kods" required disabled></lily-latvija-personas-kods-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-latvija-personas-kods-input label="Personas kods"></lily-latvija-personas-kods-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Personas kods");
    });
});
