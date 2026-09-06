import { afterEach, describe, expect, test } from "vitest";

import { EireIndividualHealthIdentifierInput } from "./eire-individual-health-identifier-input.js";

if (!customElements.get("lily-eire-individual-health-identifier-input")) {
    customElements.define("lily-eire-individual-health-identifier-input", EireIndividualHealthIdentifierInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EireIndividualHealthIdentifierInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-eire-individual-health-identifier-input label="Individual Health Identifier (IHI)"></lily-eire-individual-health-identifier-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("eire-individual-health-identifier-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-eire-individual-health-identifier-input label="Individual Health Identifier (IHI)" autocomplete="on"></lily-eire-individual-health-identifier-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-eire-individual-health-identifier-input label="Individual Health Identifier (IHI)" value="1234567890"></lily-eire-individual-health-identifier-input>') as unknown as EireIndividualHealthIdentifierInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1234567890");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-eire-individual-health-identifier-input label="Individual Health Identifier (IHI)" required disabled></lily-eire-individual-health-identifier-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-eire-individual-health-identifier-input label="Individual Health Identifier (IHI)"></lily-eire-individual-health-identifier-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Individual Health Identifier (IHI)");
    });

    test("has the documented pattern and inputmode", () => {
        const host = render('<lily-eire-individual-health-identifier-input label="Individual Health Identifier (IHI)"></lily-eire-individual-health-identifier-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.getAttribute("pattern")).toBe("[0-9]{10}");
        expect(input.getAttribute("inputmode")).toBe("numeric");
    });
});
