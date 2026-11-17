import { afterEach, describe, expect, test } from "vitest";

import { SignaturePad } from "./signature-pad.js";

if (!customElements.get("lily-signature-pad")) {
    customElements.define("lily-signature-pad", SignaturePad);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SignaturePad", () => {
    test("a named group, not an application, holding a canvas drawing surface", () => {
        const host = render(
            '<lily-signature-pad label="Sign to accept the terms"></lily-signature-pad>',
        );
        const root = host.querySelector(":scope > div.signature-pad") as HTMLElement;
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Sign to accept the terms");
        expect(root.querySelector("canvas.signature-pad-canvas")).not.toBeNull();
        expect(host.querySelector('[role="application"]')).toBeNull();
    });

    test("the attestation is shown first and is the group's description", () => {
        const host = render(
            '<lily-signature-pad label="Consent" attestation="I confirm."></lily-signature-pad>',
        );
        const root = host.querySelector("div.signature-pad") as HTMLElement;
        const attestation = root.firstElementChild as HTMLElement;
        expect(attestation.className).toBe("signature-pad-attestation");
        expect(root.getAttribute("aria-describedby")).toBe(attestation.id);
    });

    test("a typed-name field means drawing is never the only way to sign", () => {
        const host = render(
            '<lily-signature-pad label="Consent" typed-name-label="Type your full name" name="signature"></lily-signature-pad>',
        );
        const input = host.querySelector(".signature-pad-typed input") as HTMLInputElement;
        const label = host.querySelector(".signature-pad-typed label") as HTMLLabelElement;
        expect(label.htmlFor).toBe(input.id);
        expect(label.textContent).toBe("Type your full name");
        expect(input.name).toBe("signature");
        expect(input.autocomplete).toBe("name");
    });

    test("an outcome other than signed is a notice in the consumer's words, and data-outcome", () => {
        const host = render(
            '<lily-signature-pad label="Consent" outcome="declined" outcome-label="Declined to sign"></lily-signature-pad>',
        );
        const root = host.querySelector("div.signature-pad") as HTMLElement;
        expect(root.getAttribute("data-outcome")).toBe("declined");
        expect(root.querySelector(".signature-pad-outcome")?.textContent).toBe("Declined to sign");
    });
});
