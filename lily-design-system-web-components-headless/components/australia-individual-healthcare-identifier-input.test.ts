import { afterEach, describe, expect, test } from "vitest";

import { AustraliaIndividualHealthcareIdentifierInput } from "./australia-individual-healthcare-identifier-input.js";

if (!customElements.get("lily-australia-individual-healthcare-identifier-input")) {
    customElements.define("lily-australia-individual-healthcare-identifier-input", AustraliaIndividualHealthcareIdentifierInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AustraliaIndividualHealthcareIdentifierInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-australia-individual-healthcare-identifier-input label="ID"></lily-australia-individual-healthcare-identifier-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("australia-individual-healthcare-identifier-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-australia-individual-healthcare-identifier-input label="ID" autocomplete="on"></lily-australia-individual-healthcare-identifier-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-australia-individual-healthcare-identifier-input label="ID" value="8003608833357361"></lily-australia-individual-healthcare-identifier-input>') as unknown as AustraliaIndividualHealthcareIdentifierInput;

        expect(host.value).toBe("8003608833357361");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-australia-individual-healthcare-identifier-input label="ID" required disabled></lily-australia-individual-healthcare-identifier-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-australia-individual-healthcare-identifier-input label="Individual Healthcare Identifier"></lily-australia-individual-healthcare-identifier-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Individual Healthcare Identifier");
    });
});
