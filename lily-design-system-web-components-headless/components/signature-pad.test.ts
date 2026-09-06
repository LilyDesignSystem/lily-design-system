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
    test("renders a native canvas with the base class", () => {
        const host = render('<lily-signature-pad label="Sign to accept the terms"></lily-signature-pad>');

        expect(host.querySelector("canvas")!.className).toBe("signature-pad");
    });

    test("has role=application", () => {
        const host = render('<lily-signature-pad label="Sign to accept the terms"></lily-signature-pad>');

        expect(host.querySelector("canvas")!.getAttribute("role")).toBe("application");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-signature-pad label="Sign to accept the terms"></lily-signature-pad>');

        expect(host.querySelector("canvas")!.getAttribute("aria-label")).toBe("Sign to accept the terms");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-signature-pad label="Sign" class="wide"></lily-signature-pad>');

        expect(host.querySelector("canvas")!.className).toBe("signature-pad wide");
    });

    test("passes rest attributes (e.g. width/height) through onto the canvas", () => {
        const host = render('<lily-signature-pad label="Sign" width="400" height="150"></lily-signature-pad>');

        const canvas = host.querySelector("canvas") as HTMLCanvasElement;
        expect(canvas.width).toBe(400);
        expect(canvas.height).toBe(150);
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-signature-pad label="Sign"></lily-signature-pad>');

        (host as unknown as SignaturePad).connectedCallback();

        expect(host.querySelectorAll("canvas").length).toBe(1);
    });
});
