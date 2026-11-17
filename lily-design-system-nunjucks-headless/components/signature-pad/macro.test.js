import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("signature-pad", () => {
    it("renders a <canvas>, hidden input, and clear button", () => {
        const { document } = render("signature-pad", {
            id: "sig",
            name: "signature",
            clearLabel: "Clear",
        });
        expect(document.querySelector("div.signature-pad")).toBeTruthy();
        const canvas = document.querySelector("canvas.signature-pad-canvas");
        expect(canvas).toBeTruthy();
        expect(canvas.getAttribute("role")).toBe("img");
        expect(canvas.getAttribute("width")).toBe("400");
        expect(
            document.querySelector("input[type=hidden].signature-pad-input").getAttribute("name"),
        ).toBe("signature");
        expect(document.querySelector("button.signature-pad-clear").textContent.trim()).toBe(
            "Clear",
        );
    });

    it("contains no <script> tags", () => {
        const { html } = render("signature-pad", {});
        expect(html).not.toContain("<script");
    });

    it("shows no clear button until it is named", () => {
        const { document } = render("signature-pad", { id: "sig" });
        expect(document.querySelector("button.signature-pad-clear")).toBeNull();
    });

    it("a named group with the attestation, a typed-name field and an outcome notice", () => {
        const { document } = render("signature-pad", {
            id: "consent",
            label: "Consent signature",
            attestation: "I confirm.",
            typedNameLabel: "Type your full name",
            typedName: "signature",
            outcome: "declined",
            outcomeLabel: "Declined to sign",
        });
        const root = document.querySelector(".signature-pad");
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-describedby")).toBe("consent-attestation");
        expect(root.firstElementChild.className).toBe("signature-pad-attestation");
        expect(root.getAttribute("data-outcome")).toBe("declined");
        const input = root.querySelector(".signature-pad-typed input");
        expect(root.querySelector(".signature-pad-typed label").getAttribute("for")).toBe(input.id);
        expect(input.getAttribute("name")).toBe("signature");
        expect(root.querySelector(".signature-pad-outcome").textContent).toBe("Declined to sign");
    });
});
