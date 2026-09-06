import { afterEach, describe, expect, test } from "vitest";

import { NederlandIdentiteitskaartNummerInput } from "./nederland-identiteitskaart-nummer-input.js";

if (!customElements.get("lily-nederland-identiteitskaart-nummer-input")) {
    customElements.define("lily-nederland-identiteitskaart-nummer-input", NederlandIdentiteitskaartNummerInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NederlandIdentiteitskaartNummerInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-nederland-identiteitskaart-nummer-input label="Identiteitskaart Nummer"></lily-nederland-identiteitskaart-nummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("nederland-identiteitskaart-nummer-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-nederland-identiteitskaart-nummer-input label="Identiteitskaart Nummer" autocomplete="on"></lily-nederland-identiteitskaart-nummer-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-nederland-identiteitskaart-nummer-input label="Identiteitskaart Nummer" value="PX1234567"></lily-nederland-identiteitskaart-nummer-input>') as unknown as NederlandIdentiteitskaartNummerInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("PX1234567");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-nederland-identiteitskaart-nummer-input label="Identiteitskaart Nummer" required disabled></lily-nederland-identiteitskaart-nummer-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-nederland-identiteitskaart-nummer-input label="Identiteitskaart Nummer"></lily-nederland-identiteitskaart-nummer-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Identiteitskaart Nummer");
    });
});
